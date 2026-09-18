"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CertificationPage() {
  return (
    <>
      <Link
        href="/"
        className="inline-flex items-center text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back</span>
      </Link>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10">

        <h1 className="text-2xl font-bold mb-6 text-gray-800">Certification</h1>
        <p className="mb-4 text-gray-600">
          This certificate verifies the authenticity and validity of our Company.
        </p>
        <div className="border rounded-lg shadow-lg bg-white p-4">
          <Image
            src="/zLABF1dpPoZjnXv6hRYQsNwOgjwMkp964PezGpS9NwlIKhmtk5avynJ.jpg"
            alt="ArroxChain-Certification"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
      </div>
    </>
  );
}
