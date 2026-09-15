// controllers/investmentplans.actions.ts
// "use server"

// import { connectToDB } from "@/lib/connectToDB"
// import { Plan } from "@/models/Plan"

// export async function getInvestmentPlans() {
//   try {
//     await connectToDB()

//     const plans = await Plan.find({
//       status: "ACTIVE",
//     })
//       .sort({
//         featured: -1,
//         minimumAmount: 1,
//       })
//       .lean()

//     return JSON.parse(JSON.stringify(plans))
//   } catch (error) {
//     console.error("Failed to fetch investment plans:", error)
//     return []
//   }
// }

"use server"

import { connectToDB } from "@/lib/connectToDB"
import { Plan } from "@/models/Plan"

export async function getInvestmentPlans() {
  try {
    await connectToDB()

    const plans = await Plan.find({
      status: "ACTIVE",
    }).lean()

    const sortedPlans = plans.sort((a, b) => {
      const levelA = Number(a.name.match(/\d+/)?.[0] ?? 999)
      const levelB = Number(b.name.match(/\d+/)?.[0] ?? 999)

      return levelA - levelB
    })

    return JSON.parse(JSON.stringify(sortedPlans))
  } catch (error) {
    console.error("Failed to fetch investment plans:", error)
    return []
  }
}