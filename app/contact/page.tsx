import React from "react"
import { ContactPage } from "./ContactPage"
import { Footer } from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

const page = () => {
  return (
    <div>
      <Navbar />
      <ContactPage />
      <Footer />
    </div>
  )
}

export default page
