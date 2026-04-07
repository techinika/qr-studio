/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AdBanner.tsx
"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function AdBanner() {
  const { user } = useAuth();
  
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  if (user) {
    return null;
  }

  return (
    <div className="my-8 flex justify-center overflow-hidden">
      <div className="text-center w-full">
        <p className="text-[10px] text-slate-300 uppercase tracking-widest mb-2">
          Advertisement
        </p>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-1268572467254702"
          data-ad-slot="6572117863"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
}
