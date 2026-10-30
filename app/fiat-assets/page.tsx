import React from "react"
import { AssetsPage } from "./AssetsPage"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import CoinPriceMarquee from "@/components/CoinPriceMarquee/CoinPriceMarquee"
import Tawk from "@/components/tawk/Tawk"

const page = () => {
  return (
    <div>
      <CoinPriceMarquee />

      <Navbar />

      <AssetsPage />
      <Footer />
              <Tawk />

    </div>
  )
}

export default page
