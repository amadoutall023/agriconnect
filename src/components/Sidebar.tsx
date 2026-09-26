import { useState } from 'react'
import {
  Home,
  ShoppingBag,
  PackageCheck,
  Box,
  Truck,
  Wallet,
  Users,
  ShieldCheck,
  Leaf,
  User,
  ShoppingBasket,
  Store,
  X,
} from 'lucide-react'
import type { ConsumerScreen, ProducerScreen, UserRole } from '../types'

interface SidebarProps {
  role: UserRole
  consumerScreen: ConsumerScreen
  producerScreen: ProducerScreen
  superAdminTab: 'logistics' | 'inventory' | 'producers'
  cartCount: number
  orderCount: number
  isOpen?: boolean
  onToggleOpen?: () => void
  onClose?: () => void
  onNavigateConsumer: (screen: ConsumerScreen) => void
  onNavigateProducer: (screen: ProducerScreen) => void
  onNavigateSuperAdmin: (tab: 'logistics' | 'inventory' | 'producers') => void
  onRoleChange: (role: UserRole) => void
}

export function Sidebar({
  role,
  consumerScreen,
  producerScreen,
  superAdminTab,
  cartCount,
  orderCount,
  isOpen: propsIsOpen,
  onToggleOpen,
  onClose,
  onNavigateConsumer,
  onNavigateProducer,
  onNavigateSuperAdmin,
  onRoleChange,
}: SidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)

  const isOpen = propsIsOpen ?? internalIsOpen

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      if (onClose) onClose()
      else if (propsIsOpen && onToggleOpen) onToggleOpen()
      else setInternalIsOpen(false)
    }
  }

  const handleConsumerClick = (screen: ConsumerScreen) => {
    if (role !== 'consumer') onRoleChange('consumer')
    onNavigateConsumer(screen)
    closeSidebar()
  }

  const handleProducerClick = (screen: ProducerScreen) => {
    if (role !== 'producer') onRoleChange('producer')
    onNavigateProducer(screen)
    closeSidebar()
  }

  const handleSuperAdminClick = (tab: 'logistics' | 'inventory' | 'producers') => {
    if (role !== 'superadmin') onRoleChange('superadmin')
    onNavigateSuperAdmin(tab)
    closeSidebar()
  }

  return (
    <>
      {/* Overlay Backdrop (Mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => {
            if (onClose) onClose()
            else if (propsIsOpen && onToggleOpen) onToggleOpen()
            else setInternalIsOpen(false)
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-white shadow-2xl transition-all duration-300 flex flex-col border-r border-slate-800/80 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header Logo & Close Button */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-green text-white shadow-md">
              <Leaf size={20} fill="currentColor" />
            </span>
            <div className="min-w-0">
              <span className="block text-base font-extrabold tracking-tight text-white leading-tight">
                Agri<span className="text-brand-green">Connect</span>
              </span>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                {role === 'consumer' ? 'Marché Client' : role === 'producer' ? 'Producteur Local' : 'Administration'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onClose) onClose()
              else if (propsIsOpen && onToggleOpen) onToggleOpen()
              else setInternalIsOpen(false)
            }}
            className="grid h-8 w-8 place-items-center rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition shrink-0"
            title="Fermer le menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Navigation Menu - Filtered strictly by active role */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
          {role === 'consumer' && (
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1">
                <ShoppingBasket size={12} className="text-brand-green" /> Espace Acheteur
              </span>
              <div className="space-y-1">
                <SidebarItem
                  icon={Home}
                  label="Accueil"
                  active={consumerScreen === 'home'}
                  onClick={() => handleConsumerClick('home')}
                />
                <SidebarItem
                  icon={ShoppingBag}
                  label="Catalogue Récoltes"
                  active={consumerScreen === 'catalog'}
                  onClick={() => handleConsumerClick('catalog')}
                />
                <SidebarItem
                  icon={ShoppingBasket}
                  label="Mon Panier"
                  active={consumerScreen === 'cart'}
                  badge={cartCount > 0 ? cartCount : undefined}
                  onClick={() => handleConsumerClick('cart')}
                />
                <SidebarItem
                  icon={PackageCheck}
                  label="Suivi Commandes"
                  active={consumerScreen === 'tracking'}
                  onClick={() => handleConsumerClick('tracking')}
                />
              </div>
            </div>
          )}

          {role === 'producer' && (
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1">
                <Store size={12} className="text-amber-400" /> Espace Producteur
              </span>
              <div className="space-y-1">
                <SidebarItem
                  icon={Home}
                  label="Tableau de Bord"
                  active={producerScreen === 'dashboard'}
                  onClick={() => handleProducerClick('dashboard')}
                />
                <SidebarItem
                  icon={Box}
                  label="Mes Produits"
                  active={producerScreen === 'products'}
                  onClick={() => handleProducerClick('products')}
                />
                <SidebarItem
                  icon={ShoppingBag}
                  label="Commandes Reçues"
                  active={producerScreen === 'orders'}
                  badge={orderCount > 0 ? orderCount : undefined}
                  onClick={() => handleProducerClick('orders')}
                />
                <SidebarItem
                  icon={User}
                  label="Mon Profil Exploitation"
                  active={producerScreen === 'profile'}
                  onClick={() => handleProducerClick('profile')}
                />
              </div>
            </div>
          )}

          {role === 'superadmin' && (
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1">
                <ShieldCheck size={12} className="text-sky-400" /> SuperAdmin System
              </span>
              <div className="space-y-1">
                <SidebarItem
                  icon={Truck}
                  label="Expédition & Livreurs"
                  active={superAdminTab === 'logistics'}
                  onClick={() => handleSuperAdminClick('logistics')}
                />
                <SidebarItem
                  icon={Wallet}
                  label="Commissions & Payouts"
                  active={superAdminTab === 'inventory'}
                  onClick={() => handleSuperAdminClick('inventory')}
                />
                <SidebarItem
                  icon={Users}
                  label="Gestion Producteurs"
                  active={superAdminTab === 'producers'}
                  onClick={() => handleSuperAdminClick('producers')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5 rounded-2xl bg-slate-900 p-2 border border-slate-800 text-slate-400">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-green/20 text-emerald-400 shrink-0">
              <ShieldCheck size={14} />
            </span>
            <span className="text-[11px] font-bold text-slate-300 truncate">AgriConnect Sénégal</span>
          </div>
        </div>
      </aside>
    </>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  active,
  badge,
  onClick,
}: {
  icon: any
  label: string
  active: boolean
  badge?: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-extrabold transition active:scale-[0.98] ${
        active
          ? 'bg-brand-green text-white shadow-md shadow-brand-green/20'
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={18} className={`shrink-0 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
      <span className="truncate flex-1 text-left">{label}</span>
      {badge !== undefined && (
        <span
          className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-mono font-extrabold ${
            active ? 'bg-white text-slate-900' : 'bg-amber-400 text-slate-950'
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
