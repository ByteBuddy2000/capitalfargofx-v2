import React from "react"
import { FaqPage } from "./FaqPage"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

const page = () => {
  return (
    <div>
      <Navbar />

      <FaqPage />
      <Footer />
    </div>
  )
}

export default page
