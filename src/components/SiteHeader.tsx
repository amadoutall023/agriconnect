import { Globe2, Leaf, Search, ShieldCheck, ShoppingBasket, User } from 'lucide-react'
import type { Language, UserRole } from '../types'

interface SiteHeaderProps {
  role: UserRole
  language: Language
  cartCount: number
  search: string
  onLanguageChange: (language: Language) => void
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onGoHome: () => void
  onGoCart: () => void
}

export function SiteHeader(props: SiteHeaderProps) {
  const {
    role,
    language,
    cartCount,
    search,
    onLanguageChange,
    onSearchChange,
    onSearchSubmit,
    onGoHome,
    onGoCart,
  } = props

  const roleLabel = {
    consumer: 'Espace Client',
    producer: 'Espace Producteur',
    superadmin: 'Administration System',
  }[role]

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[64px] items-center justify-between gap-3">
          {/* Logo Brand */}
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2.5 text-left"
            aria-label="AgriConnect — accueil"
          >
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-green text-white shadow-sm sm:h-10 sm:w-10">
              <Leaf size={19} fill="currentColor" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight text-brand-green sm:text-lg">
                Agri<span className="text-ink">Connect</span>
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[.12em] text-muted sm:block">
                Du champ au panier
              </span>
            </span>
          </button>

          {/* Search Bar (visible on Consumer view) */}
          {role === 'consumer' && (
            <form
              onSubmit={(event) => {
                event.preventDefault()
                onSearchSubmit()
              }}
              className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-line bg-page px-3.5 shadow-inner"
            >
              <Search size={17} className="shrink-0 text-muted" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Rechercher des mangues, tomates, mil, producteurs..."
                aria-label="Rechercher un produit"
                className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
              />
            </form>
          )}

          {/* Right Header Utilities: Language, Cart, User Profile Badge */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Language Selector */}
            <label
              className="hidden items-center gap-1.5 rounded-xl border border-line bg-white px-3 py-2 text-xs font-bold text-ink sm:flex shadow-sm"
              aria-label="Choisir la langue"
            >
              <Globe2 size={15} className="text-muted" aria-hidden="true" />
              <select
                aria-label="Langue"
                value={language}
                onChange={(event) => onLanguageChange(event.target.value as Language)}
                className="bg-transparent text-xs font-bold text-ink outline-none"
              >
                <option value="Français">Français</option>
                <option value="Wolof">Wolof</option>
                <option value="Pulaar">Pulaar</option>
                <option value="Sérère">Sérère</option>
              </select>
            </label>

            {/* Shopping Cart Button */}
            {role === 'consumer' && (
              <button
                type="button"
                onClick={onGoCart}
                className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-white text-ink hover:border-brand-green hover:text-brand-green transition shadow-sm"
                aria-label={`Ouvrir le panier, ${cartCount} article${cartCount === 1 ? '' : 's'}`}
              >
                <ShoppingBasket size={19} aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent-orange px-1 text-[10px] font-extrabold text-white shadow">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Professional User Profile Badge */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-sm">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-900 text-white font-extrabold">
                {role === 'superadmin' ? <ShieldCheck size={15} /> : <User size={15} />}
              </span>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-extrabold leading-tight text-slate-900">{roleLabel}</span>
                <span className="block text-[10px] text-slate-500 font-medium">Sénégal · En ligne</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
