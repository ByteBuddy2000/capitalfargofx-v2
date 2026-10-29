import type { DetailedHTMLProps, HTMLAttributes } from "react"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "gecko-coin-price-marquee-widget": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        locale?: string
        "coin-ids"?: string
        "initial-currency"?: string
        "dark-mode"?: string
        "transparent-background"?: string
        outlined?: string
      }
      "gecko-coin-price-static-headline-widget": DetailedHTMLProps<
        HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        locale?: string
        outlined?: string
        "coin-ids"?: string
        "initial-currency"?: string
      }
    }
  }
}
