import { MapPin, Plus, QrCode } from 'lucide-react'
import type { Product, Producer } from '../types'
import { formatFCFA } from '../lib/format'

interface ProductCardProps {
  product: Product
  producer: Producer
  onOpen: (product: Product) => void
  onAdd: (product: Product) => void
}

export function ProductCard({ product, producer, onOpen, onAdd }: ProductCardProps) {
  const unavailable = product.stockKg <= 0

  return (
    <article className="group overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <button type="button" onClick={() => onOpen(product)} className="relative block w-full overflow-hidden text-left" aria-label={`Découvrir ${product.name}`}>
        <img
          src={product.imageUrl}
          alt={product.imageAlt}
          width={720}
          height={560}
          loading="lazy"
          className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:h-48"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-trust-blue shadow-sm">
          <QrCode size={14} aria-hidden="true" /> Traçable
        </span>
        <span className="absolute bottom-3 left-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
          {product.category}
        </span>
      </button>
      <div className="p-4">
        <div className="flex min-h-12 items-start justify-between gap-2">
          <button type="button" onClick={() => onOpen(product)} className="text-left font-extrabold leading-5 text-ink hover:text-brand-green">
            {product.name}
          </button>
          <span className="shrink-0 text-right text-sm font-extrabold tabular-nums text-orange-ink">
            {formatFCFA(product.pricePerKg)}<span className="block text-[11px] font-semibold text-muted">/ kg</span>
          </span>
        </div>
        <div className="mt-2 flex min-w-0 items-center gap-1.5 text-sm text-muted">
          <MapPin size={14} className="shrink-0 text-brand-green" aria-hidden="true" />
          <span className="truncate">{producer.name} · {producer.location}</span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
          <span className={`min-w-0 flex-1 truncate text-[11px] font-semibold sm:text-xs ${unavailable ? 'text-orange-ink' : 'text-brand-green'}`}>
            {unavailable ? 'Rupture de stock' : `${product.stockKg} kg disponibles`}
          </span>
          <button
            type="button"
            aria-label={`Ajouter ${product.name} au panier`}
            disabled={unavailable}
            onClick={() => onAdd(product)}
            className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-brand-green px-2.5 text-xs font-bold text-white transition hover:bg-green-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted sm:gap-1.5 sm:px-3"
          >
            <Plus size={15} aria-hidden="true" /> Ajouter
          </button>
        </div>
      </div>
    </article>
  )
}
