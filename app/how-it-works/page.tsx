import React from "react"
import { HowItWorksPage } from "./HowItWorksPage"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

const page = () => {
  return (
    <div>
      <Navbar />

      <HowItWorksPage />
      <Footer />
    </div>
  )
}

export default page
