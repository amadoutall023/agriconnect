import { ArrowRight, ArrowUpRight, Boxes, CalendarDays, CircleAlert, ShoppingBag, Wallet } from 'lucide-react'
import type { Product, SalesPoint } from '../../types'
import { formatFCFA } from '../../lib/format'
import { StatCard } from '../../components/StatCard'
import { SalesChart } from '../../components/SalesChart'

interface ProducerDashboardProps {
  products: Product[]
  sales: SalesPoint[]
  orderCount: number
  producerName: string
  onProducts: () => void
  onOrders: () => void
  onNewProduct: () => void
}

export function ProducerDashboard({ products, sales, orderCount, producerName, onProducts, onOrders, onNewProduct }: ProducerDashboardProps) {
  const unavailable = products.filter((product) => product.stockKg <= 0).length
  const monthlyRevenue = 428500
  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Votre activité</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Tableau de bord</h1><p className="mt-1 text-sm text-muted">Bonjour, {producerName.split(' ')[0]}. Voici le point sur votre exploitation.</p></div><span className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-xs font-semibold text-muted"><CalendarDays size={15} /> Septembre 2026</span></div>
      <section aria-label="Statistiques du mois" className="mt-6 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Ventes du mois" value={formatFCFA(monthlyRevenue)} note="Chiffre d’affaires estimé · septembre" icon={Wallet} tone="green" />
        <StatCard label="Commandes reçues" value={String(orderCount)} note="Commandes à préparer ou en route" icon={ShoppingBag} tone="blue" />
        <StatCard label="Produits en rupture" value={String(unavailable)} note={unavailable > 0 ? 'Pensez à mettre votre stock à jour' : 'Votre catalogue est disponible'} icon={CircleAlert} tone={unavailable > 0 ? 'orange' : 'green'} />
      </section>
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-extrabold">Évolution des ventes</h2><p className="mt-1 text-xs text-muted">Chiffre d’affaires estimé sur les 7 derniers jours</p></div><span className="inline-flex items-center gap-1 rounded-full bg-green-soft px-2.5 py-1 text-xs font-bold text-brand-green"><ArrowUpRight size={14} /> Cette semaine</span></div><div className="mt-5"><SalesChart data={sales} /></div><p className="mt-1 text-center text-[11px] text-muted">Ventes estimées en FCFA · données de démonstration</p></section>
        <section className="rounded-2xl border border-line bg-surface p-4 sm:p-5"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-extrabold">Mon activité</h2><p className="mt-1 text-xs text-muted">Stock et commandes à jour.</p></div><Boxes className="text-brand-green" size={20}/></div><div className="mt-4 space-y-2.5"><button type="button" onClick={onProducts} className="flex w-full items-center gap-3 rounded-xl bg-page p-3 text-left hover:bg-green-soft"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-brand-green"><Boxes size={17}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold">Mes produits</span><span className="text-xs text-muted">{products.length} références au catalogue</span></span><ArrowRight size={15} className="text-muted"/></button><button type="button" onClick={onOrders} className="flex w-full items-center gap-3 rounded-xl bg-page p-3 text-left hover:bg-green-soft"><span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-trust-blue"><ShoppingBag size={17}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold">Mes commandes</span><span className="text-xs text-muted">Consultez les demandes récentes</span></span><ArrowRight size={15} className="text-muted"/></button></div><button type="button" onClick={onNewProduct} className="mt-4 h-11 w-full rounded-xl bg-brand-green px-4 text-sm font-extrabold text-white hover:bg-green-deep">+ Ajouter un produit</button></section>
      </div>
    </main>
  )
}
