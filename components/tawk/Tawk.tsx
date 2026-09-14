"use client";
import React, { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>;
    Tawk_LoadStart?: Date;
  }
}

const Tawk = () => {
  useEffect(() => {
    // Ensure script loads only in the browser
    if (typeof window === "undefined") return;

    // Prevent script from being added twice
    if (document.getElementById("tawk-script")) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = "tawk-script";
    script.async = true;
    script.src = "https://embed.tawk.to/6aa62e989117af34473d9f7a/1k2cic1vp";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    document.head.appendChild(script);

    return () => {
      // Optional cleanup if component is unmounted
      script.remove();
    };
  }, []);

  return (
    <span className="z-100 fixed bottom-20 right-0" title="Chat with us">
      {/* Tawk widget loads automatically; no UI needed */}
    </span>
  );
};

export default Tawk;