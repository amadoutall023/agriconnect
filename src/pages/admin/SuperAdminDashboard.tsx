import { useState } from 'react'
import {
  Truck,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Plus,
  Pin,
  Smartphone,
  MapPin,
  UserCheck,
  Building2,
  Send,
  X,
  Phone,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { Driver, Order, OrderStatus, Product, Producer, SubscriptionTier } from '../../types'
import { formatFCFA } from '../../lib/format'

interface SuperAdminDashboardProps {
  orders: Order[]
  products: Product[]
  producers: Producer[]
  drivers: Driver[]
  activeTab?: 'logistics' | 'inventory' | 'producers'
  onTabChange?: (tab: 'logistics' | 'inventory' | 'producers') => void
  onAssignDriver: (orderId: string, driver: Driver) => void
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void
  onPayoutProducer: (producerId: string, amountFCFA: number, commissionFCFA: number) => void
  onUpdateProducerSubscription: (producerId: string, tier: SubscriptionTier, pinned: boolean) => void
  onAddProducer: (newProducer: Omit<Producer, 'id'>) => void
  onAddDriver: (newDriver: Omit<Driver, 'id' | 'activeOrderCount'>) => void
}

export function SuperAdminDashboard({
  orders,
  products,
  producers,
  drivers,
  activeTab: externalActiveTab,
  onAssignDriver,
  onUpdateOrderStatus,
  onPayoutProducer,
  onUpdateProducerSubscription,
  onAddProducer,
  onAddDriver,
}: SuperAdminDashboardProps) {
  const [internalActiveTab] = useState<'logistics' | 'inventory' | 'producers'>('logistics')
  const activeTab = externalActiveTab ?? internalActiveTab

  // Modals state
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null)
  const [payoutModalProducer, setPayoutModalProducer] = useState<{
    producer: Producer
    totalSales: number
    netPayout: number
    commission: number
    ordersCount: number
  } | null>(null)

  const [payoutMethod, setPayoutMethod] = useState<'Wave' | 'Orange Money' | 'Free Money' | 'Virement Bancaire'>('Wave')
  const [payoutPhoneInput, setPayoutPhoneInput] = useState('')
  const [payoutSuccessTx, setPayoutSuccessTx] = useState<string | null>(null)
  const [isAddingProducer, setIsAddingProducer] = useState(false)
  const [isAddingDriver, setIsAddingDriver] = useState(false)

  // Driver pagination state
  const [driverPage, setDriverPage] = useState(1)
  const DRIVERS_PER_PAGE = 4
  const totalDriverPages = Math.ceil(drivers.length / DRIVERS_PER_PAGE) || 1
  const paginatedDrivers = drivers.slice(
    (driverPage - 1) * DRIVERS_PER_PAGE,
    driverPage * DRIVERS_PER_PAGE
  )

  // New producer form state
  const [newProdName, setNewProdName] = useState('')
  const [newProdCoop, setNewProdCoop] = useState('')
  const [newProdLoc, setNewProdLoc] = useState('Rufisque')
  const [newProdPhone, setNewProdPhone] = useState('+221 77 000 00 00')
  const [newProdTier, setNewProdTier] = useState<SubscriptionTier>('Premium Standard')

  // New driver form state
  const [newDriverName, setNewDriverName] = useState('')
  const [newDriverPhone, setNewDriverPhone] = useState('+221 77 000 00 00')
  const [newDriverVehicle, setNewDriverVehicle] = useState<Driver['vehicle']>('Moto Tricycle')
  const [newDriverZone, setNewDriverZone] = useState('Dakar & Banlieue')

  // Group sales per producer for Payout inventory
  const producerSalesSummary = producers.map((prod) => {
    const prodProducts = products.filter((p) => p.producerId === prod.id)
    const prodProdIds = prodProducts.map((p) => p.id)

    let totalSales = 0
    let ordersCount = 0

    orders.forEach((order) => {
      let orderHasProd = false
      order.lines.forEach((line) => {
        if (prodProdIds.includes(line.productId)) {
          const product = prodProducts.find((p) => p.id === line.productId)
          if (product) {
            totalSales += product.pricePerKg * line.quantityKg
            orderHasProd = true
          }
        }
      })
      if (orderHasProd) ordersCount++
    })

    const commission = totalSales * 0.1
    const netPayout = totalSales - commission

    return {
      producer: prod,
      totalSales,
      commission,
      netPayout,
      ordersCount,
    }
  })

  const handleCreateProducer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProdName || !newProdPhone) return

    onAddProducer({
      name: newProdName,
      cooperative: newProdCoop || 'Indépendant',
      location: newProdLoc,
      phone: newProdPhone,
      waveOrOmNumber: newProdPhone,
      subscriptionTier: newProdTier,
      isPremium: newProdTier !== 'Gratuit',
      pinned: newProdTier === 'Premium Pro',
    })

    setIsAddingProducer(false)
    setNewProdName('')
    setNewProdCoop('')
  }

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDriverName || !newDriverPhone) return

    onAddDriver({
      name: newDriverName,
      phone: newDriverPhone,
      vehicle: newDriverVehicle,
      zone: newDriverZone,
      status: 'Disponible',
    })

    setIsAddingDriver(false)
    setNewDriverName('')
  }

  const handleConfirmPayout = () => {
    if (!payoutModalProducer) return
    const methodPrefix =
      payoutMethod === 'Wave'
        ? 'WAVE'
        : payoutMethod === 'Orange Money'
        ? 'OM'
        : payoutMethod === 'Free Money'
        ? 'FREE'
        : 'BANK'
    const txId = `PAYOUT-${methodPrefix}-${Date.now().toString().slice(-6)}`
    setPayoutSuccessTx(txId)
    onPayoutProducer(
      payoutModalProducer.producer.id,
      payoutModalProducer.netPayout,
      payoutModalProducer.commission
    )

    setTimeout(() => {
      setPayoutSuccessTx(null)
      setPayoutModalProducer(null)
    }, 2500)
  }

  return (
    <main className="mx-auto min-h-[80vh] max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* TAB 1: EXPÉDITION & AFFECTATION LIVREUR */}
      {activeTab === 'logistics' && (
        <section className="mt-6 space-y-8">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">1. Dispatching & Suivi des Commandes</h2>
            <p className="text-xs text-slate-500">
              Gérez l'état d'avancement de chaque commande via le sélecteur et visualisez le livreur affecté.
            </p>
          </div>

          {/* Orders Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => {
              const assignedDriver = drivers.find((d) => d.id === order.driverId)
              const orderTotal =
                order.lines.reduce((sum, line) => {
                  const prod = products.find((p) => p.id === line.productId)
                  return sum + (prod?.pricePerKg ?? 0) * line.quantityKg
                }, 0) + order.deliveryFee

              const statusColorClass =
                order.status === 'Confirmée'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : order.status === 'En préparation'
                  ? 'border-amber-300 bg-amber-50 text-amber-900'
                  : order.status === 'En livraison'
                  ? 'border-purple-300 bg-purple-50 text-purple-900'
                  : 'border-emerald-400 bg-emerald-100 text-emerald-950'

              return (
                <article
                  key={order.id}
                  onClick={() => setSelectedOrderDetails(order)}
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-lg hover:border-brand-green/50 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-base text-slate-900 group-hover:text-brand-green transition">
                        Commande {order.id}
                      </span>

                      {/* STATUS SELECT DROPDOWN */}
                      <select
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation()
                          onUpdateOrderStatus(order.id, e.target.value as OrderStatus)
                        }}
                        className={`rounded-xl border py-1.5 px-2.5 text-xs font-extrabold focus:outline-none focus:ring-2 focus:ring-brand-green cursor-pointer shadow-sm transition ${statusColorClass}`}
                      >
                        <option value="Confirmée">Confirmée</option>
                        <option value="En préparation">En préparation</option>
                        <option value="En livraison">En livraison</option>
                        <option value="Livrée">Livrée</option>
                      </select>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Client : <strong className="text-slate-800">{order.customerName}</strong>
                    </p>

                    {/* Products breakdown */}
                    <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs space-y-1 border border-slate-100">
                      <span className="font-extrabold text-slate-700 block text-[11px] uppercase tracking-wider">
                        Contenu de la commande:
                      </span>
                      {order.lines.map((l) => {
                        const pr = products.find((item) => item.id === l.productId)
                        return (
                          <div key={l.productId} className="flex justify-between text-slate-600">
                            <span>{pr?.name ?? 'Produit'}</span>
                            <span className="font-bold">{l.quantityKg} kg</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Driver status section */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-500">Livreur :</span>
                        {assignedDriver ? (
                          <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <Truck size={13} className="text-emerald-700" /> {assignedDriver.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            <AlertCircle size={13} className="text-amber-600" /> Non affecté
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="font-extrabold text-sm text-slate-900 tabular-nums">
                      {formatFCFA(orderTotal)}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedOrderDetails(order)
                      }}
                      className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-brand-green transition flex items-center gap-1.5 shadow-sm"
                    >
                      <UserCheck size={14} />
                      <span>Fiche / Appels</span>
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          {/* DEDICATED DRIVERS MANAGEMENT TABLE WITH PAGINATION */}
          <div className="space-y-4 pt-8 border-t border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-900 text-emerald-400">
                    <Truck size={17} />
                  </span>
                  Flotte des Livreurs Partenaires ({drivers.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Gestion de la flotte avec numéros d'appel direct, véhicules et zones de couverture.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingDriver(true)}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-extrabold text-white hover:bg-slate-800 transition shadow-md flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Nouveau Livreur</span>
              </button>
            </div>

            {/* Container for Desktop Table & Mobile Cards */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 uppercase font-extrabold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3.5">Livreur & Contact</th>
                      <th className="px-4 py-3.5">Type de Véhicule</th>
                      <th className="px-4 py-3.5">Zone Couverte</th>
                      <th className="px-4 py-3.5">Statut Flotte</th>
                      <th className="px-4 py-3.5 text-center">Commandes en cours</th>
                      <th className="px-5 py-3.5 text-right">Appel Direct</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {paginatedDrivers.map((drv) => {
                      const activeOrders = orders.filter((o) => o.driverId === drv.id && o.status !== 'Livrée').length

                      return (
                        <tr key={drv.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-800 font-extrabold text-sm border border-slate-200">
                                {drv.name.charAt(0)}
                              </span>
                              <div>
                                <span className="font-extrabold text-sm text-slate-900 block">{drv.name}</span>
                                <span className="font-mono text-[11px] text-slate-500">{drv.phone}</span>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 font-bold text-slate-700">
                            {drv.vehicle}
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 text-slate-700 font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                              <MapPin size={12} className="text-emerald-700" /> {drv.zone}
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Disponible
                            </span>
                          </td>

                          <td className="px-4 py-3.5 text-center font-extrabold text-slate-900 text-sm">
                            {activeOrders}
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <a
                              href={`tel:${drv.phone}`}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-700 transition shadow-sm"
                            >
                              <PhoneCall size={13} />
                              <span>Appeler</span>
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
                {paginatedDrivers.map((drv) => {
                  const activeOrders = orders.filter((o) => o.driverId === drv.id && o.status !== 'Livrée').length

                  return (
                    <article key={drv.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-white font-extrabold text-sm">
                            {drv.name.charAt(0)}
                          </span>
                          <div>
                            <span className="font-extrabold text-sm text-slate-900 block">{drv.name}</span>
                            <span className="font-mono text-xs text-slate-500">{drv.phone}</span>
                          </div>
                        </div>

                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Disponible
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-slate-200/80">
                        <span className="font-bold text-slate-700">{drv.vehicle}</span>
                        <span className="inline-flex items-center gap-1 text-slate-700 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-[11px]">
                          <MapPin size={11} className="text-emerald-700" /> {drv.zone}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="text-xs text-slate-500">
                          Commandes en cours : <strong className="text-slate-900">{activeOrders}</strong>
                        </span>

                        <a
                          href={`tel:${drv.phone}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 transition shadow"
                        >
                          <PhoneCall size={14} />
                          <span>Appeler Direct</span>
                        </a>
                      </div>
                    </article>
                  )
                })}
              </div>

              {/* RESPONSIVE PAGINATION FOOTER */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-5">
                <span className="text-xs text-slate-500 font-medium text-center sm:text-left">
                  Affichage de <strong className="text-slate-900">{Math.min(drivers.length, (driverPage - 1) * DRIVERS_PER_PAGE + 1)}</strong> à{' '}
                  <strong className="text-slate-900">{Math.min(drivers.length, driverPage * DRIVERS_PER_PAGE)}</strong> sur{' '}
                  <strong className="text-slate-900">{drivers.length}</strong> livreurs
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={driverPage <= 1}
                    onClick={() => setDriverPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
                  >
                    <ChevronLeft size={14} />
                    <span>Précédent</span>
                  </button>

                  <span className="text-xs font-extrabold text-slate-800 px-2">
                    {driverPage} / {totalDriverPages}
                  </span>

                  <button
                    type="button"
                    disabled={driverPage >= totalDriverPages}
                    onClick={() => setDriverPage((p) => Math.min(totalDriverPages, p + 1))}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-extrabold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition"
                  >
                    <span>Suivant</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 2: INVENTAIRE & TRANSFERT DES COMMISSIONS */}
      {activeTab === 'inventory' && (
        <section className="mt-8 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Inventaire Quotidien & Transfert des Commissions
            </h2>
            <p className="text-xs text-slate-500">
              Calcul automatique de la répartition (90% producteur / 10% commission AgriConnect) et transfert vers leur compte Mobile Money.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 uppercase font-extrabold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Producteur & Exploitation</th>
                    <th className="px-4 py-3.5">Ventes Totales (Brut)</th>
                    <th className="px-4 py-3.5 text-emerald-700">Commission AgriConnect (10%)</th>
                    <th className="px-4 py-3.5 text-slate-900">Net à Verser (90%)</th>
                    <th className="px-4 py-3.5">Compte Payout Tél</th>
                    <th className="px-5 py-3.5 text-right">Action Transfert</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {producerSalesSummary.map((item) => (
                    <tr key={item.producer.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-green/10 text-brand-green font-extrabold">
                            <Building2 size={18} />
                          </span>
                          <div>
                            <span className="font-extrabold text-sm text-slate-900 block">
                              {item.producer.name}
                            </span>
                            <span className="text-[11px] text-slate-500">{item.producer.cooperative} · {item.producer.location}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-extrabold text-slate-900 tabular-nums text-sm">
                        {formatFCFA(item.totalSales)}
                      </td>

                      <td className="px-4 py-4 font-extrabold text-emerald-600 tabular-nums">
                        {formatFCFA(item.commission)}
                      </td>

                      <td className="px-4 py-4 font-extrabold text-brand-green tabular-nums text-sm">
                        {formatFCFA(item.netPayout)}
                      </td>

                      <td className="px-4 py-4 font-mono font-bold text-slate-700">
                        {item.producer.waveOrOmNumber || item.producer.phone}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={item.netPayout <= 0}
                          onClick={() => {
                            setPayoutModalProducer({
                              producer: item.producer,
                              totalSales: item.totalSales,
                              netPayout: item.netPayout,
                              commission: item.commission,
                              ordersCount: item.ordersCount,
                            })
                            setPayoutMethod('Wave')
                            setPayoutPhoneInput(item.producer.waveOrOmNumber || item.producer.phone)
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-accent-orange px-3.5 py-2 text-xs font-extrabold text-ink hover:brightness-95 disabled:bg-slate-100 disabled:text-slate-400 transition shadow-sm"
                        >
                          <Send size={14} />
                          <span>Verser 90% (Sélection Moyen)</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: GESTION PRODUCTEURS & ABONNEMENTS PREMIUM */}
      {activeTab === 'producers' && (
        <section className="mt-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Gestion des Producteurs & Abonnements Premium
              </h2>
              <p className="text-xs text-slate-500">
                Attribuez le statut Premium aux producteurs pour épingler leurs produits en tête du catalogue.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingProducer(true)}
              className="rounded-xl bg-brand-green px-4 py-2.5 text-xs font-extrabold text-white hover:bg-green-deep transition shadow-md flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Nouveau Producteur</span>
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {producers.map((producer) => {
              const producerProducts = products.filter((p) => p.producerId === producer.id)

              return (
                <article
                  key={producer.id}
                  className={`rounded-2xl border p-5 shadow-sm transition relative overflow-hidden bg-white ${
                    producer.isPremium ? 'border-brand-green/40 ring-2 ring-brand-green/10' : 'border-slate-200'
                  }`}
                >
                  {producer.pinned && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-extrabold text-amber-800 border border-amber-300 shadow-sm">
                      <Pin size={12} className="rotate-45 text-amber-700" />
                      <span>Épinglé Catalogue</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-green/10 text-brand-green font-extrabold text-lg">
                      {producer.name.charAt(0)}
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{producer.name}</h3>
                      <p className="text-xs text-slate-500">{producer.cooperative}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Localisation:</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <MapPin size={13} className="text-brand-green" /> {producer.location}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Téléphone:</span>
                      <a href={`tel:${producer.phone}`} className="font-mono font-bold text-sky-700 hover:underline flex items-center gap-1">
                        <Phone size={12} /> {producer.phone}
                      </a>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-400">Produits au catalogue:</span>
                      <span className="font-extrabold text-slate-900">{producerProducts.length} produits</span>
                    </div>
                  </div>

                  {/* Subscription Controls */}
                  <div className="mt-5 pt-3 border-t border-slate-100 space-y-2">
                    <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Statut d'abonnement :
                    </label>

                    <div className="flex gap-2">
                      <select
                        value={producer.subscriptionTier || 'Gratuit'}
                        onChange={(e) => {
                          const tier = e.target.value as SubscriptionTier
                          onUpdateProducerSubscription(producer.id, tier, tier === 'Premium Pro')
                        }}
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-brand-green"
                      >
                        <option value="Gratuit">Gratuit (Standard)</option>
                        <option value="Premium Standard">⭐ Premium Standard</option>
                        <option value="Premium Pro">🌟 Premium Pro (Épinglé)</option>
                      </select>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* DETAILED ORDER DISPATCH MODAL WITH CALL BUTTONS & STATUS SELECT */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-green">Fiche de Commande</span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedOrderDetails.id}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* ORDER STATUS SELECTOR IN MODAL */}
            <div className="flex items-center justify-between rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200">
              <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                Changer le Statut :
              </span>
              <select
                value={selectedOrderDetails.status}
                onChange={(e) => {
                  const newStatus = e.target.value as OrderStatus
                  onUpdateOrderStatus(selectedOrderDetails.id, newStatus)
                  setSelectedOrderDetails({
                    ...selectedOrderDetails,
                    status: newStatus,
                  })
                }}
                className="rounded-xl border border-emerald-300 bg-white py-2 px-3 text-xs font-extrabold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-brand-green shadow-sm cursor-pointer"
              >
                <option value="Confirmée">Confirmée</option>
                <option value="En préparation">En préparation</option>
                <option value="En livraison">En livraison</option>
                <option value="Livrée">Livrée</option>
              </select>
            </div>

            {/* Client info with CALL button */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Information Client
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-sm text-slate-900">{selectedOrderDetails.customerName}</p>
                  <p className="text-xs text-slate-500 font-mono">{selectedOrderDetails.customerPhone}</p>
                </div>

                <a
                  href={`tel:${selectedOrderDetails.customerPhone}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 transition shadow"
                >
                  <PhoneCall size={14} />
                  <span>Appeler Client</span>
                </a>
              </div>
            </div>

            {/* Driver section with ASSIGNMENT & DIRECT CALL BUTTON */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 block">
                Affectation & Appel Livreur
              </span>

              {selectedOrderDetails.driverId ? (
                <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-800 font-extrabold shrink-0">
                      <Truck size={20} />
                    </span>
                    <div>
                      <p className="font-extrabold text-sm text-slate-900">{selectedOrderDetails.driverName}</p>
                      <p className="text-xs font-mono text-slate-500">{selectedOrderDetails.driverPhone}</p>
                    </div>
                  </div>

                  <a
                    href={`tel:${selectedOrderDetails.driverPhone}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-extrabold text-white hover:bg-slate-800 transition shadow"
                  >
                    <PhoneCall size={14} />
                    <span>Appeler Livreur</span>
                  </a>
                </div>
              ) : (
                <p className="text-xs text-amber-800 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  Aucun livreur n'est attribué à cette commande pour le moment.
                </p>
              )}

              {/* Assign selector */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Choisir un livreur disponible :
                </label>
                <div className="space-y-2">
                  {drivers.map((drv) => (
                    <div
                      key={drv.id}
                      className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200 text-xs shadow-sm"
                    >
                      <div>
                        <span className="font-extrabold text-slate-900 block">{drv.name}</span>
                        <span className="text-[10px] text-slate-500">{drv.vehicle} · {drv.zone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${drv.phone}`}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                          title={`Appeler ${drv.name}`}
                        >
                          <Phone size={14} />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            onAssignDriver(selectedOrderDetails.id, drv)
                            setSelectedOrderDetails({
                              ...selectedOrderDetails,
                              driverId: drv.id,
                              driverName: drv.name,
                              driverPhone: drv.phone,
                            })
                          }}
                          className="rounded-lg bg-brand-green px-3 py-1.5 text-xs font-extrabold text-white hover:bg-green-deep shadow-sm"
                        >
                          Affecter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Products inside order */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Articles à livrer
              </span>
              <div className="divide-y divide-slate-100 border-y border-slate-100 py-1">
                {selectedOrderDetails.lines.map((line) => {
                  const pr = products.find((p) => p.id === line.productId)
                  return (
                    <div key={line.productId} className="flex justify-between py-2 text-xs font-bold text-slate-800">
                      <span>{pr?.name}</span>
                      <span className="tabular-nums">{line.quantityKg} kg</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW DRIVER MODAL */}
      {isAddingDriver && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-800 font-extrabold">
                  <Truck size={18} />
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">Ajouter un Nouveau Livreur</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingDriver(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateDriver} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Nom du Livreur
                </label>
                <input
                  type="text"
                  required
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  placeholder="Ex: Demba Sow"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Téléphone Direct (Appel)
                </label>
                <input
                  type="tel"
                  required
                  value={newDriverPhone}
                  onChange={(e) => setNewDriverPhone(e.target.value)}
                  placeholder="+221 77 123 45 67"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Véhicule
                  </label>
                  <select
                    value={newDriverVehicle}
                    onChange={(e) => setNewDriverVehicle(e.target.value as Driver['vehicle'])}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-green"
                  >
                    <option value="Moto Tricycle">Moto Tricycle</option>
                    <option value="Camionnette Frigorifique">Camionnette Frigorifique</option>
                    <option value="Scooter Express">Scooter Express</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Zone Couverte
                  </label>
                  <input
                    type="text"
                    value={newDriverZone}
                    onChange={(e) => setNewDriverZone(e.target.value)}
                    placeholder="Dakar & Banlieue"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-extrabold text-white shadow-md hover:bg-slate-800 transition"
              >
                Enregistrer le livreur
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PAYOUT PRODUCER MODAL WITH METHOD SELECTOR */}
      {payoutModalProducer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {!payoutSuccessTx ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold">
                      <Wallet size={20} />
                    </span>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        Transfert des Revenus (90%)
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Destinataire : <strong className="text-slate-900">{payoutModalProducer.producer.name}</strong></p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPayoutModalProducer(null)}
                    className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Calculation Summary */}
                <div className="rounded-2xl bg-slate-50 p-4 space-y-2 text-xs border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ventes brutes totales :</span>
                    <span className="font-bold text-slate-900 tabular-nums">{formatFCFA(payoutModalProducer.totalSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Commission AgriConnect (10%) :</span>
                    <span className="font-bold text-amber-700 tabular-nums">-{formatFCFA(payoutModalProducer.commission)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold">
                    <span className="text-slate-900">Montant Net à verser (90%) :</span>
                    <span className="text-brand-green font-mono">{formatFCFA(payoutModalProducer.netPayout)}</span>
                  </div>
                </div>

                {/* SELECT PAYMENT METHOD SECTION */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                    Sélectionnez le moyen de versement :
                  </label>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Wave */}
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('Wave')}
                      className={`flex flex-col p-3 rounded-2xl border text-left transition relative ${
                        payoutMethod === 'Wave'
                          ? 'border-[#1dc3f5] bg-sky-50/80 ring-2 ring-[#1dc3f5]/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-sky-950 flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#1dc3f5]" /> Wave Sénégal
                        </span>
                        {payoutMethod === 'Wave' && (
                          <CheckCircle2 size={16} className="text-[#1dc3f5]" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 font-medium">Transfert instantané (0% frais)</span>
                    </button>

                    {/* Orange Money */}
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('Orange Money')}
                      className={`flex flex-col p-3 rounded-2xl border text-left transition relative ${
                        payoutMethod === 'Orange Money'
                          ? 'border-orange-500 bg-orange-50/80 ring-2 ring-orange-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-orange-950 flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Orange Money
                        </span>
                        {payoutMethod === 'Orange Money' && (
                          <CheckCircle2 size={16} className="text-orange-600" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 font-medium">Portefeuille Mobile #144#</span>
                    </button>

                    {/* Free Money */}
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('Free Money')}
                      className={`flex flex-col p-3 rounded-2xl border text-left transition relative ${
                        payoutMethod === 'Free Money'
                          ? 'border-red-500 bg-red-50/80 ring-2 ring-red-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-red-950 flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Free Money
                        </span>
                        {payoutMethod === 'Free Money' && (
                          <CheckCircle2 size={16} className="text-red-600" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 font-medium">Transfert USSD #150#</span>
                    </button>

                    {/* Virement Bancaire */}
                    <button
                      type="button"
                      onClick={() => setPayoutMethod('Virement Bancaire')}
                      className={`flex flex-col p-3 rounded-2xl border text-left transition relative ${
                        payoutMethod === 'Virement Bancaire'
                          ? 'border-slate-800 bg-slate-100 ring-2 ring-slate-800/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-slate-800" /> Bank / RIB
                        </span>
                        {payoutMethod === 'Virement Bancaire' && (
                          <CheckCircle2 size={16} className="text-slate-800" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1 font-medium">Virement pro 24/48h</span>
                    </button>
                  </div>
                </div>

                {/* Recipient Phone / Account Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                    {payoutMethod === 'Virement Bancaire' ? 'IBAN / RIB Destinataire' : `Numéro ${payoutMethod} Destinataire`}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={payoutPhoneInput}
                      onChange={(e) => setPayoutPhoneInput(e.target.value)}
                      placeholder="+221 77 000 00 00"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 pr-10 text-sm font-bold font-mono text-slate-900 focus:outline-none focus:border-brand-green"
                    />
                    <Smartphone size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={handleConfirmPayout}
                  className="w-full rounded-2xl bg-brand-green py-3.5 text-sm font-extrabold text-white shadow-lg hover:bg-green-deep transition flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  <span>Confirmer le versement {payoutMethod} ({formatFCFA(payoutModalProducer.netPayout)})</span>
                </button>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                  <CheckCircle2 size={38} />
                </div>
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">Transfert Effectué avec Succès !</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Le versement de <strong className="text-emerald-700">{formatFCFA(payoutModalProducer.netPayout)}</strong> a été envoyé à <strong>{payoutModalProducer.producer.name}</strong>.
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 space-y-1.5 text-left text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Canal utilisé :</span>
                    <span className="font-bold text-emerald-900 font-sans">{payoutMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Compte destinataire :</span>
                    <span className="font-bold text-slate-800">{payoutPhoneInput}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-sans">Référence transaction :</span>
                    <span className="font-bold text-emerald-700">{payoutSuccessTx}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD PRODUCER MODAL */}
      {isAddingProducer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Ajouter un Producteur Local</h3>
              <button
                type="button"
                onClick={() => setIsAddingProducer(false)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProducer} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Nom du Producteur
                </label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex: Babacar Seck"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Coopérative ou Exploitation
                </label>
                <input
                  type="text"
                  value={newProdCoop}
                  onChange={(e) => setNewProdCoop(e.target.value)}
                  placeholder="Ex: Vergers de Sebikotane"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Zone / Localité
                  </label>
                  <select
                    value={newProdLoc}
                    onChange={(e) => setNewProdLoc(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-green"
                  >
                    <option value="Rufisque">Rufisque</option>
                    <option value="Sangalkam">Sangalkam</option>
                    <option value="Thiès">Thiès</option>
                    <option value="Lac Rose">Lac Rose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Téléphone Payout
                  </label>
                  <input
                    type="tel"
                    required
                    value={newProdPhone}
                    onChange={(e) => setNewProdPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Offre d'Abonnement Initial
                </label>
                <select
                  value={newProdTier}
                  onChange={(e) => setNewProdTier(e.target.value as SubscriptionTier)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-green"
                >
                  <option value="Gratuit">Gratuit</option>
                  <option value="Premium Standard">⭐ Premium Standard</option>
                  <option value="Premium Pro">🌟 Premium Pro (Épinglé)</option>
                </select>
              </div>

              <button
                type="submit"
                className="mt-4 w-full rounded-xl bg-brand-green py-3 text-sm font-extrabold text-white shadow-md hover:bg-green-deep transition"
              >
                Enregistrer le producteur
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
