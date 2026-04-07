/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase";

export const saveGeneratedQRCode = async (data: any, userId: string | null) => {
  const { workspaceId, ...rest } = data;
  return await addDoc(collection(db, "qrcodes"), {
    ...rest,
    workspaceId: workspaceId ?? null,
    ownerId: userId || "anonymous",
    createdAt: serverTimestamp(),
    scanCount: 0,
  });
};

export const identifyAndRecordScan = async (
  scannedText: string,
  userId: string | null
) => {
  if (scannedText.includes("#qr_studip_")) {
    const hash = scannedText.split("#qr_studio_")[1];

    const q = query(
      collection(db, "qrcodes"),
      where("hash", "==", hash),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const qrDoc = querySnapshot.docs[0];

      await addDoc(collection(db, "scans"), {
        qrId: qrDoc.id,
        userId: userId || "anonymous",
        type: "internal",
        createdAt: serverTimestamp(),
        metadata: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
        },
      });

      await updateDoc(doc(db, "qrcodes", qrDoc.id), {
        scanCount: increment(1),
      });

      return { isInternal: true, data: qrDoc.data() };
    }
  }
  if (userId) {
    await addDoc(collection(db, "scans"), {
      rawContent: scannedText,
      scannerId: userId,
      type: "external",
      qrId: "",
      userId: "anonymous",
      createdAt: serverTimestamp(),
      metadata: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
      },
    });
  }

  return { isInternal: false };
};
