import React from "react"
import { ContactPage } from "./ContactPage"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"
import CoinPriceMarquee from "@/components/CoinPriceMarquee/CoinPriceMarquee"

const page = () => {
  return (
    <div>
      <CoinPriceMarquee />

      <Navbar />
      <ContactPage />
      <Footer />
    </div>
  )
}

export default page
