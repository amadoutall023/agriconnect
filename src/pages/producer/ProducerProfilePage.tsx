import { useState, type FormEvent } from 'react'
import { BadgeCheck, MapPin, Save, Store, UserRound } from 'lucide-react'
import type { Producer } from '../../types'

interface ProducerProfilePageProps {
  producer: Producer
  onSave: (producer: Producer) => void
}

export function ProducerProfilePage({ producer, onSave }: ProducerProfilePageProps) {
  const [form, setForm] = useState(producer)
  const [saved, setSaved] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave({ ...form, name: form.name.trim(), cooperative: form.cooperative.trim(), location: form.location.trim(), phone: form.phone.trim() })
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2400)
  }

  return (
    <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <p className="text-xs font-extrabold uppercase tracking-[.13em] text-brand-green">Votre identité</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Profil producteur</h1>
      <p className="mt-2 text-sm text-muted">Aidez les consommateurs à découvrir votre exploitation et sa région.</p>
      <form onSubmit={submit} className="mt-6 rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <div className="flex items-center gap-3 border-b border-line pb-5"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-green-soft text-brand-green"><Store size={22}/></span><div><p className="font-extrabold">{form.cooperative || 'Votre coopérative'}</p><p className="text-xs text-muted">Profil de démonstration</p></div><span className="ml-auto inline-flex items-center gap-1 rounded-full bg-blue-soft px-2.5 py-1 text-xs font-bold text-trust-blue"><BadgeCheck size={14}/> Profil actif</span></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold">Nom du producteur<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Votre nom" className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium outline-none focus:border-brand-green"/></label>
          <label className="text-sm font-bold">Coopérative ou exploitation<input required value={form.cooperative} onChange={(event) => setForm({ ...form, cooperative: event.target.value })} placeholder="Nom de la coopérative" className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium outline-none focus:border-brand-green"/></label>
          <label className="text-sm font-bold">Localité <span className="sr-only">du producteur</span><span className="relative mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-3"><MapPin size={16} className="text-muted"/><input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Rufisque" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"/></span></label>
          <label className="text-sm font-bold">Téléphone <span className="sr-only">de contact</span><span className="relative mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-line bg-white px-3"><UserRound size={16} className="text-muted"/><input required type="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+221 77 000 00 00" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"/></span></label>
        </div>
        {saved && <p role="status" className="mt-4 rounded-xl bg-green-soft px-3 py-2 text-sm font-semibold text-green-deep">Profil mis à jour pour cette session.</p>}
        <div className="mt-5 flex justify-end"><button type="submit" className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-extrabold text-white hover:bg-green-deep"><Save size={16}/>{saved ? 'Enregistré' : 'Enregistrer le profil'}</button></div>
      </form>
    </main>
  )
}
