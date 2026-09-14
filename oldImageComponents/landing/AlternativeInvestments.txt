import React from "react"
import { motion } from "motion/react"
import { Building2, Sparkles, Database, ArrowRight, Shield } from "lucide-react"
import { Button } from "../ui/Button"

interface AlternativeInvestmentsProps {
  onOpenRegister?: () => void
}

export const AlternativeInvestments: React.FC<AlternativeInvestmentsProps> = ({
  onOpenRegister,
}) => {
  const alternatives = [
    {
      title: "Institutional Real Estate Portfolios",
      category: "Asset-Backed Yield",
      description:
        "Access fractional exposure into prime multi-family developments and Class-A logistics hubs yielding predictable distributions.",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
      tag: "Collateralized",
      icon: <Building2 className="h-5 w-5 text-teal-600" />,
    },
    {
      title: "Decentralized Compute & AI Infrastructure",
      category: "Strategic Tech",
      description:
        "Capital deployment into revenue-generating decentralized GPU clusters and enterprise zero-knowledge verification nodes.",
      image:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
      tag: "High Velocity",
      icon: <Database className="h-5 w-5 text-blue-600" />,
    },
  ]

  return (
    <section className="border-b border-slate-200/80 bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col justify-between md:flex-row md:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold tracking-wider text-emerald-700 uppercase">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Alternative Assets
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Explore More Investment Opportunities
            </h2>
            <p className="mt-2 max-w-xl text-base text-slate-600">
              Diversify beyond liquid markets into tangible real-world assets
              and computational technology infrastructure.
            </p>
          </div>
          <Button
            variant="outline"
            rightIcon={<ArrowRight className="h-4 w-4" />}
            onClick={onOpenRegister}
            className="mt-4 md:mt-0"
          >
            Access Private Placements
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {alternatives.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-md transition-all hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
                    {item.category}
                  </span>
                </div>
                <div className="absolute right-4 bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold tracking-tight text-white">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="p-7">
                <p className="mb-6 text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span>{item.tag}</span>
                  </div>
                  <button
                    onClick={onOpenRegister}
                    className="inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>View Offering</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
