import { Globe2, Leaf, Search, ShoppingBasket, Store } from 'lucide-react'
import type { Language, UserRole } from '../types'

interface SiteHeaderProps {
  role: UserRole
  language: Language
  cartCount: number
  search: string
  onRoleChange: (role: UserRole) => void
  onLanguageChange: (language: Language) => void
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onGoHome: () => void
  onGoCatalog: () => void
  onGoCart: () => void
  onGoOrders: () => void
  onGoProducerProducts: () => void
  onGoProducerOrders: () => void
  onGoProducerProfile: () => void
}

const navButton = 'min-h-11 rounded-lg px-3 py-2 text-sm font-bold transition hover:bg-green-soft hover:text-brand-green'

export function SiteHeader(props: SiteHeaderProps) {
  const {
    role, language, cartCount, search, onRoleChange, onLanguageChange, onSearchChange, onSearchSubmit,
    onGoHome, onGoCatalog, onGoCart, onGoOrders, onGoProducerProducts, onGoProducerOrders, onGoProducerProfile,
  } = props

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[68px] items-center justify-between gap-1.5 sm:gap-3">
          <button type="button" onClick={onGoHome} className="flex shrink-0 items-center gap-2 text-left" aria-label="AgriConnect — accueil">
            <span className="grid h-8 w-8 place-items-center rounded-2xl bg-brand-green text-white sm:h-10 sm:w-10"><Leaf size={18} className="sm:h-5 sm:w-5" fill="currentColor" aria-hidden="true" /></span>
            <span className="leading-tight"><span className="block text-sm font-extrabold tracking-tight text-brand-green sm:text-lg">Agri<span className="text-ink">Connect</span></span><span className="hidden text-[10px] font-semibold uppercase tracking-[.12em] text-muted sm:block">Du champ au panier</span></span>
          </button>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigation principale">
            {role === 'consumer' ? <>
              <button className={navButton} onClick={onGoHome} type="button">Accueil</button>
              <button className={navButton} onClick={onGoCatalog} type="button">Catalogue</button>
              <button className={navButton} onClick={onGoOrders} type="button">Mes commandes</button>
            </> : <>
              <button className={navButton} onClick={onGoProducerProducts} type="button">Produits</button>
              <button className={navButton} onClick={onGoProducerOrders} type="button">Commandes</button>
              <button className={navButton} onClick={onGoProducerProfile} type="button">Mon profil</button>
            </>}
          </nav>

          {role === 'consumer' && <form onSubmit={(event) => { event.preventDefault(); onSearchSubmit() }} className="hidden w-full max-w-48 items-center gap-2 rounded-xl border border-line bg-page px-3 xl:flex"><Search size={16} className="shrink-0 text-muted" aria-hidden="true" /><input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Rechercher…" aria-label="Rechercher un produit" className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" /></form>}

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <label className="hidden items-center gap-1.5 rounded-xl border border-line bg-white px-2.5 py-2 xl:flex" aria-label="Choisir la langue">
              <Globe2 size={15} className="text-muted" aria-hidden="true" />
              <select aria-label="Langue" value={language} onChange={(event) => onLanguageChange(event.target.value as Language)} className="max-w-[104px] bg-transparent text-xs font-bold text-ink outline-none">
                <option value="Français">Français</option><option value="Wolof">Wolof — bientôt</option><option value="Pulaar">Pulaar — bientôt</option><option value="Sérère">Sérère — bientôt</option>
              </select>
            </label>
            {role === 'consumer' && <button type="button" onClick={onGoCart} className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-white text-ink hover:border-brand-green hover:text-brand-green sm:h-10 sm:w-10" aria-label={`Ouvrir le panier, ${cartCount} article${cartCount === 1 ? '' : 's'}`}>
              <ShoppingBasket size={19} aria-hidden="true" />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent-orange px-1 text-[10px] font-extrabold text-white">{cartCount}</span>}
            </button>}
            <div className="flex shrink-0 rounded-xl bg-green-soft p-1" aria-label="Espace de démonstration">
              <button type="button" aria-pressed={role === 'consumer'} onClick={() => onRoleChange('consumer')} className={`grid h-11 w-11 place-items-center rounded-lg transition sm:flex sm:h-11 sm:min-w-11 sm:w-auto sm:gap-1.5 sm:px-2.5 ${role === 'consumer' ? 'bg-white text-brand-green shadow-sm' : 'text-muted hover:text-brand-green'}`}><ShoppingBasket size={17} /><span className="hidden text-xs font-bold lg:inline">Acheter</span></button>
              <button type="button" aria-pressed={role === 'producer'} onClick={() => onRoleChange('producer')} className={`grid h-11 w-11 place-items-center rounded-lg transition sm:flex sm:h-11 sm:min-w-11 sm:w-auto sm:gap-1.5 sm:px-2.5 ${role === 'producer' ? 'bg-white text-brand-green shadow-sm' : 'text-muted hover:text-brand-green'}`}><Store size={17} /><span className="hidden text-xs font-bold lg:inline">Producteur</span></button>
            </div>
          </div>
        </div>

        {role === 'consumer' && <div className="pb-3 xl:hidden">
          <div className="flex gap-1 overflow-x-auto pb-1">
            <button className={`${navButton} shrink-0`} onClick={onGoHome} type="button">Accueil</button>
            <button className={`${navButton} shrink-0`} onClick={onGoCatalog} type="button">Catalogue</button>
            <button className={`${navButton} shrink-0`} onClick={onGoOrders} type="button">Mes commandes</button>
          </div>
        </div>}
        {role === 'producer' && <div className="pb-3 xl:hidden">
          <div className="flex gap-1 overflow-x-auto overscroll-x-contain pb-1">
            <button className={`${navButton} shrink-0`} onClick={onGoProducerProducts} type="button">Produits</button>
            <button className={`${navButton} shrink-0`} onClick={onGoProducerOrders} type="button">Commandes reçues</button>
            <button className={`${navButton} shrink-0`} onClick={onGoProducerProfile} type="button">Mon profil</button>
          </div>
          <label className="ml-auto mt-1 flex h-11 w-fit items-center gap-2 rounded-lg px-2 text-xs font-bold text-muted" aria-label="Choisir la langue">
            <Globe2 size={14} aria-hidden="true" />
            <select aria-label="Langue" value={language} onChange={(event) => onLanguageChange(event.target.value as Language)} className="bg-transparent text-xs font-bold text-ink outline-none">
              <option value="Français">Français</option><option value="Wolof">Wolof</option><option value="Pulaar">Pulaar</option><option value="Sérère">Sérère</option>
            </select>
          </label>
        </div>}
      </div>
      {role === 'consumer' && <div className="border-t border-line/70 px-4 py-2.5 xl:hidden">
        <form onSubmit={(event) => { event.preventDefault(); onSearchSubmit() }} className="flex items-center gap-2">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-page px-3">
            <Search size={17} className="shrink-0 text-muted" aria-hidden="true" />
            <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Produit, producteur, localité…" className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted" aria-label="Rechercher un produit ou un producteur" />
          </label>
          <label className="flex h-10 shrink-0 items-center gap-1 rounded-xl border border-line bg-surface px-2" aria-label="Choisir la langue">
            <Globe2 size={14} className="text-muted" aria-hidden="true" />
            <select aria-label="Langue" value={language} onChange={(event) => onLanguageChange(event.target.value as Language)} className="w-[72px] bg-transparent text-xs font-bold text-ink outline-none">
              <option value="Français">Français</option><option value="Wolof">Wolof</option><option value="Pulaar">Pulaar</option><option value="Sérère">Sérère</option>
            </select>
          </label>
        </form>
      </div>}
    </header>
  )
}
