import React from "react"
import { InvestmentPlansPage } from "./InvestmentPlansPage"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

const page = () => {
  return (
    <div>
      <Navbar />

      <InvestmentPlansPage />
      <Footer />
    </div>
  )
}

export default page
