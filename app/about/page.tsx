import React from "react"
import { AboutPage } from "./AboutPage"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import CoinPriceMarquee from "@/components/CoinPriceMarquee/CoinPriceMarquee"

const page = () => {
  return (
    <div>
            <CoinPriceMarquee />
      
      <Navbar />
      <AboutPage />
      <Footer />
    </div>
  )
}

export default page
