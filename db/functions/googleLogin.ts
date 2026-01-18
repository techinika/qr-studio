/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  collection,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "sonner";

const provider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "profiles", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const workspaceId = `personal-${user.uid}`;
      const batch = writeBatch(db);

      batch.set(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        defaultWorkspaceId: workspaceId,
        language: "English (US)",
        timezone: "(GMT+02:00) Central Africa Time",
        notificationsEnabled: true,
      });

      const workspaceRef = doc(db, "workspaces", workspaceId);
      batch.set(workspaceRef, {
        name: "Personal Workspace",
        ownerId: user.uid,
        members: [user.uid],
        type: "personal",
        createdAt: serverTimestamp(),
      });

      const membershipRef = doc(collection(db, "workspaceMembers"));
      batch.set(membershipRef, {
        workspaceId: workspaceId,
        workspaceName: "Personal Workspace",
        email: user.email,
        uid: user.uid,
        role: "Owner",
        status: "active",
        createdAt: serverTimestamp(),
      });

      await batch.commit();

      toast.success("Account and Personal Workspace created!");
    } else {
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
    }

    return user;
  } catch (error: any) {
    toast.error(error?.message ?? "Login failed.");
    throw error;
  }
};
