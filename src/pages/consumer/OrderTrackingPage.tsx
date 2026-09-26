import { ArrowLeft, BadgeCheck, CalendarClock, MapPin, Package, Truck } from 'lucide-react'
import type { Order } from '../../types'
import { OrderStatusTimeline } from '../../components/OrderStatusTimeline'
import { formatFCFA } from '../../lib/format'

interface OrderTrackingPageProps {
  order: Order | null
  onBack: () => void
  onShop: () => void
}

export function OrderTrackingPage({ order, onBack, onShop }: OrderTrackingPageProps) {
  if (!order) return <main className="mx-auto min-h-[65vh] max-w-4xl px-4 py-12 sm:px-6"><button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-bold text-muted"><ArrowLeft size={16} /> Retour</button><div className="mt-8 rounded-2xl border border-line bg-surface p-10 text-center"><Package size={32} className="mx-auto text-brand-green"/><h1 className="mt-3 text-2xl font-extrabold">Aucune commande à suivre</h1><button type="button" onClick={onShop} className="mt-5 rounded-xl bg-brand-green px-4 py-2.5 font-bold text-white">Découvrir les produits</button></div></main>
  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-brand-green"><ArrowLeft size={16} /> Retour</button>
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Votre récolte arrive</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Suivi de commande</h1><p className="mt-2 text-sm text-muted">Commande <span className="font-bold text-ink">{order.id}</span> · passée le {order.createdAt}</p></div><span className="inline-flex items-center gap-2 rounded-full bg-green-soft px-3 py-2 text-xs font-extrabold text-brand-green"><BadgeCheck size={16}/>{order.status}</span></div>
      <section className="mt-7 rounded-2xl border border-line bg-surface p-5 sm:p-7"><div className="mb-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-xl bg-green-soft text-brand-green"><Truck size={21}/></span><div><h2 className="font-extrabold">Progression de la livraison</h2><p className="text-xs text-muted">Mis à jour à chaque étape par votre producteur.</p></div></div><OrderStatusTimeline status={order.status} /></section>
      <div className="mt-5 grid gap-4 sm:grid-cols-2"><section className="rounded-2xl border border-line bg-surface p-5"><div className="flex items-center gap-2 text-sm font-extrabold"><MapPin size={17} className="text-trust-blue"/>Mode de livraison</div><p className="mt-3 font-bold">{order.deliveryMethod === 'Domicile' ? 'À domicile' : 'Point relais'}</p><p className="mt-1 text-xs text-muted">{order.deliveryMethod === 'Domicile' ? 'Livraison dans la zone de Dakar' : 'Point relais choisi lors du paiement'}</p></section><section className="rounded-2xl border border-line bg-surface p-5"><div className="flex items-center gap-2 text-sm font-extrabold"><CalendarClock size={17} className="text-trust-blue"/>Paiement</div><p className="mt-3 font-bold">{order.paymentMethod}</p><p className="mt-1 text-xs text-muted">Démo — transaction non effectuée</p></section></div>
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-green-soft p-5"><div><p className="font-extrabold text-green-deep">Encore envie de cuisiner local ?</p><p className="text-sm text-muted">De nouvelles récoltes vous attendent.</p></div><button type="button" onClick={onShop} className="rounded-xl bg-brand-green px-4 py-2.5 text-sm font-extrabold text-white hover:bg-green-deep">Continuer mes achats</button></div>
      <p className="mt-4 text-right text-xs text-muted">Livraison estimée : {formatFCFA(order.deliveryFee)} · Les statuts sont simulés pour la démo.</p>
    </main>
  )
}
