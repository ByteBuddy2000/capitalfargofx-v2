// app/investment-plans/page.tsx

import React from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { InvestmentPlansPage } from "./InvestmentPlansPage"
import { getInvestmentPlans } from "@/controller/investmentplans.actions"

const Page = async () => {
  const plans = await getInvestmentPlans()

  return (
    <>
      <Navbar />

      <InvestmentPlansPage plans={plans} />

      <Footer />
    </>
  )
}

export default Page