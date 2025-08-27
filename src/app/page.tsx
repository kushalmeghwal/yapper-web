"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
    
      const token = localStorage.getItem("token");
      if (token) {
         requestAnimationFrame(() => router.push("/search"));
      } else {
        requestAnimationFrame(() => router.push("/home"));
      }
    }, 2500); // 2.5 second splash

    return () => clearTimeout(timer);
  }, [router]);

  return (
      <div className="flex min-h-screen items-center justify-center bg-purple-700">
      <motion.h1
        initial={{ scale: 0.2 }}
        animate={{ scale: 1.5 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="text-white text-4xl md:text-6xl font-bold tracking-widest"
      >
        YAPPER!!
      </motion.h1>
    </div>
  );
}
