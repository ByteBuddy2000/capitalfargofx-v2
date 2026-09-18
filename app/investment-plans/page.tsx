// app/investment-plans/page.tsx
import React from "react"
import { InvestmentPlansPage } from "./InvestmentPlansPage"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { getInvestmentPlans } from "@/controller/investmentplans.actions"

const page = async () => {
  const plans = await getInvestmentPlans()

  return (
    <div>
      <Navbar />

      <InvestmentPlansPage plans={plans} />
      <Footer />
    </div>
  )
}

export default page
