"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSubscription } from "@/lib/SubscriptionContext";
import Loading from "@/app/loading";

export const SubscriptionGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isSubscribed, loading } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isSubscribed) {
      router.push("/subscribe");
    }
  }, [isSubscribed, loading, router]);

  if (loading) {
    return <Loading />;
  }

  return isSubscribed ? <>{children}</> : null;
};
