export const formatFCFA = (amount: number) => `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`
export const formatKg = (quantity: number) => `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(quantity)} kg`
export const formatShortDate = (date: Date) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date)
