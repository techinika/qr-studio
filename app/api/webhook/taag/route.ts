/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db/firebase";
import crypto from "crypto";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);
    const signatureHeader = req.headers.get("taag-signature") || "";

    const secretHash = process.env.TAAG_WEBHOOK_SECRET!;
    const [tPart, sPart] = signatureHeader.split(",");
    const timestamp = tPart.split("=")[1];
    const providedSignature = sPart.split("=")[1];

    const signedPayload = `${timestamp}#${bodyText}`;
    const expectedSignature = crypto
      .createHmac("sha256", secretHash)
      .update(signedPayload)
      .digest("hex");

    if (providedSignature !== expectedSignature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { event, data } = body;

    if (event === "Subscribed") {
      const profilesRef = collection(db, "profiles");
      const q = query(profilesRef, where("email", "==", data.email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("No profile found for email:", data.email);
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 },
        );
      }

      const userDoc = querySnapshot.docs[0];
      const userId = userDoc.id;

      const expiresAt = new Date();
      if (data.interval === "MONTHLY")
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      else if (data.interval === "YEARLY")
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      else expiresAt.setFullYear(2100); // Lifetime

      const subRef = doc(db, "subscriptions", userId);
      await setDoc(
        subRef,
        {
          userId,
          subscriberId: data.subscriberId,
          planId: data.planId,
          status: "SUBSCRIBED",
          email: data.email,
          startDate: new Date(),
          expiresAt: expiresAt,
          mode: data.mode,
          updatedAt: new Date(),
        },
        { merge: true },
      );
    }

    // 3. Handle Unsubscribed Event
    if (event === "Unsubscribed") {
      const subsRef = collection(db, "subscriptions");
      const q = query(subsRef, where("subscriberId", "==", data.subscriberId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const subDocRef = doc(db, "subscriptions", querySnapshot.docs[0].id);
        await updateDoc(subDocRef, {
          status: "UNSUBSCRIBED",
          updatedAt: new Date(),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
