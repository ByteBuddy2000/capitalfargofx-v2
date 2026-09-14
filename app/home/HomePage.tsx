"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Hero } from "@/components/hero/Hero"
import { MetricsSection } from "@/components/sections/MetricsSection"
import {
  VideoShowcaseSectionOne,
  VideoShowcaseSectionTwo,
} from "@/components/sections/VideoShowcase"
import { AboutPreview } from "@/components/sections/AboutPreview"
import { WhyUsSection } from "@/components/sections/WhyUsSection"
import { InvestmentPlansSection } from "@/components/sections/InvestmentPlansSection"
import { YieldSimulator } from "@/components/simulator/YieldSimulator"
import { SupportedCryptoSection } from "@/components/sections/SupportedCryptoSection"
import { DiversifiedCategoriesSection } from "@/components/sections/DiversifiedCategoriesSection"
import { AlternativeAssetsSection } from "@/components/sections/AlternativeAssetsSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { FinalCtaSection } from "@/components/sections/FinalCtaSection"

export const HomePage: React.FC = () => {
  const router = useRouter()
  const onOpenAuth = (mode: "signin" | "signup") =>
    router.push(`/${mode === "signin" ? "login" : "register"}`)
  const onOpenInvestModal = (planSlug?: string, amount?: number) => {
    const params = new URLSearchParams()
    if (planSlug) params.set("plan", planSlug)
    if (amount !== undefined) params.set("amount", String(amount))
    router.push(`/investment-plans${params.toString() ? `?${params}` : ""}`)
  }
  return (
    <div className="flex flex-col">
      {/* 1. Hero with Alpha Tracker visual */}
      <Hero onOpenInvestModal={onOpenInvestModal} />

      {/* 2. Platform Metrics */}
      <MetricsSection />

      {/* 3. Video Showcase #1: Understand Digital Assets */}
      <VideoShowcaseSectionOne />

      {/* 4. About Preview Section */}
      <AboutPreview />

      {/* 5. Why High-Net-Worth Investors Choose CapitalsFargoFX */}
      <WhyUsSection />

      {/* 6. Investment Plans Preview with Horizontal Scroll */}
      <InvestmentPlansSection onOpenInvestModal={onOpenInvestModal} />

      {/* 7. Interactive Live Yield Simulator */}
      <YieldSimulator
        onOpenInvest={(planSlug, amount) => onOpenInvestModal(planSlug, amount)}
      />

      {/* 8. Video Showcase #2: Inside Digital Asset Markets (Distinct Layout) */}
      <VideoShowcaseSectionTwo />

      {/* 9. Supported Digital Assets Settlement Rails */}
      <SupportedCryptoSection />

      {/* 10. Diversified Investment Categories */}
      <DiversifiedCategoriesSection />

      {/* 11. Alternative Assets (Real Estate & AI Compute) */}
      <AlternativeAssetsSection />

      {/* 12. Investor Testimonials */}
      <TestimonialsSection />

      {/* 13. High-Impact Final CTA */}
      <FinalCtaSection onOpenAuth={onOpenAuth} />
    </div>
  )
}
