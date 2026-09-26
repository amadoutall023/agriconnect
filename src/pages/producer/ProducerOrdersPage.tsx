import { ArrowRight, Check, LockKeyhole, MapPin, Package, Phone } from 'lucide-react'
import type { Order, Product, Producer, OrderStatus } from '../../types'
import { OrderStatusTimeline } from '../../components/OrderStatusTimeline'
import { formatFCFA, formatKg } from '../../lib/format'

interface ProducerOrdersPageProps {
  orders: Order[]
  products: Product[]
  producers: Producer[]
  onAdvance: (orderId: string) => void
}

function OrderSummary({ order, products }: { order: Order; products: Product[] }) {
  return <div className="space-y-2">{order.lines.map((line) => { const product = products.find((item) => item.id === line.productId); return <div key={line.productId} className="flex items-center justify-between gap-3 text-sm"><span className="truncate text-ink">{product?.name ?? 'Produit'} · {formatKg(line.quantityKg)}</span><span className="shrink-0 font-semibold tabular-nums text-muted">{formatFCFA((product?.pricePerKg ?? 0) * line.quantityKg)}</span></div> })}</div>
}

const stages: OrderStatus[] = ['Confirmée', 'En préparation', 'En livraison', 'Livrée']

export function ProducerOrdersPage({ orders, products, producers, onAdvance }: ProducerOrdersPageProps) {
  const producerOrders = orders.filter((order) => order.lines.some((line) => products.some((product) => product.id === line.productId)))
  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <div><p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Votre activité</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Commandes reçues</h1><p className="mt-1 text-sm text-muted">Préparez les récoltes et informez vos clients à chaque étape.</p></div>
      <div className="mt-6 space-y-4">{producerOrders.map((order) => {
        const current = stages.indexOf(order.status)
        const next = stages[Math.min(stages.length - 1, current + 1)]
        const producerName = producers.find((producer) => producer.id === products.find((product) => product.id === order.lines[0]?.productId)?.producerId)?.name ?? 'Producteur local'
        const phoneVisible = current > 0
        return <article key={order.id} className="rounded-2xl border border-line bg-surface p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2"><h2 className="font-extrabold">Commande {order.id}</h2><span className="rounded-full bg-blue-soft px-2.5 py-1 text-[11px] font-bold text-trust-blue">{order.status}</span></div><p className="mt-1 text-xs text-muted">Reçue le {order.createdAt} · {order.customerName}</p></div><button type="button" disabled={current >= stages.length - 1} onClick={() => onAdvance(order.id)} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-green px-3 text-xs font-extrabold text-white hover:bg-green-deep disabled:cursor-default disabled:bg-green-soft disabled:text-brand-green sm:h-9 sm:min-h-0">{current >= stages.length - 1 ? <><Check size={14}/> Livrée</> : <>Passer à « {next} » <ArrowRight size={14}/></>}</button></div>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]"><div><h3 className="mb-2 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted"><Package size={14}/> À préparer</h3><OrderSummary order={order} products={products}/></div><div><h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-muted">Suivi de la commande</h3><OrderStatusTimeline status={order.status} compact/></div></div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3 text-xs"><span className="inline-flex items-center gap-1.5 font-semibold text-muted"><MapPin size={14} className="text-brand-green"/>{order.deliveryMethod === 'Domicile' ? 'Livraison à domicile' : 'Point relais'}</span><span className="inline-flex items-center gap-1.5 font-extrabold text-ink"><Phone size={13}/>{phoneVisible ? order.customerPhone : <span className="inline-flex items-center gap-1 font-semibold text-muted"><LockKeyhole size={12}/>Coordonnées visibles après confirmation</span>}</span><span className="ml-auto font-bold tabular-nums text-ink">{formatFCFA(order.lines.reduce((sum, line) => sum + line.quantityKg * (products.find((product) => product.id === line.productId)?.pricePerKg ?? 0), 0) + order.deliveryFee)}</span><span className="sr-only">Commande gérée par {producerName}</span></div>
        </article>
      })}</div>
      {!producerOrders.length && <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface p-12 text-center text-sm text-muted">Aucune commande à afficher pour le moment.</div>}
    </main>
  )
}
