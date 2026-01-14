/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";
import { auth, db } from "@/db/firebase";
import Loading from "@/app/loading";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  workspace: any | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  workspace: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [workspace, setWorkspace] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);

        const profileRef = doc(db, "profiles", firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          setProfile(profileData);

          const wsRef = doc(db, "workspaces", profileData.defaultWorkspaceId);
          onSnapshot(wsRef, (doc) => {
            setWorkspace(doc.data());
            setLoading(false);
          });
        }
      } else {
        setUser(null);
        setProfile(null);
        setWorkspace(null);
        setLoading(false);

        if (pathname.startsWith("/workspace")) {
          router.push("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user, profile, workspace, loading }}>
      {!loading ? children : <Loading />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
