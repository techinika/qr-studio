/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
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

      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        defaultWorkspaceId: workspaceId,
      });

      const workspaceRef = doc(db, "workspaces", workspaceId);
      await setDoc(workspaceRef, {
        name: "Personal Workspace",
        ownerId: user.uid,
        members: [user.uid],
        type: "personal",
        createdAt: serverTimestamp(),
      });

      toast.success("Account and Personal Workspace created!");
    } else {
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
      });
      console.log("Welcome back!");
    }

    return user;
  } catch (error: any) {
    toast.error(error?.message ?? "Login failed.");
    throw error;
  }
};
