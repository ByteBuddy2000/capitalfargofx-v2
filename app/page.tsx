import React from "react"
import { HomePage } from "./home/HomePage"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

const page = () => {
  return (
    <div>
      <Navbar />
      <HomePage />
      <Footer />
    </div>
  )
}

export default page
