import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import type { Product, Producer, ProductCategory } from '../../types'
import { ProductCard } from '../../components/ProductCard'
import { locations } from '../../data/mockData'

interface CatalogPageProps {
  products: Product[]
  producers: Producer[]
  search: string
  category: string
  location: string
  maxPrice: number
  onSearch: (value: string) => void
  onCategoryChange: (value: string) => void
  onLocationChange: (value: string) => void
  onMaxPriceChange: (value: number) => void
  onReset: () => void
  onOpenProduct: (product: Product) => void
  onAddProduct: (product: Product) => void
}

const categoryOptions: ProductCategory[] = ['Fruits', 'Légumes', 'Céréales', 'Volaille']

export function CatalogPage({ products, producers, search, category, location, maxPrice, onSearch, onCategoryChange, onLocationChange, onMaxPriceChange, onReset, onOpenProduct, onAddProduct }: CatalogPageProps) {
  const findProducer = (id: string) => producers.find((producer) => producer.id === id) ?? producers[0]
  const hasFilters = category !== 'Tous' || location !== 'Toutes les zones' || maxPrice < 3000 || Boolean(search)

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div><p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Les récoltes du moment</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Le catalogue</h1><p className="mt-2 text-sm text-muted">Des produits sélectionnés, directement auprès des producteurs.</p></div>
        <p className="text-sm font-semibold text-muted">{products.length} produit{products.length === 1 ? '' : 's'}</p>
      </div>
      <div className="mt-6 rounded-2xl border border-line bg-surface p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-ink"><SlidersHorizontal size={17} className="text-brand-green" /> Affiner ma recherche</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.25fr_auto]">
          <label className="text-xs font-bold text-muted">Rechercher
            <input type="search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Produit, producteur…" className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium text-ink outline-none focus:border-brand-green" />
          </label>
          <label className="text-xs font-bold text-muted">Catégorie
            <select value={category} onChange={(event) => onCategoryChange(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-brand-green">
              <option value="Tous">Toutes les catégories</option>{categoryOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-muted">Producteur, par zone
            <select value={location} onChange={(event) => onLocationChange(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-brand-green">
              {locations.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="text-xs font-bold text-muted">Prix max. <span className="font-extrabold text-orange-ink">{new Intl.NumberFormat('fr-FR').format(maxPrice)} FCFA/kg</span>
            <input type="range" min="500" max="3000" step="100" value={maxPrice} onChange={(event) => onMaxPriceChange(Number(event.target.value))} className="mt-3 block h-2 w-full cursor-pointer accent-brand-green" aria-label="Prix maximum par kilogramme" />
          </label>
          {hasFilters && <button type="button" onClick={onReset} className="inline-flex h-11 items-center justify-center gap-2 self-end rounded-xl px-3 text-sm font-bold text-muted hover:bg-page hover:text-brand-green"><RotateCcw size={15} /> Effacer</button>}
        </div>
      </div>
      {products.length ? <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => <ProductCard key={product.id} product={product} producer={findProducer(product.producerId)} onOpen={onOpenProduct} onAdd={onAddProduct} />)}
      </div> : <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface px-5 py-14 text-center"><span className="text-3xl" aria-hidden="true">🧺</span><h2 className="mt-3 text-xl font-extrabold">Aucun produit ne correspond à votre recherche</h2><p className="mt-2 text-sm text-muted">Essayez une autre catégorie, une autre zone ou un prix plus élevé.</p><button type="button" onClick={onReset} className="mt-4 rounded-xl bg-green-soft px-4 py-2.5 text-sm font-bold text-brand-green">Effacer les filtres</button></div>}
    </main>
  )
}
