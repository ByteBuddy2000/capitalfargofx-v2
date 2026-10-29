import React from "react"
import { FaqPage } from "./FaqPage"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import CoinPriceMarquee from "@/components/CoinPriceMarquee/CoinPriceMarquee"

const page = () => {
  return (
    <div>
            <CoinPriceMarquee />
      
      <Navbar />

      <FaqPage />
      <Footer />
    </div>
  )
}

export default page
