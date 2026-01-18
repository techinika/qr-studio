"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSubscription } from "@/lib/SubscriptionContext";
import SubscribePage from "./workspace/SubscribePage";
import { Home, LogOut } from "lucide-react";
import { auth } from "@/db/firebase";

export const SubscriptionGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isSubscribed, loading } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (!isSubscribed) {
      router.push("/subscribe");
    }
  }, [isSubscribed, loading, router]);

  const handleSignOut = () => auth.signOut().then(() => router.push("/login"));

  return isSubscribed ? (
    <>{children}</>
  ) : (
    <div>
      <div className="flex items-center justify-between p-3">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 text-team-500 font-bold text-sm transition-all"
        >
          <Home size={18} /> Home
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-sm transition-all"
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>
      <SubscribePage />
    </div>
  );
};
