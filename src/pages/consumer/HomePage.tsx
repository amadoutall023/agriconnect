import { ArrowRight, BadgeCheck, MapPin, Search, ShieldCheck, Truck } from 'lucide-react'
import type { Product, Producer, ProductCategory } from '../../types'
import { ProductCard } from '../../components/ProductCard'

interface HomePageProps {
  products: Product[]
  producers: Producer[]
  search: string
  onSearch: (value: string) => void
  onCategory: (category: ProductCategory) => void
  onOpenProduct: (product: Product) => void
  onAddProduct: (product: Product) => void
  onBrowse: () => void
}

const categories: { name: ProductCategory; emoji: string; note: string }[] = [
  { name: 'Fruits', emoji: '🥭', note: 'Récoltés à maturité' },
  { name: 'Légumes', emoji: '🥬', note: 'Du champ à Dakar' },
  { name: 'Céréales', emoji: '🌾', note: 'Producteurs du Sénégal' },
  { name: 'Volaille', emoji: '🥚', note: 'Élevage plein air' },
]

const fieldImage = 'https://images.pexels.com/photos/6875366/pexels-photo-6875366.jpeg?auto=compress&cs=tinysrgb&w=1200'

export function HomePage({ products, producers, search, onSearch, onCategory, onOpenProduct, onAddProduct, onBrowse }: HomePageProps) {
  const featured = products.filter((product) => product.featured).slice(0, 4)
  const findProducer = (id: string) => producers.find((producer) => producer.id === id) ?? producers[0]

  return (
    <div className="pb-14">
      <section className="relative isolate overflow-hidden bg-brand-green text-white">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_20%_10%,#398653_0%,#1f7a3d_46%,#175b2d_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-[.13]" style={{ backgroundImage: 'radial-gradient(#fff 0.7px, transparent 0.7px)', backgroundSize: '16px 16px' }} />
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:px-8 lg:py-[4.25rem]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-white/95"><span className="h-2 w-2 rounded-full bg-[#f2bd59]" /> Le marché local, en direct</span>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.4rem]">Connecter les producteurs locaux aux consommateurs urbains</h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-white/80 sm:text-lg">Des produits frais du Sénégal, une origine connue et un prix juste — livrés chez vous à Dakar.</p>
            <label className="mt-7 flex max-w-xl items-center gap-3 rounded-2xl bg-white p-2 pl-4 shadow-lg shadow-black/10">
              <Search size={20} className="shrink-0 text-muted" aria-hidden="true" />
              <input type="search" value={search} onChange={(event) => onSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); onBrowse() } }} placeholder="Mangues, tomates, mil…" aria-label="Rechercher un produit ou producteur" className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted sm:text-base" />
              <button type="button" aria-label="Rechercher dans le catalogue" onClick={onBrowse} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-orange text-ink transition hover:brightness-95 sm:flex sm:w-auto sm:gap-2 sm:px-4"><span className="hidden sm:inline">Rechercher</span><ArrowRight size={16} aria-hidden="true" /></button>
            </label>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/75 sm:text-sm">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={16} className="text-[#bde4bf]" /> Origine visible</span>
              <span className="inline-flex items-center gap-1.5"><Truck size={16} className="text-[#bde4bf]" /> Livraison à Dakar</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck size={16} className="text-[#bde4bf]" /> Achat en direct</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="absolute -inset-2 rotate-2 rounded-[2rem] bg-[#d7e8c3]/20" />
            <img src={fieldImage} alt="Producteurs récoltant des légumes au champ — photo de Quang Nguyen Vinh sur Pexels" width={1200} height={900} fetchPriority="high" className="relative h-64 w-full rounded-[1.65rem] object-cover shadow-xl sm:h-80 lg:h-[350px]" />
            <div className="absolute -bottom-4 left-3 right-3 rounded-2xl border border-white/70 bg-white p-3 text-ink shadow-lg sm:left-6 sm:right-auto sm:min-w-72 sm:p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-soft text-brand-green"><MapPin size={20} /></span>
                <div><p className="text-xs font-semibold text-muted">Produit du jour</p><p className="font-extrabold">Des Niayes à votre table</p></div>
                <span className="ml-auto rounded-full bg-green-soft px-2.5 py-1 text-xs font-bold text-brand-green">100 % local</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8 lg:pt-[4.5rem]">
        <div className="flex items-end justify-between gap-3">
          <div><p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Faites votre marché</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Qu’est-ce qui vous ferait plaisir ?</h2></div>
          <button type="button" onClick={onBrowse} className="hidden items-center gap-1 text-sm font-bold text-brand-green hover:underline sm:inline-flex">Tout le catalogue <ArrowRight size={16} /></button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {categories.map((category) => <button key={category.name} type="button" onClick={() => onCategory(category.name)} className="group flex min-h-24 items-center gap-3 rounded-2xl border border-line bg-surface p-3 text-left transition hover:border-brand-green/40 hover:bg-green-soft/50 sm:gap-4 sm:p-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-page text-2xl transition group-hover:scale-105 sm:h-14 sm:w-14">{category.emoji}</span>
            <span className="min-w-0"><span className="block font-extrabold text-ink">{category.name}</span><span className="mt-0.5 block text-[11px] leading-4 text-muted sm:text-xs">{category.note}</span></span>
          </button>)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
        <div className="flex items-end justify-between gap-3">
          <div><p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Du producteur à vous</p><h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">À goûter cette semaine</h2><p className="mt-1 text-sm text-muted">Cultivés avec soin, près de chez vous.</p></div>
          <button type="button" onClick={onBrowse} className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-brand-green hover:underline">Tout voir <ArrowRight size={16} /></button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {featured.map((product) => <ProductCard key={product.id} product={product} producer={findProducer(product.producerId)} onOpen={onOpenProduct} onAdd={onAddProduct} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#cddfc8] bg-green-soft p-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
          <div><p className="font-extrabold text-green-deep">Chaque achat soutient une ferme sénégalaise.</p><p className="mt-1 text-sm text-muted">Rencontrez les producteurs et suivez le chemin de votre récolte.</p></div>
          <button type="button" onClick={onBrowse} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-extrabold text-white hover:bg-green-deep">Découvrir les produits <ArrowRight size={16} /></button>
        </div>
      </section>
    </div>
  )
}
