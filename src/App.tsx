import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Bot, Leaf } from 'lucide-react'
import { SiteHeader } from './components/SiteHeader'
import { HelpChat } from './components/HelpChat'
import { HomePage } from './pages/consumer/HomePage'
import { CatalogPage } from './pages/consumer/CatalogPage'
import { ProductDetailPage } from './pages/consumer/ProductDetailPage'
import { CartPage } from './pages/consumer/CartPage'
import { CheckoutPage } from './pages/consumer/CheckoutPage'
import { OrderTrackingPage } from './pages/consumer/OrderTrackingPage'
import { initialOrders, initialProducts, producers as initialProducers, salesHistory } from './data/mockData'
import type { CartLine, ConsumerScreen, DeliveryMethod, Language, Order, OrderStatus, PaymentMethod, Product, Producer, ProducerScreen, UserRole } from './types'

const ProducerDashboard = lazy(() => import('./pages/producer/ProducerDashboard').then((module) => ({ default: module.ProducerDashboard })))
const ProducerProductsPage = lazy(() => import('./pages/producer/ProducerProductsPage').then((module) => ({ default: module.ProducerProductsPage })))
const ProducerOrdersPage = lazy(() => import('./pages/producer/ProducerOrdersPage').then((module) => ({ default: module.ProducerOrdersPage })))

const ProducerProfilePage = lazy(() => import('./pages/producer/ProducerProfilePage').then((module) => ({ default: module.ProducerProfilePage })))

const orderStatuses: OrderStatus[] = ['Confirmée', 'En préparation', 'En livraison', 'Livrée']
const DELIVERY_HOME = 1200
const DELIVERY_RELAY = 700

function App() {
  const [role, setRole] = useState<UserRole>(() => window.location.pathname.replace(/\/+$/, '') === '/admin' ? 'producer' : 'consumer')
  const [consumerScreen, setConsumerScreen] = useState<ConsumerScreen>('home')
  const [producerScreen, setProducerScreen] = useState<ProducerScreen>('dashboard')
  const [language, setLanguage] = useState<Language>('Français')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Tous')
  const [location, setLocation] = useState('Toutes les zones')
  const [maxPrice, setMaxPrice] = useState(3000)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [producerList, setProducerList] = useState<Producer[]>(initialProducers)
  const [cart, setCart] = useState<Record<string, number>>({})
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id)
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrders[0].id)
  const [payment, setPayment] = useState<PaymentMethod>('Wave')
  const [delivery, setDelivery] = useState<DeliveryMethod>('Domicile')
  const [chatOpen, setChatOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    const syncRoleFromPath = () => {
      const isAdminPath = window.location.pathname.replace(/\/+$/, '') === '/admin'
      setRole(isAdminPath ? 'producer' : 'consumer')
      setProducerScreen('dashboard')
      setConsumerScreen('home')
    }
    window.addEventListener('popstate', syncRoleFromPath)
    return () => window.removeEventListener('popstate', syncRoleFromPath)
  }, [])

  const filteredProducts = useMemo(() => products.filter((product) => {
    const producer = producerList.find((item) => item.id === product.producerId)
    const normalizedQuery = query.trim().toLocaleLowerCase('fr')
    const matchesText = !normalizedQuery || `${product.name} ${product.category} ${producer?.name ?? ''} ${producer?.location ?? ''}`.toLocaleLowerCase('fr').includes(normalizedQuery)
    const matchesCategory = category === 'Tous' || product.category === category
    const matchesLocation = location === 'Toutes les zones' || producer?.location === location
    return matchesText && matchesCategory && matchesLocation && product.pricePerKg <= maxPrice
  }), [products, producerList, query, category, location, maxPrice])

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
    setConsumerScreen('detail')
  }

  const resetFilters = () => {
    setQuery('')
    setCategory('Tous')
    setLocation('Toutes les zones')
    setMaxPrice(3000)
  }

  const switchRole = (nextRole: UserRole) => {
    const nextPath = nextRole === 'producer' ? '/admin' : '/'
    if (window.location.pathname !== nextPath) window.history.pushState({ role: nextRole }, '', nextPath)
    setRole(nextRole)
    setChatOpen(false)
    if (nextRole === 'consumer') setConsumerScreen('home')
    else setProducerScreen('dashboard')
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

  const advanceOrder = (orderId: string) => {
    setOrders((current) => current.map((order) => {
      if (order.id !== orderId) return order
      const nextIndex = Math.min(orderStatuses.length - 1, orderStatuses.indexOf(order.status) + 1)
      return { ...order, status: orderStatuses[nextIndex] }
    }))
    setToast('Statut de la commande mis à jour')
  }

  const confirmOrder = () => {
    if (!cartLines.length) return
    const order: Order = {
      id: `AC-${String(Date.now()).slice(-6)}`,
      lines: cartLines,
      status: 'Confirmée',
      paymentMethod: payment,
      deliveryMethod: delivery,
      deliveryFee,
      createdAt: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(new Date()),
      customerName: 'Vous',
      customerPhone: '+221 77 000 00 00',
    }
    setOrders((current) => [order, ...current])
    setSelectedOrderId(order.id)
    setCart({})
    setConsumerScreen('tracking')
    setToast('Commande de démonstration confirmée')
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader
        role={role}
        language={language}
        cartCount={cartCount}
        search={query}
        onRoleChange={switchRole}
        onLanguageChange={(next) => { setLanguage(next); if (next !== 'Français') setToast(`${next} sera bientôt disponible`) }}
        onSearchChange={setQuery}
        onSearchSubmit={() => setConsumerScreen('catalog')}
        onGoHome={() => role === 'consumer' ? setConsumerScreen('home') : setProducerScreen('dashboard')}
        onGoCatalog={() => setConsumerScreen('catalog')}
        onGoCart={() => setConsumerScreen('cart')}
        onGoOrders={() => setConsumerScreen('tracking')}
        onGoProducerProducts={() => setProducerScreen('products')}
        onGoProducerOrders={() => setProducerScreen('orders')}
        onGoProducerProfile={() => setProducerScreen('profile')}
      />

      {role === 'consumer' ? <>
        {consumerScreen === 'home' && <HomePage products={products} producers={producerList} search={query} onSearch={setQuery} onCategory={(next) => { setCategory(next); setConsumerScreen('catalog') }} onOpenProduct={openProduct} onAddProduct={addToCart} onBrowse={() => setConsumerScreen('catalog')} />}
        {consumerScreen === 'catalog' && <CatalogPage products={filteredProducts} producers={producerList} search={query} category={category} location={location} maxPrice={maxPrice} onSearch={setQuery} onCategoryChange={setCategory} onLocationChange={setLocation} onMaxPriceChange={setMaxPrice} onReset={resetFilters} onOpenProduct={openProduct} onAddProduct={addToCart} />}
        {consumerScreen === 'detail' && selectedProduct && <ProductDetailPage product={selectedProduct} producer={selectedProducer} onBack={() => setConsumerScreen('catalog')} onAdd={addToCart} />}
        {consumerScreen === 'cart' && <CartPage products={products} lines={cartLines} deliveryFee={DELIVERY_HOME} onQuantityChange={changeCartQuantity} onRemove={(id) => changeCartQuantity(id, 0)} onContinueShopping={() => setConsumerScreen('catalog')} onCheckout={() => setConsumerScreen('checkout')} />}
        {consumerScreen === 'checkout' && <CheckoutPage products={products} lines={cartLines} payment={payment} delivery={delivery} deliveryFee={deliveryFee} onPaymentChange={setPayment} onDeliveryChange={setDelivery} onBack={() => setConsumerScreen('cart')} onConfirm={confirmOrder} />}
        {consumerScreen === 'tracking' && <OrderTrackingPage order={selectedOrder} onBack={() => setConsumerScreen('home')} onShop={() => setConsumerScreen('catalog')} />}
      </> : <div className="min-h-[calc(100vh-72px)] border-t-4 border-brand-green bg-[#f8faf5]">
        <Suspense fallback={<div className="mx-auto grid min-h-[60vh] max-w-7xl place-items-center px-4 text-sm font-semibold text-muted">Chargement de votre espace producteur…</div>}>
          {producerScreen === 'dashboard' && <ProducerDashboard products={producerProducts} sales={salesHistory} orderCount={producerOrderCount} producerName={producerList[0].name} onProducts={() => setProducerScreen('products')} onOrders={() => setProducerScreen('orders')} onNewProduct={() => setProducerScreen('products')} />}
          {producerScreen === 'products' && <ProducerProductsPage products={producerProducts} onSave={saveProduct} />}
          {producerScreen === 'orders' && <ProducerOrdersPage orders={orders} products={producerProducts} producers={producerList} onAdvance={advanceOrder} />}
          {producerScreen === 'profile' && <ProducerProfilePage producer={producerList[0]} onSave={saveProducerProfile} />}
        </Suspense>
      </div>}

      <footer className="border-t border-line bg-surface px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-green text-white"><Leaf size={17} fill="currentColor" /></span><span className="text-sm font-extrabold text-brand-green">Agri<span className="text-ink">Connect</span></span></div><p className="text-xs text-muted">Des producteurs sénégalais, directement dans votre panier. · Démonstration locale.</p><p className="text-[11px] text-muted">Paiement et commandes simulés</p></div></footer>

      <button type="button" onClick={() => setChatOpen((open) => !open)} className="fixed bottom-4 right-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-trust-blue px-4 font-extrabold text-white shadow-float transition hover:-translate-y-0.5 hover:bg-[#163e5a] sm:bottom-6 sm:right-6" aria-label={chatOpen ? 'Fermer l’aide' : 'Ouvrir l’aide AgriConnect'}><Bot size={19}/><span className="text-sm">Aide</span></button>
      <HelpChat open={chatOpen} onClose={() => setChatOpen(false)} />
      {toast && <div role="status" aria-live="polite" className="fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-ink px-4 py-2.5 text-sm font-bold text-white shadow-float sm:bottom-24">{toast}</div>}
    </div>
  )
}

export default App
