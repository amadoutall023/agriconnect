import { MapPin, Package, Phone, Smartphone, ShieldCheck, Lock } from 'lucide-react'
import type { Order, Product, Producer } from '../../types'
import { OrderStatusTimeline } from '../../components/OrderStatusTimeline'
import { formatFCFA, formatKg } from '../../lib/format'

interface ProducerOrdersPageProps {
  orders: Order[]
  products: Product[]
  producers: Producer[]
}

function OrderSummary({ order, products }: { order: Order; products: Product[] }) {
  return (
    <div className="space-y-2">
      {order.lines.map((line) => {
        const product = products.find((item) => item.id === line.productId)
        return (
          <div key={line.productId} className="flex items-center justify-between gap-3 text-sm">
            <span className="truncate text-ink font-medium">
              {product?.name ?? 'Produit'} · {formatKg(line.quantityKg)}
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-muted">
              {formatFCFA((product?.pricePerKg ?? 0) * line.quantityKg)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function ProducerOrdersPage({ orders, products, producers }: ProducerOrdersPageProps) {
  const producerOrders = orders.filter((order) =>
    order.lines.some((line) => products.some((product) => product.id === line.productId))
  )

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Espace Producteur (Lecture seul)</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Commandes reçues</h1>
        <p className="mt-1 text-sm text-muted">Consultez les récoltes réservées. Le statut de livraison est géré par la logistique SuperAdmin.</p>
      </div>

      <div className="mt-6 space-y-4">
        {producerOrders.map((order) => {
          const producerName =
            producers.find((producer) =>
              producer.id === products.find((product) => product.id === order.lines[0]?.productId)?.producerId
            )?.name ?? 'Producteur local'

          const totalAmount =
            order.lines.reduce(
              (sum, line) => sum + line.quantityKg * (products.find((product) => product.id === line.productId)?.pricePerKg ?? 0),
              0
            ) + order.deliveryFee

          return (
            <article key={order.id} className="rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-extrabold text-slate-900">Commande {order.id}</h2>
                    <span className="rounded-full bg-blue-soft px-2.5 py-1 text-[11px] font-bold text-trust-blue">
                      {order.status}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      Payé via {order.paymentMethod}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Reçue le {order.createdAt} · Client: <strong className="text-ink">{order.customerName}</strong>
                    {order.paymentTransactionId && (
                      <span className="ml-2 text-slate-500 font-mono">
                        (Réf: {order.paymentTransactionId})
                      </span>
                    )}
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 border border-slate-200">
                  <Lock size={13} className="text-slate-500" />
                  <span>Statut piloté par SuperAdmin</span>
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-muted">
                    <Package size={14} /> Produits à préparer pour la collecte
                  </h3>
                  <OrderSummary order={order} products={products} />
                </div>
                <div>
                  <h3 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-muted">
                    Suivi de l'expédition
                  </h3>
                  <OrderStatusTimeline status={order.status} compact />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-3 text-xs">
                <span className="inline-flex items-center gap-1.5 font-semibold text-muted">
                  <MapPin size={14} className="text-brand-green" />
                  {order.deliveryMethod === 'Domicile' ? 'Livraison à domicile' : 'Point relais'}
                </span>
                <span className="inline-flex items-center gap-1.5 font-extrabold text-ink">
                  <Smartphone size={14} className="text-orange-600" />
                  {order.paymentPhone || order.customerPhone}
                </span>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="inline-flex items-center gap-1.5 font-extrabold text-sky-700 hover:underline"
                >
                  <Phone size={13} />
                  <span>{order.customerPhone}</span>
                </a>
                <span className="ml-auto font-bold tabular-nums text-slate-900 text-sm">
                  Total : {formatFCFA(totalAmount)}
                </span>
                <span className="sr-only">Commande gérée par {producerName}</span>
              </div>
            </article>
          )
        })}
      </div>

      {!producerOrders.length && (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-surface p-12 text-center text-sm text-muted">
          Aucune commande à afficher pour le moment.
        </div>
      )}
    </main>
  )
}
