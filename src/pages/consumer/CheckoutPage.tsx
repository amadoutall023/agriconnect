import { useState } from 'react'
import { ArrowLeft, Check, CreditCard, Home, MapPin, Smartphone, ShieldCheck, Lock } from 'lucide-react'
import type { CartLine, DeliveryMethod, PaymentMethod, Product } from '../../types'
import { formatFCFA } from '../../lib/format'
import { MobileMoneyModal } from '../../components/MobileMoneyModal'

interface CheckoutPageProps {
  products: Product[]
  lines: CartLine[]
  payment: PaymentMethod
  delivery: DeliveryMethod
  deliveryFee: number
  onPaymentChange: (value: PaymentMethod) => void
  onDeliveryChange: (value: DeliveryMethod) => void
  onBack: () => void
  onConfirm: (paymentData?: { phone: string; transactionId: string }) => void
}

const payments: { name: PaymentMethod; description: string; icon: typeof CreditCard; color: string }[] = [
  { name: 'Orange Money', description: 'Code #144# · Rapide & sécurisé', icon: Smartphone, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { name: 'Wave', description: 'Paiement sans frais par QR/Push', icon: Smartphone, color: 'text-[#0f75bd] bg-sky-50 border-sky-200' },
  { name: 'Free Money', description: 'Paiement via USSD #150#', icon: Smartphone, color: 'text-[#e2001a] bg-red-50 border-red-200' },
  { name: 'Carte bancaire', description: 'Visa, Mastercard', icon: CreditCard, color: 'text-trust-blue bg-blue-soft border-blue-200' },
]

export function CheckoutPage({
  products,
  lines,
  payment,
  delivery,
  deliveryFee,
  onPaymentChange,
  onDeliveryChange,
  onBack,
  onConfirm,
}: CheckoutPageProps) {
  const [phoneInput, setPhoneInput] = useState('+221 77 000 00 00')
  const [customerName, setCustomerName] = useState('Votre nom')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const rows = lines
    .map((line) => ({ line, product: products.find((product) => product.id === line.productId) }))
    .filter((row): row is { line: CartLine; product: Product } => Boolean(row.product))

  const subtotal = rows.reduce((total, { line, product }) => total + line.quantityKg * product.pricePerKg, 0)
  const totalAmount = subtotal + deliveryFee

  const deliveryOptions = [
    { name: 'Domicile' as const, description: 'Livrée à votre adresse à Dakar', icon: Home, fee: 1200 },
    { name: 'Point relais' as const, description: 'À récupérer près de chez vous', icon: MapPin, fee: 700 },
  ]

  const handleOpenPaymentModal = () => {
    setIsModalOpen(true)
  }

  const handlePaymentSuccess = (paymentData: { phone: string; transactionId: string }) => {
    onConfirm(paymentData)
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 lg:pb-12">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted hover:text-brand-green transition"
      >
        <ArrowLeft size={16} /> Retour au panier
      </button>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Dernière étape</p>
          <h1 className="mt-1 text-2xl sm:text-4xl font-extrabold tracking-tight text-ink">Finaliser ma commande</h1>

          {/* Contact Details */}
          <fieldset className="mt-5 sm:mt-6 rounded-2xl border border-line bg-surface p-3.5 sm:p-5 shadow-sm">
            <legend className="px-1 text-sm sm:text-base font-extrabold">Coordonnées de livraison</legend>
            <div className="mt-3 grid gap-3 grid-cols-1 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-extrabold text-muted uppercase tracking-wider mb-1">Nom complet</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white py-2.5 px-3.5 text-base sm:text-sm font-bold text-ink focus:border-brand-green focus:outline-none"
                  placeholder="Ex: Aminata Ndiaye"
                />
              </div>
              <div>
                <label className="block text-xs font-extrabold text-muted uppercase tracking-wider mb-1">Téléphone de contact</label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full rounded-xl border border-line bg-white py-2.5 px-3.5 text-base sm:text-sm font-bold text-ink focus:border-brand-green focus:outline-none"
                  placeholder="+221 77 000 00 00"
                />
              </div>
            </div>
          </fieldset>

          {/* Delivery Method Selection */}
          <fieldset className="mt-5 rounded-2xl border border-line bg-surface p-3.5 sm:p-5 shadow-sm">
            <legend className="max-w-full px-1 text-sm sm:text-base font-extrabold">
              Comment souhaitez-vous recevoir votre commande ?
            </legend>
            <div className="mt-3 grid gap-2.5 grid-cols-1 min-[420px]:grid-cols-2 sm:gap-3">
              {deliveryOptions.map((option) => {
                const selected = delivery === option.name
                const Icon = option.icon
                return (
                  <button
                    type="button"
                    key={option.name}
                    aria-pressed={selected}
                    onClick={() => onDeliveryChange(option.name)}
                    className={`grid min-h-20 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border p-3 text-left transition ${
                      selected ? 'border-brand-green bg-green-soft/60' : 'border-line bg-white hover:border-brand-green/50'
                    }`}
                  >
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl shrink-0 ${
                        selected ? 'bg-brand-green text-white' : 'bg-page text-muted'
                      }`}
                    >
                      <Icon size={19} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold leading-5">
                        {option.name === 'Domicile' ? 'À domicile' : 'Point relais'}
                      </span>
                      <span className="mt-0.5 block text-xs leading-4 text-muted">{option.description}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-bold tabular-nums">
                      {formatFCFA(option.fee)}
                      {selected && <Check size={15} className="shrink-0 text-brand-green" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Payment Method Selection */}
          <fieldset className="mt-5 rounded-2xl border border-line bg-surface p-3.5 sm:p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <legend className="px-1 text-sm sm:text-base font-extrabold">Mode de paiement Mobile Money</legend>
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <ShieldCheck size={14} /> Instantané & Sécurisé
              </span>
            </div>
            <div className="mt-3 grid gap-2.5 grid-cols-1 min-[420px]:grid-cols-2">
              {payments.map((option) => {
                const Icon = option.icon
                const selected = payment === option.name
                return (
                  <button
                    key={option.name}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onPaymentChange(option.name)}
                    className={`flex min-h-20 items-center gap-3 rounded-2xl border p-3.5 text-left transition relative overflow-hidden active:scale-[0.99] ${
                      selected
                        ? 'border-brand-green bg-emerald-50/40 shadow-sm ring-2 ring-brand-green/20'
                        : 'border-line bg-white hover:border-brand-green/40'
                    }`}
                  >
                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${option.color}`}>
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold text-ink">{option.name}</span>
                      <span className="text-[11px] text-muted leading-tight block mt-0.5">{option.description}</span>
                    </span>
                    {selected && <Check size={18} className="shrink-0 text-brand-green" />}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 flex items-center gap-2">
              <Lock size={16} className="text-slate-500 shrink-0" />
              <span>
                Le paiement sera validé via la passerelle <strong>{payment}</strong> après votre confirmation.
              </span>
            </div>
          </fieldset>
        </div>

        {/* Summary Side Card */}
        <aside className="rounded-2xl border border-line bg-surface p-4 sm:p-6 lg:sticky lg:top-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-ink">Votre commande</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {rows.map(({ line, product }) => (
              <div className="flex items-center gap-3 py-3" key={line.productId}>
                <img
                  src={product.imageUrl}
                  alt={product.imageAlt}
                  width={52}
                  height={52}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{product.name}</p>
                  <p className="text-xs text-muted">{line.quantityKg} kg</p>
                </div>
                <span className="whitespace-nowrap text-xs font-extrabold tabular-nums">
                  {formatFCFA(line.quantityKg * product.pricePerKg)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-3 text-muted">
              <span>Sous-total</span>
              <span className="whitespace-nowrap font-bold text-ink">{formatFCFA(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-3 text-muted">
              <span>Livraison · {delivery === 'Domicile' ? 'Domicile' : 'Point relais'}</span>
              <span className="whitespace-nowrap font-bold text-ink">{formatFCFA(deliveryFee)}</span>
            </div>
            <div className="flex justify-between gap-3 border-t border-line pt-3 font-extrabold">
              <span>Total à payer</span>
              <span className="whitespace-nowrap text-lg text-brand-green tabular-nums">
                {formatFCFA(totalAmount)}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={!rows.length}
            onClick={handleOpenPaymentModal}
            className="mt-5 hidden sm:flex min-h-12 w-full rounded-xl bg-accent-orange px-4 text-sm font-extrabold text-ink hover:brightness-95 disabled:cursor-not-allowed disabled:bg-line transition shadow-md items-center justify-center gap-2"
          >
            <span>Payer avec {payment}</span>
          </button>
          <p className="mt-2 hidden sm:block text-center text-[11px] text-muted">Simulation interactive Mobile Money Sénégal</p>
        </aside>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 p-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-muted block">Total ({payment})</span>
          <span className="text-base font-extrabold text-brand-green tabular-nums">{formatFCFA(totalAmount)}</span>
        </div>
        <button
          type="button"
          disabled={!rows.length}
          onClick={handleOpenPaymentModal}
          className="flex-1 min-h-11 rounded-xl bg-accent-orange px-3 text-xs font-extrabold text-ink hover:brightness-95 disabled:bg-line transition shadow flex items-center justify-center gap-1.5"
        >
          <span>Payer avec {payment}</span>
        </button>
      </div>

      {/* Mobile Money Payment Modal */}
      <MobileMoneyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handlePaymentSuccess}
        amountFCFA={totalAmount}
        paymentMethod={payment}
        initialPhone={phoneInput}
      />
    </main>
  )
}
