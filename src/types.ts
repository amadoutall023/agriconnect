export type UserRole = 'consumer' | 'producer' | 'superadmin'
export type ConsumerScreen = 'home' | 'catalog' | 'detail' | 'cart' | 'checkout' | 'tracking'
export type ProducerScreen = 'dashboard' | 'products' | 'orders' | 'profile'
export type SuperAdminScreen = 'logistics' | 'inventory' | 'producers'
export type ProductCategory = 'Fruits' | 'Légumes' | 'Céréales' | 'Volaille'
export type PaymentMethod = 'Orange Money' | 'Wave' | 'Free Money' | 'Carte bancaire'
export type DeliveryMethod = 'Domicile' | 'Point relais'
export type OrderStatus = 'Confirmée' | 'En préparation' | 'En livraison' | 'Livrée'
export type Language = 'Français' | 'Wolof' | 'Pulaar' | 'Sérère'
export type SubscriptionTier = 'Gratuit' | 'Premium Standard' | 'Premium Pro'

export interface Producer {
  id: string
  name: string
  cooperative: string
  location: string
  phone: string
  waveOrOmNumber?: string
  isPremium?: boolean
  subscriptionTier?: SubscriptionTier
  pinned?: boolean
}

export interface Driver {
  id: string
  name: string
  phone: string
  vehicle: 'Moto Tricycle' | 'Camionnette Frigorifique' | 'Scooter Express'
  zone: string
  status: 'Disponible' | 'En livraison' | 'Hors ligne'
  activeOrderCount: number
}

export interface TraceabilityEvent {
  id: string
  label: string
  location: string
  date: string
  description: string
}

export interface Product {
  id: string
  name: string
  category: ProductCategory
  pricePerKg: number
  stockKg: number
  imageUrl: string
  imageAlt: string
  producerId: string
  description: string
  featured: boolean
  traceability: TraceabilityEvent[]
}

export interface OrderLine {
  productId: string
  quantityKg: number
}

export type CartLine = OrderLine

export interface Order {
  id: string
  lines: OrderLine[]
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus?: 'Payé' | 'En attente' | 'Échoué'
  paymentPhone?: string
  paymentTransactionId?: string
  paymentTimestamp?: string
  deliveryMethod: DeliveryMethod
  deliveryFee: number
  createdAt: string
  customerName: string
  customerPhone: string
  driverId?: string
  driverName?: string
  driverPhone?: string
  payoutStatus?: 'Non payé' | 'Payé'
  payoutTransactionId?: string
  payoutTimestamp?: string
  payoutAmountFCFA?: number
  commissionAmountFCFA?: number
}

export interface SalesPoint {
  date: string
  amountFCFA: number
}

export interface ChatMessage {
  id: string
  sender: 'visitor' | 'assistant'
  text: string
  createdAt: string
}
