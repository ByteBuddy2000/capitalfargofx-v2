import React from "react"
import { AboutPage } from "./AboutPage"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

const page = () => {
  return (
    <div>
      <Navbar />

      <AboutPage />
      <Footer />
    </div>
  )
}

export default page
