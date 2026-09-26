import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Clock3, MapPin, Minus, Plus, QrCode, ShieldCheck, ShoppingBasket } from 'lucide-react'
import type { Product, Producer } from '../../types'
import { formatFCFA, formatKg } from '../../lib/format'

interface ProductDetailPageProps {
  product: Product
  producer: Producer
  onBack: () => void
  onAdd: (product: Product, quantity: number) => void
}

export function ProductDetailPage({ product, producer, onBack, onAdd }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
      <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-brand-green"><ArrowLeft size={17} /> Retour au catalogue</button>
      <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
        <div className="overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="relative">
            <img src={product.imageUrl} alt={product.imageAlt} width={1100} height={820} className="h-[290px] w-full object-cover sm:h-[430px]" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-2 text-xs font-extrabold text-trust-blue shadow-sm"><QrCode size={15} /> Traçabilité disponible</span>
          </div>
          <div className="space-y-4 p-5 sm:p-6">
            <div><p className="text-xs font-extrabold uppercase tracking-wide text-brand-green">Historique de traçabilité</p><h2 className="mt-1 text-xl font-extrabold">Du champ à votre panier</h2><p className="mt-1 text-xs text-muted">Informations de provenance fournies pour cette démo — sans certification tierce.</p></div>
            <ol className="space-y-0">
              {product.traceability.map((event, index) => <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                {index < product.traceability.length - 1 && <span className="absolute left-[13px] top-7 h-full w-px bg-line" />}
                <span className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-green-soft text-brand-green"><CheckCircle2 size={16} /></span>
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-x-2"><p className="text-sm font-extrabold">{event.label}</p><span className="text-xs text-muted">{event.date}</span></div><p className="mt-0.5 text-xs font-semibold text-trust-blue">{event.location}</p><p className="mt-1 text-xs leading-5 text-muted">{event.description}</p></div>
              </li>)}
            </ol>
          </div>
        </div>
        <div className="lg:pt-2">
          <span className="inline-flex rounded-full bg-green-soft px-3 py-1 text-xs font-extrabold text-brand-green">{product.category}</span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-3xl font-extrabold tabular-nums text-orange-ink">{formatFCFA(product.pricePerKg)} <span className="text-base font-semibold text-muted">/ kg</span></p>
          <p className="mt-3 text-sm leading-6 text-muted">{product.description}</p>
          <div className="mt-5 rounded-2xl border border-line bg-surface p-4">
            <p className="text-xs font-extrabold uppercase tracking-wide text-muted">Votre producteur</p>
            <div className="mt-3 flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-soft text-lg font-extrabold text-brand-green">{producer.name.split(' ').map((name) => name[0]).slice(0, 2).join('')}</span>
              <div className="min-w-0 flex-1"><p className="font-extrabold">{producer.name}</p><p className="text-sm text-muted">{producer.cooperative}</p></div>
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-soft text-trust-blue"><ShieldCheck size={18} /></span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 border-t border-line pt-3 text-sm text-muted"><MapPin size={15} className="shrink-0 text-brand-green" /> <span>Récolté à {producer.location}</span><span className="inline-flex items-center gap-1 text-xs sm:ml-auto"><Clock3 size={13} /> Mis à jour aujourd’hui</span></div>
          </div>
          <div className="mt-5 flex items-center justify-between rounded-xl bg-page px-4 py-3">
            <span className="text-sm font-semibold text-muted">Disponibilité</span><span className={`text-sm font-extrabold ${product.stockKg > 0 ? 'text-brand-green' : 'text-orange-ink'}`}>{product.stockKg > 0 ? `${formatKg(product.stockKg)} disponibles` : 'Épuisé pour le moment'}</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex h-14 items-center gap-1 rounded-xl border border-line bg-surface p-1">
              <button type="button" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Diminuer la quantité" className="grid h-11 w-11 place-items-center rounded-lg text-muted hover:bg-page disabled:opacity-40"><Minus size={16} /></button>
              <span className="min-w-14 text-center text-sm font-extrabold tabular-nums">{quantity} kg</span>
              <button type="button" disabled={quantity >= product.stockKg} onClick={() => setQuantity((value) => Math.min(product.stockKg, value + 1))} aria-label="Augmenter la quantité" className="grid h-11 w-11 place-items-center rounded-lg text-muted hover:bg-page disabled:opacity-40"><Plus size={16} /></button>
            </div>
            <button type="button" disabled={product.stockKg === 0} onClick={() => { onAdd(product, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800) }} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-accent-orange px-5 font-extrabold text-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"><ShoppingBasket size={18} /> {added ? 'Ajouté au panier' : 'Ajouter au panier'}</button>
          </div>
          {product.stockKg > 0 && <p className="mt-2 text-right text-xs text-muted">{formatFCFA(product.pricePerKg * quantity)} au total, hors livraison</p>}
        </div>
      </div>
    </main>
  )
}
