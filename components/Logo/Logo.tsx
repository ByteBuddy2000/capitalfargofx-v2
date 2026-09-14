"use client"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const Logo = () => {
  return (
    <div>
      {/* Brand Logo */}
      <Link
        href="/"
        className="group flex cursor-pointer items-center gap-2.5 text-left focus:outline-none"
      >
        <div className="">
          <Image
            src="/capitalsfargofx-logo.png"
            width={1055}
            height={1055}
            alt="CapitalsFargoFX Logo"
            className="h-20 w-20"
            priority
          />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-white">
              CapitalsFargo<span className="text-blue-400">FX</span>
            </span>
          </div>
          <p className="-mt-0.5 text-[10px] font-medium tracking-wider text-slate-400 uppercase">
            Digital Asset Management
          </p>
        </div>
      </Link>
    </div>
  )
}

export default Logo
