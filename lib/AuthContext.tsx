/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/db/firebase";
import Loading from "@/app/loading";
import { Profile } from "@/types/user";
import { Team } from "@/types/team";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  workspace: Team | null;
  allWorkspaces: any[]; // Updated to any to include 'status'
  setActiveWorkspace: (id: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  workspace: null,
  allWorkspaces: [],
  setActiveWorkspace: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workspace, setWorkspace] = useState<Team | null>(null);
  const [allWorkspaces, setAllWorkspaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const setActiveWorkspace = async (id: string) => {
    if (!user) return;
    try {
      const wsRef = doc(db, "workspaces", id);
      const snap = await getDoc(wsRef);
      if (snap.exists()) {
        await updateDoc(doc(db, "profiles", user.uid), {
          defaultWorkspaceId: id,
        });
        window.location.reload();
      }
    } catch (error: any) {
      toast.error(error?.message ?? "Error switching workspace!");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const profileRef = doc(db, "profiles", firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data() as Profile;
          setProfile(profileData);

          const q = query(
            collection(db, "workspaceMembers"),
            where("email", "==", firebaseUser.email),
          );

          const unsubWorkspaces = onSnapshot(q, (snapshot) => {
            const ws = snapshot.docs.map((doc) => ({
              id: doc.data().workspaceId,
              name: doc.data().workspaceName || "Unnamed Team",
              status: doc.data().status,
              role: doc.data().role,
            }));
            setAllWorkspaces(ws);
          });

          const wsRef = doc(db, "workspaces", profileData.defaultWorkspaceId);
          const unsubActiveWs = onSnapshot(wsRef, (docSnap) => {
            if (docSnap.exists()) {
              setWorkspace({ id: docSnap.id, ...docSnap.data() } as Team);
            }
            setLoading(false);
          });

          return () => {
            unsubWorkspaces();
            unsubActiveWs();
          };
        } else {
          setLoading(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        setWorkspace(null);
        setAllWorkspaces([]);
        setLoading(false);
        if (pathname.startsWith("/workspace")) router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        workspace,
        allWorkspaces,
        setActiveWorkspace,
        loading,
      }}
    >
      {!loading ? children : <Loading />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
