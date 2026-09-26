import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Bot, ChevronDown, Leaf, Send, Sparkles } from 'lucide-react'
import type { ChatMessage } from '../types'

interface HelpChatProps { open: boolean; onClose: () => void }

const suggestions = ['Comment lire la traçabilité ?', 'Comment choisir un point relais ?']

function answerFor(text: string) {
  const normalized = text.toLowerCase()
  if (normalized.includes('traçab') || normalized.includes('origine') || normalized.includes('qr')) {
    return 'Ouvrez la fiche d’un produit et consultez « Historique de traçabilité ». Vous y verrez la récolte, la coopérative et la préparation. Ces informations sont des exemples de démonstration, sans certification tierce.'
  }
  if (normalized.includes('relais') || normalized.includes('livraison')) {
    return 'Au moment de valider votre panier, choisissez « Point relais ». Les frais de cette démo sont indiqués dans le récapitulatif. Les informations de livraison sont simulées.'
  }
  if (normalized.includes('paiement') || normalized.includes('wave') || normalized.includes('orange')) {
    return 'Vous pouvez sélectionner Orange Money, Wave, Free Money ou une carte dans le parcours de démonstration. Aucune transaction réelle n’est effectuée.'
  }
  if (normalized.includes('commande') || normalized.includes('suivi')) {
    return 'Après la confirmation locale, ouvrez « Mes commandes » pour consulter la progression. Les changements de statut sont simulés dans cette démo.'
  }
  return 'Je peux vous aider sur la traçabilité, la livraison ou le paiement de démonstration. Choisissez une question suggérée pour en savoir plus.'
}

export function HelpChat({ open, onClose }: HelpChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', sender: 'assistant', text: 'Bonjour ! Je peux vous guider dans la démo AgriConnect. Que souhaitez-vous savoir ?', createdAt: '09:41' },
  ])
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: globalThis.KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-visitor`, sender: 'visitor', text: trimmed, createdAt: now },
      { id: `${Date.now()}-assistant`, sender: 'assistant', text: answerFor(trimmed), createdAt: now },
    ])
    setDraft('')
  }

  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); send(draft) }
  const keyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(draft) }
  }

  return (
    <>
      <button type="button" aria-label="Fermer l’aide" onClick={onClose} className="fixed inset-0 z-40 bg-ink/20 sm:bg-transparent" />
      <section role="dialog" aria-label="Aide AgriConnect" className="fixed inset-x-0 bottom-0 z-50 flex h-[min(620px,88dvh)] flex-col overflow-hidden rounded-t-[1.5rem] border border-line bg-surface shadow-float sm:inset-x-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:w-[min(390px,calc(100vw-2rem))] sm:rounded-3xl">
        <header className="flex items-center gap-3 bg-brand-green px-4 py-3.5 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15"><Bot size={21}/></span>
          <div className="min-w-0 flex-1"><h2 className="font-extrabold">Aide AgriConnect</h2><p className="flex items-center gap-1 text-[11px] text-white/80"><Sparkles size={12}/> Assistant de démonstration</p></div>
          <button type="button" onClick={onClose} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-white/90 hover:bg-white/15 sm:h-9 sm:w-9" aria-label="Fermer l’aide"><ChevronDown size={20}/></button>
        </header>
        <div role="note" className="bg-blue-soft px-4 py-2 text-center text-[11px] font-semibold text-trust-blue">Réponses prédéfinies · aucune IA connectée</div>
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-page/80 p-4" aria-live="polite" aria-relevant="additions text">
          {messages.map((message) => <div key={message.id} className={`flex ${message.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${message.sender === 'visitor' ? 'rounded-br-md bg-brand-green text-white' : 'rounded-bl-md border border-line bg-white text-ink'}`}>
              {message.sender === 'assistant' && <p className="mb-1 flex items-center gap-1 text-[10px] font-extrabold text-brand-green"><Leaf size={11}/> AgriConnect</p>}
              <p className="text-sm leading-5">{message.text}</p><p className={`mt-1 text-right text-[10px] ${message.sender === 'visitor' ? 'text-white/65' : 'text-muted'}`}>{message.createdAt}</p>
            </div>
          </div>)}
          {messages.length === 1 && <div className="flex flex-wrap gap-2 pt-1">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => send(suggestion)} className="min-h-11 rounded-full border border-brand-green/30 bg-white px-3 py-2 text-xs font-bold text-brand-green transition hover:bg-green-soft">{suggestion}</button>)}</div>}
        </div>
        <form onSubmit={submit} className="border-t border-line bg-surface p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          <label htmlFor="help-chat-message" className="sr-only">Écrire un message</label>
          <div className="flex items-end gap-2 rounded-xl border border-line bg-white p-1.5 focus-within:border-brand-green">
            <textarea id="help-chat-message" ref={inputRef} rows={1} value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={keyDown} placeholder="Écrire un message…" className="max-h-24 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted" />
            <button type="submit" disabled={!draft.trim()} aria-label="Envoyer le message" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-green text-white hover:bg-green-deep disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"><Send size={16}/></button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted">Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne</p>
        </form>
      </section>
    </>
  )
}
