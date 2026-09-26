import type { Order, Product, Producer, SalesPoint } from '../types'

export const producers: Producer[] = [
  { id: 'p-1', name: 'Mamadou Diallo', cooperative: 'Coopérative des Niayes', location: 'Rufisque', phone: '+221 77 512 08 34' },
  { id: 'p-2', name: 'Fatou Sarr', cooperative: 'Jardins de Sangalkam', location: 'Sangalkam', phone: '+221 76 204 91 15' },
  { id: 'p-3', name: 'Ibrahima Fall', cooperative: 'Union des céréaliers du Cayor', location: 'Thiès', phone: '+221 78 405 33 29' },
  { id: 'p-4', name: 'Awa Diop', cooperative: 'Ferme des Almadies', location: 'Lac Rose', phone: '+221 70 800 43 18' },
]

const harvestTrace = [
  { id: 't1', label: 'Récolte', location: 'Ferme familiale', date: '18 septembre', description: 'Récolté à maturité à l’aube, puis trié à la main.' },
  { id: 't2', label: 'Collecte coopérative', location: 'Coopérative des Niayes', date: '18 septembre', description: 'Vérification de la qualité et pesée par la coopérative.' },
  { id: 't3', label: 'Préparation de la commande', location: 'Point de collecte de Rufisque', date: '19 septembre', description: 'Préparé localement pour une livraison vers Dakar.' },
]

export const initialProducts: Product[] = [
  { id: 'mangue', name: 'Mangues Kent', category: 'Fruits', pricePerKg: 1200, stockKg: 46, imageUrl: 'https://images.pexels.com/photos/12695482/pexels-photo-12695482.jpeg?auto=compress&cs=tinysrgb&w=900', imageAlt: 'Mangues fraîches de récolte — photo de Mouni Melouni sur Pexels', producerId: 'p-1', description: 'Des mangues Kent cueillies à maturité dans les Niayes. Chair généreuse, parfum naturellement sucré. Vendues en lots de 1 kg.', featured: true, traceability: harvestTrace },
  { id: 'tomate', name: 'Tomates du jardin', category: 'Légumes', pricePerKg: 850, stockKg: 28, imageUrl: 'https://images.pexels.com/photos/7511834/pexels-photo-7511834.jpeg?auto=compress&cs=tinysrgb&w=900', imageAlt: 'Tomates et feuillage fraîchement récoltés — photo de Polina sur Pexels', producerId: 'p-2', description: 'Tomates rondes récoltées le matin à Sangalkam. Une production familiale cultivée en plein champ.', featured: true, traceability: harvestTrace },
  { id: 'oignon', name: 'Oignons violets', category: 'Légumes', pricePerKg: 950, stockKg: 0, imageUrl: 'https://images.pexels.com/photos/6653875/pexels-photo-6653875.jpeg?auto=compress&cs=tinysrgb&w=900', imageAlt: 'Légumes frais du potager — photo d’Arina Krasnikova sur Pexels', producerId: 'p-1', description: 'Oignons violets de conservation, cultivés dans les Niayes sans stockage prolongé.', featured: false, traceability: harvestTrace },
  { id: 'mil', name: 'Mil entier', category: 'Céréales', pricePerKg: 700, stockKg: 82, imageUrl: 'https://images.pexels.com/photos/11519186/pexels-photo-11519186.jpeg?auto=compress&cs=tinysrgb&w=900', imageAlt: 'Mil récolté et séché au champ — photo de nnitatong sur Pexels', producerId: 'p-3', description: 'Mil entier sélectionné et séché naturellement dans la région de Thiès. Idéal pour le thiakry et le couscous.', featured: true, traceability: harvestTrace },
  { id: 'banane', name: 'Bananes douces', category: 'Fruits', pricePerKg: 1050, stockKg: 24, imageUrl: 'https://images.pexels.com/photos/36589448/pexels-photo-36589448.jpeg?auto=compress&cs=tinysrgb&w=900', imageAlt: 'Bananes et fruits encore sur leur arbre — photo de silas tarus sur Pexels', producerId: 'p-1', description: 'Bananes doucement mûries au soleil, cueillies à la demande dans une exploitation familiale.', featured: false, traceability: harvestTrace },
  { id: 'carotte', name: 'Carottes des Niayes', category: 'Légumes', pricePerKg: 900, stockKg: 35, imageUrl: 'https://images.pexels.com/photos/5444636/pexels-photo-5444636.jpeg?auto=compress&cs=tinysrgb&w=900', imageAlt: 'Assortiment de légumes de saison — photo d’olia danilevich sur Pexels', producerId: 'p-2', description: 'Carottes fraîches à la peau fine, récoltées en petite série et livrées sans longue conservation.', featured: true, traceability: harvestTrace },
  { id: 'oeufs', name: 'Œufs plein air', category: 'Volaille', pricePerKg: 2200, stockKg: 18, imageUrl: 'https://images.pexels.com/photos/6294148/pexels-photo-6294148.jpeg?auto=compress&cs=tinysrgb&w=900', imageAlt: 'Œufs fermiers fraîchement collectés — photo de Klaus Nielsen sur Pexels', producerId: 'p-4', description: 'Œufs ramassés chaque matin à la Ferme des Almadies et conditionnés avec soin.', featured: false, traceability: harvestTrace },
  { id: 'papaye', name: 'Papayes mûres', category: 'Fruits', pricePerKg: 1400, stockKg: 16, imageUrl: 'https://images.pexels.com/photos/12194258/pexels-photo-12194258.jpeg?auto=compress&cs=tinysrgb&w=900', imageAlt: 'Récolte de fruits tropicaux colorés — photo d’Engin Akyurt sur Pexels', producerId: 'p-1', description: 'Papayes de saison récoltées mûres, à savourer nature ou au petit-déjeuner.', featured: true, traceability: harvestTrace },
]

export const initialOrders: Order[] = [
  { id: 'AC-2481', lines: [{ productId: 'mangue', quantityKg: 3 }, { productId: 'banane', quantityKg: 2 }], status: 'Confirmée', paymentMethod: 'Wave', deliveryMethod: 'Domicile', deliveryFee: 1200, createdAt: '19 sept.', customerName: 'Ndeye Fall', customerPhone: '+221 77 655 12 28' },
  { id: 'AC-2476', lines: [{ productId: 'papaye', quantityKg: 5 }], status: 'En préparation', paymentMethod: 'Orange Money', deliveryMethod: 'Point relais', deliveryFee: 700, createdAt: '18 sept.', customerName: 'Alioune Cissé', customerPhone: '+221 76 340 57 20' },
]

export const salesHistory: SalesPoint[] = [
  { date: '13 sept.', amountFCFA: 28000 },
  { date: '14 sept.', amountFCFA: 38000 },
  { date: '15 sept.', amountFCFA: 32000 },
  { date: '16 sept.', amountFCFA: 52000 },
  { date: '17 sept.', amountFCFA: 42000 },
  { date: '18 sept.', amountFCFA: 68000 },
  { date: '19 sept.', amountFCFA: 59000 },
]

export const categories = ['Tous', 'Fruits', 'Légumes', 'Céréales', 'Volaille'] as const
export const locations = ['Toutes les zones', 'Rufisque', 'Sangalkam', 'Thiès', 'Lac Rose'] as const
