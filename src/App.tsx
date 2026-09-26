import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Bot, Leaf } from 'lucide-react'
import { SiteHeader } from './components/SiteHeader'
import { Sidebar } from './components/Sidebar'
import { HelpChat } from './components/HelpChat'
import { HomePage } from './pages/consumer/HomePage'
import { CatalogPage } from './pages/consumer/CatalogPage'
import { ProductDetailPage } from './pages/consumer/ProductDetailPage'
import { CartPage } from './pages/consumer/CartPage'
import { CheckoutPage } from './pages/consumer/CheckoutPage'
import { OrderTrackingPage } from './pages/consumer/OrderTrackingPage'
import { SuperAdminDashboard } from './pages/admin/SuperAdminDashboard'
import { initialDrivers, initialOrders, initialProducts, producers as initialProducers, salesHistory } from './data/mockData'
import type { CartLine, ConsumerScreen, Driver, DeliveryMethod, Language, Order, PaymentMethod, Product, Producer, ProducerScreen, SubscriptionTier, UserRole } from './types'

const ProducerDashboard = lazy(() => import('./pages/producer/ProducerDashboard').then((module) => ({ default: module.ProducerDashboard })))
const ProducerProductsPage = lazy(() => import('./pages/producer/ProducerProductsPage').then((module) => ({ default: module.ProducerProductsPage })))
const ProducerOrdersPage = lazy(() => import('./pages/producer/ProducerOrdersPage').then((module) => ({ default: module.ProducerOrdersPage })))
const ProducerProfilePage = lazy(() => import('./pages/producer/ProducerProfilePage').then((module) => ({ default: module.ProducerProfilePage })))

const DELIVERY_HOME = 1200
const DELIVERY_RELAY = 700

const getRouteInfoFromPath = (path: string) => {
  const norm = path.replace(/\/+$/, '').toLowerCase()

  if (norm.startsWith('/superadmin')) {
    if (norm === '/superadmin/commissions' || norm === '/superadmin/payouts' || norm === '/superadmin/inventory') {
      return { role: 'superadmin' as UserRole, superAdminTab: 'inventory' as const }
    }
    if (norm === '/superadmin/producteurs') {
      return { role: 'superadmin' as UserRole, superAdminTab: 'producers' as const }
    }
    return { role: 'superadmin' as UserRole, superAdminTab: 'logistics' as const }
  }

  if (norm.startsWith('/admin') || norm.startsWith('/producteur')) {
    if (norm === '/admin/produits' || norm === '/producteur/produits') {
      return { role: 'producer' as UserRole, producerScreen: 'products' as const }
    }
    if (norm === '/admin/commandes' || norm === '/producteur/commandes') {
      return { role: 'producer' as UserRole, producerScreen: 'orders' as const }
    }
    if (norm === '/admin/profil' || norm === '/producteur/profil') {
      return { role: 'producer' as UserRole, producerScreen: 'profile' as const }
    }
    return { role: 'producer' as UserRole, producerScreen: 'dashboard' as const }
  }

  // Consumer screens
  if (norm === '/catalogue') {
    return { role: 'consumer' as UserRole, consumerScreen: 'catalog' as const }
  }
  if (norm === '/panier') {
    return { role: 'consumer' as UserRole, consumerScreen: 'cart' as const }
  }
  if (norm === '/checkout') {
    return { role: 'consumer' as UserRole, consumerScreen: 'checkout' as const }
  }
  if (norm === '/commandes' || norm === '/suivi') {
    return { role: 'consumer' as UserRole, consumerScreen: 'tracking' as const }
  }
  if (norm === '/produit') {
    return { role: 'consumer' as UserRole, consumerScreen: 'detail' as const }
  }

  return { role: 'consumer' as UserRole, consumerScreen: 'home' as const }
}

const pushUrlPath = (targetPath: string) => {
  if (window.location.pathname !== targetPath) {
    window.history.pushState(null, '', targetPath)
  }
}

function App() {
  const initialRoute = useMemo(() => getRouteInfoFromPath(window.location.pathname), [])

  const [role, setRole] = useState<UserRole>(initialRoute.role)
  const [consumerScreen, setConsumerScreenState] = useState<ConsumerScreen>(initialRoute.consumerScreen ?? 'home')
  const [producerScreen, setProducerScreenState] = useState<ProducerScreen>(initialRoute.producerScreen ?? 'dashboard')
  const [superAdminTab, setSuperAdminTabState] = useState<'logistics' | 'inventory' | 'producers'>(initialRoute.superAdminTab ?? 'logistics')
  const [language, setLanguage] = useState<Language>('Français')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tous')
  const [location, setLocation] = useState('Toutes les zones')
  const [maxPrice, setMaxPrice] = useState(3000)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [producerList, setProducerList] = useState<Producer[]>(initialProducers)
  const [driverList, setDriverList] = useState<Driver[]>(initialDrivers)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id)
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0].id)
  const [payment, setPayment] = useState<PaymentMethod>('Wave')
  const [delivery, setDelivery] = useState<DeliveryMethod>('Domicile')
  const [chatOpen, setChatOpen] = useState(false)
  const [toast, setToast] = useState('')

  const handleNavigateConsumer = (screen: ConsumerScreen) => {
    setRole('consumer')
    setConsumerScreenState(screen)
    const map: Record<ConsumerScreen, string> = {
      home: '/',
      catalog: '/catalogue',
      cart: '/panier',
      checkout: '/checkout',
      tracking: '/commandes',
      detail: '/produit',
    }
    pushUrlPath(map[screen] || '/')
  }

  const handleNavigateProducer = (screen: ProducerScreen) => {
    setRole('producer')
    setProducerScreenState(screen)
    const map: Record<ProducerScreen, string> = {
      dashboard: '/producteur',
      products: '/producteur/produits',
      orders: '/producteur/commandes',
      profile: '/producteur/profil',
    }
    pushUrlPath(map[screen] || '/producteur')
  }

  const handleNavigateSuperAdmin = (tab: 'logistics' | 'inventory' | 'producers') => {
    setRole('superadmin')
    setSuperAdminTabState(tab)
    const map: Record<'logistics' | 'inventory' | 'producers', string> = {
      logistics: '/superadmin/expedition',
      inventory: '/superadmin/commissions',
      producers: '/superadmin/producteurs',
    }
    pushUrlPath(map[tab] || '/superadmin/expedition')
  }

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    const syncRouteFromPath = () => {
      const route = getRouteInfoFromPath(window.location.pathname)
      setRole(route.role)
      if (route.consumerScreen) setConsumerScreenState(route.consumerScreen)
      if (route.producerScreen) setProducerScreenState(route.producerScreen)
      if (route.superAdminTab) setSuperAdminTabState(route.superAdminTab)
    }
    window.addEventListener('popstate', syncRouteFromPath)
    return () => window.removeEventListener('popstate', syncRouteFromPath)
  }, [])

  // Sort products: Premium / Pinned producers at top
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const producerA = producerList.find((p) => p.id === a.producerId)
      const producerB = producerList.find((p) => p.id === b.producerId)
      const scoreA = (producerA?.pinned ? 2 : 0) + (producerA?.isPremium ? 1 : 0)
      const scoreB = (producerB?.pinned ? 2 : 0) + (producerB?.isPremium ? 1 : 0)
      return scoreB - scoreA
    })
  }, [products, producerList])

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((product) => {
      const producer = producerList.find((item) => item.id === product.producerId)
      const normalizedQuery = query.trim().toLocaleLowerCase('fr')
      const matchesText = !normalizedQuery || `${product.name} ${product.category} ${producer?.name ?? ''} ${producer?.location ?? ''}`.toLocaleLowerCase('fr').includes(normalizedQuery)
      const matchesCategory = category === 'Tous' || product.category === category
      const matchesLocation = location === 'Toutes les zones' || producer?.location === location
      return matchesText && matchesCategory && matchesLocation && product.pricePerKg <= maxPrice
    })
  }, [sortedProducts, producerList, query, category, location, maxPrice])

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0]
  const selectedProducer = producerList.find((producer) => producer.id === selectedProduct?.producerId) ?? producerList[0]
  const cartLines: CartLine[] = Object.entries(cart).filter(([, quantity]) => quantity > 0).map(([productId, quantityKg]) => ({ productId, quantityKg }))
  const cartCount = cartLines.length
  const deliveryFee = delivery === 'Domicile' ? DELIVERY_HOME : DELIVERY_RELAY
  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? null
  const producerProducts = products.filter((product) => product.producerId === producerList[0].id)
  const producerOrderCount = orders.filter((order) => order.lines.some((line) => producerProducts.some((product) => product.id === line.productId))).length

  const addToCart = (product: Product, requestedQuantity = 1) => {
    setCart((current) => {
      const available = Math.max(0, product.stockKg - (current[product.id] ?? 0))
      const quantityToAdd = Math.min(available, requestedQuantity)
      if (quantityToAdd < 1) return current
      return { ...current, [product.id]: (current[product.id] ?? 0) + quantityToAdd }
    })
    setToast(`${product.name} ajouté au panier`)
  }

  const changeCartQuantity = (productId: string, quantity: number) => {
    setCart((current) => {
      if (quantity <= 0) {
        const next = { ...current }
        delete next[productId]
        return next
      }
      return { ...current, [productId]: quantity }
    })
  }

  const openProduct = (product: Product) => {
    setSelectedProductId(product.id)
    handleNavigateConsumer('detail')
  }

  const switchRole = (nextRole: UserRole) => {
    setRole(nextRole)
    setChatOpen(false)
    if (nextRole === 'consumer') handleNavigateConsumer('home')
    else if (nextRole === 'producer') handleNavigateProducer('dashboard')
    else if (nextRole === 'superadmin') handleNavigateSuperAdmin('logistics')
  }

  const resetFilters = () => {
    setQuery('')
    setCategory('Tous')
    setLocation('Toutes les zones')
    setMaxPrice(3000)
  }

  const saveProduct = (productData: Omit<Product, 'id' | 'traceability' | 'featured'>, id?: string) => {
    if (id) {
      setProducts((current) => current.map((product) => product.id === id ? { ...product, ...productData } : product))
      setToast('Produit mis à jour')
    } else {
      const newProduct: Product = { ...productData, id: `produit-${Date.now()}`, featured: false, traceability: [{ id: `trace-${Date.now()}`, label: 'Ajout au catalogue', location: 'Votre exploitation', date: 'Aujourd’hui', description: 'Produit ajouté par le producteur pour cette démonstration.' }] }
      setProducts((current) => [newProduct, ...current])
      setToast('Produit ajouté au catalogue')
    }
  }

  const saveProducerProfile = (profile: Producer) => {
    setProducerList((current) => current.map((producer) => producer.id === profile.id ? profile : producer))
    setToast('Profil mis à jour')
  }

  const confirmOrder = (paymentData?: { phone: string; transactionId: string }) => {
    if (!cartLines.length) return
    const order: Order = {
      id: `AC-${String(Date.now()).slice(-6)}`,
      lines: cartLines,
      status: 'Confirmée',
      paymentMethod: payment,
      paymentStatus: 'Payé',
      paymentPhone: paymentData?.phone || '+221 77 000 00 00',
      paymentTransactionId: paymentData?.transactionId || `${payment === 'Wave' ? 'WAVE' : payment === 'Orange Money' ? 'OM' : 'PAY'}-${Date.now().toString().slice(-6)}`,
      paymentTimestamp: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date()),
      deliveryMethod: delivery,
      deliveryFee,
      createdAt: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date()),
      customerName: 'Vous',
      customerPhone: paymentData?.phone || '+221 77 000 00 00',
      driverId: 'drv-1',
      driverName: 'Modou Ndiaye',
      driverPhone: '+221 77 410 88 12',
    }
    setOrders((current) => [order, ...current])
    setSelectedOrderId(order.id)
    setCart({})
    handleNavigateConsumer('tracking')
    setToast(`Paiement ${payment} validé · Commande confirmée`)
  }

  // SuperAdmin handlers
  const handleAssignDriver = (orderId: string, driver: Driver) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              driverId: driver.id,
              driverName: driver.name,
              driverPhone: driver.phone,
              status: order.status === 'Confirmée' ? 'En préparation' : order.status,
            }
          : order
      )
    )
    setToast(`Livreur ${driver.name} affecté à la commande ${orderId}`)
  }

  const handlePayoutProducer = (producerId: string, netPayout: number, commission: number) => {
    setOrders((current) =>
      current.map((order) => {
        const orderProdIds = order.lines.map((l) => products.find((p) => p.id === l.productId)?.producerId)
        if (orderProdIds.includes(producerId)) {
          return {
            ...order,
            payoutStatus: 'Payé',
            payoutTransactionId: `PAYOUT-${Date.now().toString().slice(-6)}`,
            payoutTimestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            payoutAmountFCFA: netPayout,
            commissionAmountFCFA: commission,
          }
        }
        return order
      })
    )
    const prod = producerList.find((p) => p.id === producerId)
    setToast(`Transfert de 90% envoyé à ${prod?.name ?? 'Producteur'}`)
  }

  const handleUpdateProducerSubscription = (producerId: string, tier: SubscriptionTier, pinned: boolean) => {
    setProducerList((current) =>
      current.map((p) =>
        p.id === producerId
          ? {
              ...p,
              subscriptionTier: tier,
              isPremium: tier !== 'Gratuit',
              pinned,
            }
          : p
      )
    )
    setToast(`Statut Premium mis à jour pour ce producteur`)
  }

  const handleAddProducer = (newProducerData: Omit<Producer, 'id'>) => {
    const newProd: Producer = {
      ...newProducerData,
      id: `p-${Date.now()}`,
    }
    setProducerList((current) => [newProd, ...current])
    setToast(`Producteur ${newProd.name} ajouté avec succès`)
  }

  const handleAddDriver = (newDriverData: Omit<Driver, 'id' | 'activeOrderCount'>) => {
    const newDrv: Driver = {
      ...newDriverData,
      id: `drv-${Date.now()}`,
      activeOrderCount: 0,
    }
    setDriverList((current) => [...current, newDrv])
    setToast(`Livreur ${newDrv.name} ajouté à la flotte`)
  }

  return (
    <div className="min-h-screen bg-page text-ink flex">
      {/* Sidebar Navigation */}
      <Sidebar
        role={role}
        consumerScreen={consumerScreen}
        producerScreen={producerScreen}
        superAdminTab={superAdminTab}
        cartCount={cartCount}
        orderCount={producerOrderCount}
        onNavigateConsumer={handleNavigateConsumer}
        onNavigateProducer={handleNavigateProducer}
        onNavigateSuperAdmin={handleNavigateSuperAdmin}
        onRoleChange={switchRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 lg:pl-64 transition-all">
        <SiteHeader
          role={role}
          language={language}
          cartCount={cartCount}
          search={query}
          onLanguageChange={(next) => { setLanguage(next); if (next !== 'Français') setToast(`${next} sera bientôt disponible`) }}
          onSearchChange={setQuery}
          onSearchSubmit={() => handleNavigateConsumer('catalog')}
          onGoHome={() => role === 'consumer' ? handleNavigateConsumer('home') : handleNavigateProducer('dashboard')}
          onGoCart={() => handleNavigateConsumer('cart')}
        />

        {role === 'consumer' && (
          <>
            {consumerScreen === 'home' && <HomePage products={sortedProducts} producers={producerList} search={query} onSearch={setQuery} onCategory={(next) => { setCategory(next); handleNavigateConsumer('catalog') }} onOpenProduct={openProduct} onAddProduct={addToCart} onBrowse={() => handleNavigateConsumer('catalog')} />}
            {consumerScreen === 'catalog' && <CatalogPage products={filteredProducts} producers={producerList} search={query} category={category} location={location} maxPrice={maxPrice} onSearch={setQuery} onCategoryChange={setCategory} onLocationChange={setLocation} onMaxPriceChange={setMaxPrice} onReset={resetFilters} onOpenProduct={openProduct} onAddProduct={addToCart} />}
            {consumerScreen === 'detail' && selectedProduct && <ProductDetailPage product={selectedProduct} producer={selectedProducer} onBack={() => handleNavigateConsumer('catalog')} onAdd={addToCart} />}
            {consumerScreen === 'cart' && <CartPage products={products} lines={cartLines} deliveryFee={DELIVERY_HOME} onQuantityChange={changeCartQuantity} onRemove={(id) => changeCartQuantity(id, 0)} onContinueShopping={() => handleNavigateConsumer('catalog')} onCheckout={() => handleNavigateConsumer('checkout')} />}
            {consumerScreen === 'checkout' && <CheckoutPage products={products} lines={cartLines} payment={payment} delivery={delivery} deliveryFee={deliveryFee} onPaymentChange={setPayment} onDeliveryChange={setDelivery} onBack={() => handleNavigateConsumer('cart')} onConfirm={confirmOrder} />}
            {consumerScreen === 'tracking' && <OrderTrackingPage order={selectedOrder} onBack={() => handleNavigateConsumer('home')} onShop={() => handleNavigateConsumer('catalog')} />}
          </>
        )}

        {role === 'producer' && (
          <div className="min-h-[calc(100vh-72px)] border-t-4 border-brand-green bg-[#f8faf5]">
            <Suspense fallback={<div className="mx-auto grid min-h-[60vh] max-w-7xl place-items-center px-4 text-sm font-semibold text-muted">Chargement de votre espace producteur…</div>}>
              {producerScreen === 'dashboard' && <ProducerDashboard products={producerProducts} sales={salesHistory} orderCount={producerOrderCount} producerName={producerList[0].name} onProducts={() => handleNavigateProducer('products')} onOrders={() => handleNavigateProducer('orders')} onNewProduct={() => handleNavigateProducer('products')} />}
              {producerScreen === 'products' && <ProducerProductsPage products={producerProducts} onSave={saveProduct} />}
              {producerScreen === 'orders' && <ProducerOrdersPage orders={orders} products={producerProducts} producers={producerList} />}
              {producerScreen === 'profile' && <ProducerProfilePage producer={producerList[0]} onSave={saveProducerProfile} />}
            </Suspense>
          </div>
        )}

        {role === 'superadmin' && (
          <div className="min-h-[calc(100vh-72px)] border-t-4 border-slate-900 bg-[#f8faf6]">
            <SuperAdminDashboard
              orders={orders}
              products={products}
              producers={producerList}
              drivers={driverList}
              activeTab={superAdminTab}
              onTabChange={handleNavigateSuperAdmin}
              onAssignDriver={handleAssignDriver}
              onUpdateOrderStatus={(orderId, status) => {
                setOrders((current) => current.map((o) => o.id === orderId ? { ...o, status } : o))
                setToast(`Commande ${orderId} : Statut ${status}`)
              }}
              onPayoutProducer={handlePayoutProducer}
              onUpdateProducerSubscription={handleUpdateProducerSubscription}
              onAddProducer={handleAddProducer}
              onAddDriver={handleAddDriver}
            />
          </div>
        )}

        <footer className="border-t border-line bg-surface px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-green text-white">
                <Leaf size={17} fill="currentColor" />
              </span>
              <span className="text-sm font-extrabold text-brand-green">
                Agri<span className="text-ink">Connect</span>
              </span>
            </div>
            <p className="text-xs text-muted">Des producteurs sénégalais, directement dans votre panier. · Démonstration locale.</p>
            <p className="text-[11px] text-muted">Paiement, livraison et commissions simulés</p>
          </div>
        </footer>
      </div>

      <button
        type="button"
        onClick={() => setChatOpen((open) => !open)}
        className="fixed bottom-4 right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-trust-blue px-4 font-extrabold text-white shadow-float transition hover:-translate-y-0.5 hover:bg-[#163e5a] sm:bottom-6 sm:right-6"
        aria-label={chatOpen ? 'Fermer l’aide' : 'Ouvrir l’aide AgriConnect'}
      >
        <Bot size={19} />
        <span className="text-sm">Aide</span>
      </button>

      <HelpChat open={chatOpen} onClose={() => setChatOpen(false)} />
      {toast && (
        <div role="status" aria-live="polite" className="fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white shadow-float sm:bottom-24">
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
