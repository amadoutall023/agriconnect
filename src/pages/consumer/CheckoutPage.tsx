import { ArrowLeft, Check, CreditCard, Home, MapPin, Smartphone } from 'lucide-react'
import type { CartLine, DeliveryMethod, PaymentMethod, Product } from '../../types'
import { formatFCFA } from '../../lib/format'

interface CheckoutPageProps {
  products: Product[]
  lines: CartLine[]
  payment: PaymentMethod
  delivery: DeliveryMethod
  deliveryFee: number
  onPaymentChange: (value: PaymentMethod) => void
  onDeliveryChange: (value: DeliveryMethod) => void
  onBack: () => void
  onConfirm: () => void
}

const payments: { name: PaymentMethod; description: string; icon: typeof CreditCard; color: string }[] = [
  { name: 'Orange Money', description: 'Paiement mobile', icon: Smartphone, color: 'text-orange-600 bg-orange-50' },
  { name: 'Wave', description: 'Paiement mobile', icon: Smartphone, color: 'text-sky-700 bg-sky-50' },
  { name: 'Free Money', description: 'Paiement mobile', icon: Smartphone, color: 'text-red-700 bg-red-50' },
  { name: 'Carte bancaire', description: 'Visa, Mastercard', icon: CreditCard, color: 'text-trust-blue bg-blue-soft' },
]

export function CheckoutPage({ products, lines, payment, delivery, deliveryFee, onPaymentChange, onDeliveryChange, onBack, onConfirm }: CheckoutPageProps) {
  const rows = lines.map((line) => ({ line, product: products.find((product) => product.id === line.productId) })).filter((row): row is { line: CartLine; product: Product } => Boolean(row.product))
  const subtotal = rows.reduce((total, { line, product }) => total + line.quantityKg * product.pricePerKg, 0)
  const deliveryOptions = [
    { name: 'Domicile' as const, description: 'Livrée à votre adresse à Dakar', icon: Home, fee: 1200 },
    { name: 'Point relais' as const, description: 'À récupérer près de chez vous', icon: MapPin, fee: 700 },
  ]

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <button type="button" onClick={onBack} className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted hover:text-brand-green"><ArrowLeft size={16} /> Retour au panier</button>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_370px]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Dernière étape</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Finaliser ma commande</h1>
          <fieldset className="mt-6 rounded-2xl border border-line bg-surface p-3.5 min-[400px]:p-4 sm:p-5">
            <legend className="max-w-full px-1 text-sm font-extrabold min-[400px]:text-base">Comment souhaitez-vous recevoir votre commande ?</legend>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
              {deliveryOptions.map((option) => {
                const selected = delivery === option.name
                const Icon = option.icon
                return <button type="button" key={option.name} aria-pressed={selected} onClick={() => onDeliveryChange(option.name)} className={`grid min-h-20 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border p-2.5 text-left transition min-[400px]:gap-3 min-[400px]:p-3 sm:p-4 ${selected ? 'border-brand-green bg-green-soft/60' : 'border-line bg-white hover:border-brand-green/50'}`}>
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${selected ? 'bg-brand-green text-white' : 'bg-page text-muted'}`}><Icon size={19} /></span>
                  <span className="min-w-0"><span className="block text-sm font-extrabold leading-5">{option.name === 'Domicile' ? 'À domicile' : 'Point relais'}</span><span className="mt-0.5 block text-xs leading-4 text-muted">{option.description}</span></span>
                  <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[10px] font-bold tabular-nums min-[400px]:gap-1.5 min-[400px]:text-xs">{formatFCFA(option.fee)}{selected && <Check size={15} className="shrink-0 text-brand-green" />}</span>
                </button>
              })}
            </div>
          </fieldset>
          <fieldset className="mt-5 rounded-2xl border border-line bg-surface p-3.5 min-[400px]:p-4 sm:p-5">
            <legend className="px-1 text-base font-extrabold">Mode de paiement</legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {payments.map((option) => {
                const Icon = option.icon
                const selected = payment === option.name
                return <button key={option.name} type="button" aria-pressed={selected} onClick={() => onPaymentChange(option.name)} className={`flex min-h-16 items-center gap-3 rounded-xl border p-3 text-left transition ${selected ? 'border-brand-green bg-green-soft/60' : 'border-line bg-white hover:border-brand-green/50'}`}>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${option.color}`}><Icon size={19} /></span>
                  <span className="min-w-0 flex-1"><span className="block text-sm font-extrabold">{option.name}</span><span className="text-xs text-muted">{option.description}</span></span>
                  {selected && <Check size={17} className="shrink-0 text-brand-green" />}
                </button>
              })}
            </div>
            <p className="mt-3 rounded-xl bg-blue-soft px-3 py-2 text-xs font-semibold text-trust-blue">Démo : aucun paiement réel n’est traité. Vos coordonnées bancaires ne sont pas demandées.</p>
          </fieldset>
        </div>
        <aside className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
          <h2 className="text-lg font-extrabold">Votre commande</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {rows.map(({ line, product }) => <div className="flex items-center gap-3 py-3" key={line.productId}><img src={product.imageUrl} alt={product.imageAlt} width={52} height={52} className="h-12 w-12 shrink-0 rounded-lg object-cover"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{product.name}</p><p className="text-xs text-muted">{line.quantityKg} kg</p></div><span className="whitespace-nowrap text-xs font-extrabold tabular-nums">{formatFCFA(line.quantityKg * product.pricePerKg)}</span></div>)}
          </div>
          <div className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-3 text-muted"><span>Sous-total</span><span className="whitespace-nowrap font-bold text-ink">{formatFCFA(subtotal)}</span></div><div className="flex justify-between gap-3 text-muted"><span>Livraison · {delivery === 'Domicile' ? 'Domicile' : 'Point relais'}</span><span className="whitespace-nowrap font-bold text-ink">{formatFCFA(deliveryFee)}</span></div><div className="flex justify-between gap-3 border-t border-line pt-3 font-extrabold"><span>Total à payer</span><span className="whitespace-nowrap tabular-nums">{formatFCFA(subtotal + deliveryFee)}</span></div></div>
          <button type="button" disabled={!rows.length} onClick={onConfirm} className="mt-5 min-h-12 w-full rounded-xl bg-accent-orange px-3 text-sm font-extrabold text-ink hover:brightness-95 disabled:cursor-not-allowed disabled:bg-line min-[400px]:px-4 min-[400px]:text-base">Confirmer la commande</button>
          <p className="mt-2 text-center text-[11px] text-muted">Paiement simulé pour cette démo</p>
        </aside>
      </div>
    </main>
  )
}
