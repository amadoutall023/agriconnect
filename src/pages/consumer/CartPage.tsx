import { ArrowLeft, ArrowRight, Leaf, ShoppingBasket } from 'lucide-react'
import type { CartLine, Product } from '../../types'
import { CartItem } from '../../components/CartItem'
import { formatFCFA } from '../../lib/format'

interface CartPageProps {
  products: Product[]
  lines: CartLine[]
  deliveryFee: number
  onQuantityChange: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onContinueShopping: () => void
  onCheckout: () => void
}

export function CartPage({ products, lines, deliveryFee, onQuantityChange, onRemove, onContinueShopping, onCheckout }: CartPageProps) {
  const cartLines = lines.map((line) => ({ line, product: products.find((item) => item.id === line.productId) })).filter((entry): entry is { line: CartLine; product: Product } => Boolean(entry.product))
  const subtotal = cartLines.reduce((sum, { line, product }) => sum + line.quantityKg * product.pricePerKg, 0)

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <button type="button" onClick={onContinueShopping} className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-brand-green"><ArrowLeft size={16} /> Continuer mes achats</button>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Votre panier <span className="text-base font-bold text-muted">({cartLines.length})</span></h1>
      {cartLines.length === 0 ? <div className="mt-6 rounded-3xl border border-dashed border-line bg-surface px-5 py-16 text-center"><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-green-soft text-brand-green"><ShoppingBasket size={30} /></span><h2 className="mt-4 text-xl font-extrabold">Votre panier attend sa première récolte</h2><p className="mt-2 text-sm text-muted">Découvrez les produits des fermes autour de Dakar.</p><button type="button" onClick={onContinueShopping} className="mt-5 rounded-xl bg-brand-green px-5 py-3 text-sm font-extrabold text-white hover:bg-green-deep">Découvrir le catalogue</button></div> : <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1fr_360px]">
        <section className="rounded-2xl border border-line bg-surface px-4 sm:px-6"><div className="hidden grid-cols-[1fr_auto] border-b border-line py-3 text-xs font-bold uppercase tracking-wider text-muted sm:grid"><span>Produit</span><span>Quantité et total</span></div>{cartLines.map(({ line, product }) => <CartItem key={line.productId} product={product} quantity={line.quantityKg} onQuantityChange={(quantity) => onQuantityChange(product.id, quantity)} onRemove={() => onRemove(product.id)} />)}</section>
        <aside className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-extrabold">Récapitulatif</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-3 text-muted"><span>Sous-total</span><span className="font-bold tabular-nums text-ink">{formatFCFA(subtotal)}</span></div><div className="flex justify-between gap-3 text-muted"><span>Livraison estimée</span><span className="font-bold tabular-nums text-ink">{formatFCFA(deliveryFee)}</span></div><div className="flex items-center gap-2 rounded-xl bg-green-soft px-3 py-2 text-xs font-semibold text-green-deep"><Leaf size={14} /> Livraison vers Dakar calculée à l’étape suivante</div><div className="flex justify-between border-t border-line pt-4 text-base font-extrabold"><span>Total estimé</span><span className="tabular-nums">{formatFCFA(subtotal + deliveryFee)}</span></div></div>
          <button type="button" onClick={onCheckout} className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent-orange px-4 font-extrabold text-ink hover:brightness-95">Passer la commande <ArrowRight size={17} /></button>
          <p className="mt-3 text-center text-xs text-muted">Le paiement n’est débité qu’après confirmation.</p>
        </aside>
      </div>}
    </main>
  )
}
