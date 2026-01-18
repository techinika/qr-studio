/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/db/firebase";

interface SubContextType {
  isSubscribed: boolean;
  subscription: any;
  loading: boolean;
}

const SubscriptionContext = createContext<SubContextType>({
  isSubscribed: false,
  subscription: null,
  loading: true,
});

export const SubscriptionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "subscriptions", user.uid), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const now = new Date();
        const expiry = data.expiresAt?.toDate();

        const active = data.status === "SUBSCRIBED" && expiry > now;

        setSubscription({ ...data, isActive: active });
      } else {
        setSubscription(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  return (
    <SubscriptionContext.Provider
      value={{
        isSubscribed: subscription ? !!subscription?.isActive : false,
        subscription,
        loading,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
