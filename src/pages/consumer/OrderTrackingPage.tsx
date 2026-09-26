import { ArrowLeft, BadgeCheck, CheckCircle2, MapPin, Package, Smartphone, ShieldCheck, Truck, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import type { Order } from '../../types'
import { OrderStatusTimeline } from '../../components/OrderStatusTimeline'
import { formatFCFA } from '../../lib/format'

interface OrderTrackingPageProps {
  order: Order | null
  onBack: () => void
  onShop: () => void
}

export function OrderTrackingPage({ order, onBack, onShop }: OrderTrackingPageProps) {
  const [copied, setCopied] = useState(false)

  if (!order) {
    return (
      <main className="mx-auto min-h-[65vh] max-w-4xl px-4 py-12 sm:px-6">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-muted">
          <ArrowLeft size={16} /> Retour
        </button>
        <div className="mt-8 rounded-2xl border border-line bg-surface p-10 text-center">
          <Package size={32} className="mx-auto text-brand-green" />
          <h1 className="mt-3 text-2xl font-extrabold">Aucune commande à suivre</h1>
          <button type="button" onClick={onShop} className="mt-5 rounded-xl bg-brand-green px-4 py-2.5 font-bold text-white">
            Découvrir les produits
          </button>
        </div>
      </main>
    )
  }

  const copyTxId = () => {
    if (order.paymentTransactionId) {
      navigator.clipboard.writeText(order.paymentTransactionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <button
        type="button"
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-brand-green"
      >
        <ArrowLeft size={16} /> Retour
      </button>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Votre récolte arrive</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Suivi de commande</h1>
          <p className="mt-2 text-sm text-muted">
            Commande <span className="font-bold text-ink">{order.id}</span> · passée le {order.createdAt}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-green-soft px-3.5 py-2 text-xs font-extrabold text-brand-green border border-emerald-200">
          <BadgeCheck size={17} /> {order.status}
        </span>
      </div>

      {/* Progress timeline */}
      <section className="mt-7 rounded-2xl border border-line bg-surface p-5 sm:p-7 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-green-soft text-brand-green">
            <Truck size={21} />
          </span>
          <div>
            <h2 className="font-extrabold">Progression de la livraison</h2>
            <p className="text-xs text-muted">Mis à jour à chaque étape par votre producteur local.</p>
          </div>
        </div>
        <OrderStatusTimeline status={order.status} />
      </section>

      {/* Delivery & Payment details grid */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {/* Delivery card */}
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-extrabold text-ink">
            <MapPin size={18} className="text-trust-blue" /> Mode de livraison
          </div>
          <p className="mt-3 text-base font-extrabold text-slate-900">
            {order.deliveryMethod === 'Domicile' ? 'À domicile (Dakar)' : 'Point relais de quartier'}
          </p>
          <p className="mt-1 text-xs text-muted">
            Frais de livraison : <span className="font-bold text-ink">{formatFCFA(order.deliveryFee)}</span>
          </p>
        </section>

        {/* Mobile Money Payment card */}
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-extrabold text-ink">
              <Smartphone size={18} className="text-orange-600" /> Reçu de paiement
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
              <CheckCircle2 size={13} /> {order.paymentStatus || 'Payé'}
            </span>
          </div>

          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted">Moyen de paiement:</span>
              <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                {order.paymentMethod}
              </span>
            </div>

            {order.paymentPhone && (
              <div className="flex justify-between items-center">
                <span className="text-muted">Compte / Numéro:</span>
                <span className="font-bold text-slate-800 font-mono">{order.paymentPhone}</span>
              </div>
            )}

            {order.paymentTransactionId && (
              <div className="flex justify-between items-center pt-1 border-t border-line">
                <span className="text-muted">Réf. Transaction:</span>
                <button
                  type="button"
                  onClick={copyTxId}
                  className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 hover:bg-emerald-100 transition"
                  title="Cliquer pour copier la référence"
                >
                  <span>{order.paymentTransactionId}</span>
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>
              </div>
            )}

            {order.paymentTimestamp && (
              <div className="flex justify-between items-center text-[11px] text-muted pt-1">
                <span>Date de validation:</span>
                <span>{order.paymentTimestamp}</span>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
            <span>Paiement certifié via la passerelle Mobile Money.</span>
          </div>
        </section>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-green-soft p-5">
        <div>
          <p className="font-extrabold text-green-deep">Encore envie de cuisiner local ?</p>
          <p className="text-sm text-muted">De nouvelles récoltes des producteurs locaux vous attendent.</p>
        </div>
        <button
          type="button"
          onClick={onShop}
          className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-extrabold text-white hover:bg-green-deep shadow"
        >
          Continuer mes achats
        </button>
      </div>
      <p className="mt-4 text-right text-xs text-muted">Livraison estimée : sous 24h à 48h selon la zone.</p>
    </main>
  )
}
