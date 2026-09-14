import React from "react"
import { AssetsPage } from "./AssetsPage"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

const page = () => {
  return (
    <div>
      <Navbar />

      <AssetsPage />
      <Footer />
    </div>
  )
}

export default page
