import React from "react"
import { HowItWorksPage } from "./HowItWorksPage"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import CoinPriceMarquee from "@/components/CoinPriceMarquee/CoinPriceMarquee"

const page = () => {
  return (
    <div>
      <CoinPriceMarquee />

      <Navbar />

      <HowItWorksPage />
      <Footer />
    </div>
  )
}

export default page
