import { Minus, Plus, Trash2 } from 'lucide-react'
import type { Product } from '../types'
import { formatFCFA } from '../lib/format'

interface CartItemProps {
  product: Product
  quantity: number
  onQuantityChange: (next: number) => void
  onRemove: () => void
}

export function CartItem({ product, quantity, onQuantityChange, onRemove }: CartItemProps) {
  return (
    <article className="flex gap-2 border-b border-line py-4 last:border-0 sm:gap-4">
      <img src={product.imageUrl} alt={product.imageAlt} width={96} height={96} className="h-16 w-16 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24" />
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 className="truncate font-extrabold text-ink">{product.name}</h3>
          <p className="mt-0.5 text-sm text-orange-ink">{formatFCFA(product.pricePerKg)} / kg</p>
        </div>
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:justify-end sm:gap-3">
          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-line bg-white p-1 sm:gap-2">
            <button type="button" onClick={() => onQuantityChange(Math.max(0, quantity - 1))} className="grid h-11 w-11 place-items-center rounded-lg text-muted hover:bg-green-soft hover:text-brand-green sm:h-9 sm:w-9" aria-label={`Retirer 1 kg de ${product.name}`}><Minus size={15} /></button>
            <span className="min-w-10 text-center text-sm font-bold tabular-nums">{quantity} kg</span>
            <button type="button" disabled={quantity >= product.stockKg} onClick={() => onQuantityChange(Math.min(product.stockKg, quantity + 1))} className="grid h-11 w-11 place-items-center rounded-lg text-muted hover:bg-green-soft hover:text-brand-green disabled:opacity-40 sm:h-9 sm:w-9" aria-label={`Ajouter 1 kg de ${product.name}`}><Plus size={15} /></button>
          </div>
          <span className="ml-auto whitespace-nowrap text-right text-xs font-extrabold tabular-nums sm:min-w-24 sm:text-sm">{formatFCFA(product.pricePerKg * quantity)}</span>
          <button type="button" onClick={onRemove} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-700 sm:h-9 sm:w-9" aria-label={`Supprimer ${product.name} du panier`}><Trash2 size={16} /></button>
        </div>
      </div>
    </article>
  )
}
