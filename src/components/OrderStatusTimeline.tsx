import { Check, Circle, PackageCheck, Truck } from 'lucide-react'
import type { OrderStatus } from '../types'

const steps: OrderStatus[] = ['Confirmée', 'En préparation', 'En livraison', 'Livrée']

interface OrderStatusTimelineProps {
  status: OrderStatus
  compact?: boolean
}

export function OrderStatusTimeline({ status, compact = false }: OrderStatusTimelineProps) {
  const currentIndex = steps.indexOf(status)
  return (
    <ol aria-label={`État de la commande : ${status}`} className={`grid grid-cols-4 ${compact ? 'gap-1' : 'gap-2'}`}>
      {steps.map((step, index) => {
        const complete = index < currentIndex
        const current = index === currentIndex
        return (
          <li key={step} className="relative flex flex-col items-center text-center">
            {index > 0 && <span aria-hidden="true" className={`absolute right-1/2 top-4 h-0.5 w-full ${complete || current ? 'bg-brand-green' : 'bg-line'}`} />}
            <span className={`relative z-10 grid h-8 w-8 place-items-center rounded-full ${complete || current ? 'bg-brand-green text-white' : 'border border-line bg-white text-muted'}`}>
              {complete ? <Check size={15} /> : current && index === 3 ? <PackageCheck size={15} /> : current && index === 2 ? <Truck size={15} /> : current ? <span className="h-2 w-2 rounded-full bg-white" /> : <Circle size={15} />}
            </span>
            <span className={`mt-2 text-[10px] leading-4 sm:text-xs ${complete || current ? 'font-bold text-brand-green' : 'text-muted'}`}>{step}</span>
          </li>
        )
      })}
    </ol>
  )
}
