"use client"

import React from "react"
import { ChevronRight, Home } from "lucide-react"
import { useRouter } from "next/navigation"

interface BreadcrumbsProps {
  currentPageTitle: string
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentPageTitle,
}) => {
  const router = useRouter()

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center space-x-2 text-xs text-slate-400"
    >
      <button
        type="button"
        onClick={() => router.push("/")}
        className="flex items-center transition-colors hover:text-blue-400"
      >
        <Home className="mr-1 h-3.5 w-3.5" />
        <span>Home</span>
      </button>
      <ChevronRight className="h-3 w-3 text-slate-500" />
      <span className="font-semibold text-slate-200" aria-current="page">
        {currentPageTitle}
      </span>
    </nav>
  )
}
