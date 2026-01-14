import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";

export const recordAnyScan = async (
  scannedValue: string,
  userId: string | null
) => {
  try {
    const qrQuery = query(
      collection(db, "qrcodes"),
      where("content", "==", scannedValue),
      limit(1)
    );
    const qrSnap = await getDocs(qrQuery);
    const isInternal = !qrSnap.empty;
    const qrDoc = isInternal ? qrSnap.docs[0] : null;

    // 2. Log the scan event
    const scanData = {
      rawContent: scannedValue,
      scannerId: userId || "anonymous",
      timestamp: serverTimestamp(),
      isInternal: isInternal,
      qrId: isInternal ? qrDoc?.id : null,
      deviceInfo: {
        browser: navigator.userAgent,
        platform: navigator.platform,
      },
    };

    await addDoc(collection(db, "scans"), scanData);

    if (isInternal && qrDoc) {
      await updateDoc(doc(db, "qrcodes", qrDoc.id), {
        scanCount: increment(1),
      });
    }

    return { isInternal, data: scanData };
  } catch (error) {
    console.error("Error recording scan:", error);
  }
};
