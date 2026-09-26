import { useState, type FormEvent } from 'react'
import { Check, ImagePlus, Minus, PackagePlus, Pencil, Plus, X } from 'lucide-react'
import type { Product, ProductCategory } from '../../types'
import { formatFCFA, formatKg } from '../../lib/format'

interface ProducerProductsPageProps {
  products: Product[]
  onSave: (product: Omit<Product, 'id' | 'traceability' | 'featured'>, id?: string) => void
}

const emptyForm = { name: '', category: 'Fruits' as ProductCategory, price: '', stock: '', imageUrl: '', description: '' }
const categories: ProductCategory[] = ['Fruits', 'Légumes', 'Céréales', 'Volaille']

export function ProducerProductsPage({ products, onSave }: ProducerProductsPageProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | undefined>()
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const openForm = (product?: Product) => {
    setEditingId(product?.id)
    setForm(product ? { name: product.name, category: product.category, price: String(product.pricePerKg), stock: String(product.stockKg), imageUrl: product.imageUrl, description: product.description } : emptyForm)
    setError('')
    setShowForm(true)
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!form.name.trim() || !form.imageUrl.trim() || !Number.isFinite(price) || price <= 0 || !Number.isFinite(stock) || stock < 0) {
      setError('Vérifiez le nom, la photo, le prix et le stock du produit.')
      return
    }
    onSave({ name: form.name.trim(), category: form.category, pricePerKg: price, stockKg: stock, imageUrl: form.imageUrl.trim(), imageAlt: `Photo de ${form.name.trim()} ajoutée par le producteur pour la démo`, producerId: 'p-1', description: form.description.trim() || `${form.name.trim()} proposé en direct par notre exploitation.`, }, editingId)
    setShowForm(false)
    setEditingId(undefined)
    setForm(emptyForm)
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Votre étal en ligne</p><h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Gestion des produits</h1><p className="mt-1 text-sm text-muted">Mettez à jour vos récoltes et vos disponibilités.</p></div><button type="button" onClick={() => openForm()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-extrabold text-white hover:bg-green-deep"><PackagePlus size={17}/> Ajouter un produit</button></div>
      {showForm && <div className="fixed inset-0 z-50 grid items-end bg-ink/40 sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowForm(false) }}><section role="dialog" aria-modal="true" aria-labelledby="product-form-title" className="mx-auto max-h-[min(92dvh,48rem)] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-surface p-4 shadow-float sm:rounded-3xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-wide text-brand-green">Mon catalogue</p><h2 id="product-form-title" className="mt-1 text-2xl font-extrabold">{editingId ? 'Modifier le produit' : 'Nouvelle récolte'}</h2></div><button type="button" onClick={() => setShowForm(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-page text-muted hover:text-ink sm:h-9 sm:w-9" aria-label="Fermer"><X size={19}/></button></div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block text-sm font-bold">Nom du produit <span className="text-orange-700">*</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex. Mangues Kent" className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium outline-none focus:border-brand-green" /></label>
          <label className="block text-sm font-bold">Photo du produit · URL <span className="text-orange-700">*</span><span className="relative mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-3"><ImagePlus size={16} className="shrink-0 text-muted"/><input required type="url" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} placeholder="https://…" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none" /></span></label>
          {form.imageUrl && <img src={form.imageUrl} alt="Aperçu du produit" width={420} height={200} className="h-28 w-full rounded-xl object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} />}
          <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm font-bold">Prix par kg (FCFA) <span className="text-orange-700">*</span><input required type="number" min="1" step="50" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="1200" className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium outline-none focus:border-brand-green" /></label><label className="block text-sm font-bold">Quantité disponible (kg) <span className="text-orange-700">*</span><input required type="number" min="0" step="1" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} placeholder="25" className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium outline-none focus:border-brand-green" /></label></div>
          <label className="block text-sm font-bold">Catégorie<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ProductCategory })} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium outline-none focus:border-brand-green">{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="block text-sm font-bold">Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={3} placeholder="D'où vient ce produit ? Qu'est-ce qui le rend spécial ?" className="mt-1.5 w-full resize-y rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium outline-none focus:border-brand-green" /></label>
          {error && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}
          <div className="flex gap-3 pt-1"><button type="button" onClick={() => setShowForm(false)} className="h-11 flex-1 rounded-xl border border-line font-bold text-muted hover:bg-page">Annuler</button><button type="submit" className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-green font-extrabold text-white hover:bg-green-deep"><Check size={16}/> {editingId ? 'Enregistrer' : 'Ajouter au catalogue'}</button></div>
        </form>
      </section></div>}
      <section className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface"><div className="hidden grid-cols-[minmax(0,1.5fr)_1fr_1fr_1fr_auto] gap-4 border-b border-line bg-page px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-muted md:grid"><span>Produit</span><span>Catégorie</span><span>Prix / kg</span><span>Stock</span><span>Actions</span></div>
        {products.map((product) => <article key={product.id} className="grid gap-3 border-b border-line p-4 last:border-0 md:grid-cols-[minmax(0,1.5fr)_1fr_1fr_1fr_auto] md:items-center md:gap-4 md:px-5"><div className="flex min-w-0 items-center gap-3"><img src={product.imageUrl} alt={product.imageAlt} width={64} height={64} className="h-14 w-14 shrink-0 rounded-xl object-cover"/><div className="min-w-0"><h2 className="truncate text-sm font-extrabold">{product.name}</h2><p className="mt-0.5 text-xs text-muted md:hidden">{product.category} · {formatFCFA(product.pricePerKg)} / kg</p></div></div><span className="hidden text-sm font-semibold text-muted md:block">{product.category}</span><span className="hidden text-sm font-extrabold tabular-nums md:block">{formatFCFA(product.pricePerKg)}</span><div className="flex min-w-0 items-center justify-between gap-2"><span className={`text-sm font-extrabold ${product.stockKg <= 0 ? 'text-orange-ink' : 'text-brand-green'}`}>{product.stockKg > 0 ? formatKg(product.stockKg) : 'Rupture'}</span><div className="flex shrink-0 items-center gap-1.5"><button type="button" disabled={product.stockKg <= 0} onClick={() => onSave({ ...product, stockKg: Math.max(0, product.stockKg - 1) }, product.id)} className="grid h-11 w-11 place-items-center rounded-lg border border-line text-muted hover:bg-page disabled:opacity-40 sm:h-8 sm:w-8" aria-label={`Baisser le stock de ${product.name}`}><Minus size={14}/></button><button type="button" onClick={() => onSave({ ...product, stockKg: product.stockKg + 1 }, product.id)} className="grid h-11 w-11 place-items-center rounded-lg border border-line text-muted hover:bg-page sm:h-8 sm:w-8" aria-label={`Augmenter le stock de ${product.name}`}><Plus size={14}/></button><button type="button" onClick={() => openForm(product)} className="grid h-11 w-11 place-items-center rounded-lg text-muted hover:bg-green-soft hover:text-brand-green sm:h-8 sm:w-8" aria-label={`Modifier ${product.name}`}><Pencil size={15}/></button></div></div></article>)}
      </section>
      <p className="mt-3 text-xs text-muted">Les stocks et modifications sont conservés en mémoire pendant cette démonstration.</p>
    </main>
  )
}
