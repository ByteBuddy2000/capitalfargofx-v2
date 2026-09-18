// app/page.tsx
import React from "react"
import { HomePage } from "./home/HomePage"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { getInvestmentPlans } from "@/controller/investmentplans.actions"

const page = async () => {
  const plans = await getInvestmentPlans()

  return (
    <div>
      <Navbar />
      <HomePage plans={plans} />
      <Footer />
    </div>
  )
}

export default page
