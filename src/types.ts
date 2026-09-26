export type UserRole = 'consumer' | 'producer'
export type ConsumerScreen = 'home' | 'catalog' | 'detail' | 'cart' | 'checkout' | 'tracking'
export type ProducerScreen = 'dashboard' | 'products' | 'orders' | 'profile'
export type ProductCategory = 'Fruits' | 'Légumes' | 'Céréales' | 'Volaille'
export type PaymentMethod = 'Orange Money' | 'Wave' | 'Free Money' | 'Carte bancaire'
export type DeliveryMethod = 'Domicile' | 'Point relais'
export type OrderStatus = 'Confirmée' | 'En préparation' | 'En livraison' | 'Livrée'
export type Language = 'Français' | 'Wolof' | 'Pulaar' | 'Sérère'

export interface Producer {
  id: string
  name: string
  cooperative: string
  location: string
  phone: string
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
  deliveryMethod: DeliveryMethod
  deliveryFee: number
  createdAt: string
  customerName: string
  customerPhone: string
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
