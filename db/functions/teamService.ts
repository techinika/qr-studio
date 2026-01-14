import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const createNewTeam = async (
  teamName: string,
  ownerUid: string,
  inviteEmails: string[]
) => {
  try {
    const docRef = await addDoc(collection(db, "workspaces"), {
      name: teamName,
      type: "team",
      ownerId: ownerUid,
      members: [ownerUid],
      invitedEmails: inviteEmails,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
};
