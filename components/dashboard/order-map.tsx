import dynamic from "next/dynamic"
import type { OrderMapInnerProps } from "./order-map-inner"

const OrderMapInner = dynamic(() => import("./order-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-2xl bg-muted/40 flex flex-col items-center justify-center gap-2">
      <div className="text-4xl animate-bounce">🗺️</div>
      <p className="text-sm text-muted-foreground font-medium">Map load ho raha hai…</p>
    </div>
  ),
})

export type { OrderMapInnerProps as OrderMapProps }

export function OrderMap(props: OrderMapInnerProps) {
  return <OrderMapInner {...props} />
}
