import React, { useState, useEffect } from 'react'
import { Check, ShieldCheck, Smartphone, X, Lock, RefreshCw, AlertCircle, QrCode, CreditCard, ArrowRight } from 'lucide-react'
import type { PaymentMethod } from '../types'
import { formatFCFA } from '../lib/format'

interface MobileMoneyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (paymentData: { phone: string; transactionId: string }) => void
  amountFCFA: number
  paymentMethod: PaymentMethod
  initialPhone?: string
}

export function MobileMoneyModal({
  isOpen,
  onClose,
  onSuccess,
  amountFCFA,
  paymentMethod,
  initialPhone = '+221 77 123 45 67',
}: MobileMoneyModalProps) {
  const [step, setStep] = useState<'input' | 'processing' | 'pin_prompt' | 'success'>('input')
  const [phone, setPhone] = useState(initialPhone)
  const [pin, setPin] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [error, setError] = useState('')
  const [transactionId, setTransactionId] = useState('')

  useEffect(() => {
    if (isOpen) {
      setStep('input')
      setError('')
      setPin('')
      if (initialPhone) setPhone(initialPhone)
    }
  }, [isOpen, initialPhone])

  if (!isOpen) return null

  // Provider styles & metadata
  const providerMeta = {
    'Orange Money': {
      bg: 'bg-orange-600',
      text: 'text-orange-600',
      lightBg: 'bg-orange-50',
      borderColor: 'border-orange-500',
      operatorCode: '#144#',
      prefixHint: 'Orange Money (77 ou 78)',
      placeholderPhone: '+221 77 123 45 67',
      prefixRegex: /^\+221\s*(77|78)/,
      defaultPrefix: '+221 77',
      txPrefix: 'OM',
    },
    'Wave': {
      bg: 'bg-[#0f75bd]',
      text: 'text-[#0f75bd]',
      lightBg: 'bg-sky-50',
      borderColor: 'border-[#0f75bd]',
      operatorCode: 'Wave App',
      prefixHint: 'Wave (77, 78, 76, 70, 75)',
      placeholderPhone: '+221 77 456 78 90',
      prefixRegex: /^\+221\s*(77|78|76|70|75)/,
      defaultPrefix: '+221 77',
      txPrefix: 'WAVE',
    },
    'Free Money': {
      bg: 'bg-[#e2001a]',
      text: 'text-[#e2001a]',
      lightBg: 'bg-red-50',
      borderColor: 'border-[#e2001a]',
      operatorCode: '#150#',
      prefixHint: 'Free Money (76)',
      placeholderPhone: '+221 76 890 12 34',
      prefixRegex: /^\+221\s*76/,
      defaultPrefix: '+221 76',
      txPrefix: 'FREE',
    },
    'Carte bancaire': {
      bg: 'bg-[#1b365d]',
      text: 'text-[#1b365d]',
      lightBg: 'bg-blue-50',
      borderColor: 'border-[#1b365d]',
      operatorCode: '3D Secure',
      prefixHint: 'Carte Visa / Mastercard',
      placeholderPhone: '',
      prefixRegex: /.*/,
      defaultPrefix: '',
      txPrefix: 'CARD',
    },
  }[paymentMethod]

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (paymentMethod !== 'Carte bancaire') {
      if (!phone || phone.trim().length < 9) {
        setError('Veuillez saisir un numéro de téléphone valide au Sénégal.')
        return
      }
    } else {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setError('Numéro de carte invalide (16 chiffres requis).')
        return
      }
      if (!cardExpiry || !cardCvc) {
        setError('Veuillez remplir la date d’expiration et le code CVC.')
        return
      }
    }

    // Generate Transaction ID
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    const generatedTxId = `${providerMeta.txPrefix}-${new Date().getFullYear()}-${randomNum}`
    setTransactionId(generatedTxId)

    setStep('processing')

    // Simulate network delay / USSD prompt launch
    setTimeout(() => {
      setStep('pin_prompt')
    }, 1500)
  }

  const handleConfirmPin = () => {
    if (paymentMethod !== 'Wave' && pin.length < 4) {
      setError('Veuillez saisir votre code à 4 chiffres.')
      return
    }
    setError('')
    setStep('processing')

    setTimeout(() => {
      setStep('success')
    }, 1800)
  }

  const handleFinish = () => {
    onSuccess({
      phone: paymentMethod === 'Carte bancaire' ? 'Carte **** ' + cardNumber.slice(-4) : phone,
      transactionId,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center overflow-y-auto bg-black/65 p-0 sm:p-4 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-md max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl transition-all flex flex-col">
        {/* Mobile handle indicator */}
        <div className="sm:hidden flex justify-center pt-2 pb-1 bg-white border-b border-slate-100">
          <div className="w-12 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header with Provider Branding */}
        <div className={`${providerMeta.bg} px-4 sm:px-6 py-4 sm:py-5 text-white flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-md shrink-0">
              {paymentMethod === 'Carte bancaire' ? (
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              ) : (
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold leading-tight">{paymentMethod}</h3>
              <p className="text-[11px] sm:text-xs text-white/80">Paiement sécurisé · AgriConnect</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/90 hover:bg-white/20 hover:text-white transition active:scale-95"
            aria-label="Fermer la fenêtre de paiement"
          >
            <X size={20} />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 shrink-0">
          <span>Montant à débiter</span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 tabular-nums">
            {formatFCFA(amountFCFA)}
          </span>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* STEP 1: INPUT PHONE OR CARD DETAILS */}
          {step === 'input' && (
            <form onSubmit={handleStartPayment} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-600 border border-red-200">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {paymentMethod !== 'Carte bancaire' ? (
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Numéro Mobile Money ({paymentMethod})
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Smartphone size={18} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={providerMeta.placeholderPhone}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-base sm:text-sm font-bold text-slate-900 shadow-sm focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Saisissez votre numéro {providerMeta.prefixHint}. Une demande de confirmation vous sera transmise.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                      Numéro de Carte
                    </label>
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                      placeholder="4000 1234 5678 9010"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-3.5 text-base sm:text-sm font-mono font-bold text-slate-900 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                        Expiration
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-base sm:text-sm font-bold text-slate-900 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="123"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3.5 text-base sm:text-sm font-bold text-slate-900 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Informational callout */}
              <div className={`rounded-2xl ${providerMeta.lightBg} p-3.5 text-xs text-slate-700 flex items-start gap-2.5 border ${providerMeta.borderColor}/30`}>
                <ShieldCheck size={18} className={`shrink-0 ${providerMeta.text} mt-0.5`} />
                <div>
                  <p className="font-extrabold">Transaction simulée</p>
                  <p className="mt-0.5 text-[11px] text-slate-600">
                    {paymentMethod === 'Wave'
                      ? 'Une notification Push ou un QR Code Wave sera généré instantanément.'
                      : paymentMethod === 'Orange Money'
                      ? 'Un prompt de confirmation USSD #144# sera affiché sur votre écran.'
                      : paymentMethod === 'Free Money'
                      ? 'Un code de validation par SMS #150# vous sera demandé.'
                      : 'Un paiement test via la passerelle de paiement sécurisée.'}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl ${providerMeta.bg} py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:brightness-95 active:scale-[0.99]`}
              >
                <span>Payer {formatFCFA(amountFCFA)}</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* STEP 2: PROCESSING LOADING STATE */}
          {step === 'processing' && (
            <div className="py-8 sm:py-10 text-center space-y-4">
              <div className="relative inline-flex items-center justify-center">
                <RefreshCw size={44} className={`animate-spin ${providerMeta.text}`} />
                <Lock size={18} className="absolute text-slate-700" />
              </div>
              <div>
                <h4 className="text-base font-extrabold text-slate-900">Connexion à {paymentMethod}...</h4>
                <p className="mt-1 text-xs text-slate-500">
                  Envoi de la requête de paiement sécurisée vers {phone || 'la banque'}...
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: SIMULATED USSD / PIN CONFIRMATION */}
          {step === 'pin_prompt' && (
            <div className="space-y-4">
              {/* Simulated Phone Popup Screen */}
              <div className="relative rounded-2xl bg-slate-900 p-4 text-white shadow-xl border border-slate-700">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2 mb-3">
                  <span className="font-bold">{paymentMethod} SIMULATOR</span>
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono">{providerMeta.operatorCode}</span>
                </div>

                {paymentMethod === 'Wave' ? (
                  <div className="text-center py-3 space-y-3">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#0f75bd] text-white shadow-md">
                      <QrCode size={36} />
                    </div>
                    <p className="text-xs font-bold text-slate-200">
                      Demande de paiement reçue sur la ligne <span className="text-sky-300 font-mono">{phone}</span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Montant : <span className="text-white font-extrabold">{formatFCFA(amountFCFA)}</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-slate-800 p-3 text-xs text-slate-200">
                      <p className="font-semibold">
                        AgriConnect demande un débit de <span className="text-emerald-400 font-bold">{formatFCFA(amountFCFA)}</span>.
                      </p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        Saisissez votre code secret Mobile Money à 4 chiffres pour valider.
                      </p>
                    </div>

                    <div>
                      <input
                        type="password"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                        placeholder="••••"
                        className="w-full text-center tracking-[0.5em] text-xl font-bold py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-brand-green"
                      />
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <p className="text-xs font-bold text-red-600 text-center">{error}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="w-1/3 min-h-11 rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 active:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPin}
                  className={`w-2/3 min-h-11 rounded-xl ${providerMeta.bg} py-2.5 text-xs font-extrabold text-white shadow-md hover:brightness-95 active:scale-[0.99]`}
                >
                  Valider le paiement
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS RECEIPT */}
          {step === 'success' && (
            <div className="text-center py-3 sm:py-4 space-y-4">
              <div className="mx-auto grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
                <Check size={32} className="stroke-[3]" />
              </div>

              <div>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-extrabold text-emerald-800">
                  Paiement Confirmé
                </span>
                <h4 className="mt-2 text-xl font-extrabold text-slate-900">
                  {formatFCFA(amountFCFA)}
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Transaction effectuée avec succès via {paymentMethod}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3.5 text-left text-xs space-y-2 border border-slate-100 font-mono">
                <div className="flex justify-between flex-wrap gap-1">
                  <span className="text-slate-500 font-sans">Référence :</span>
                  <span className="font-bold text-slate-900">{transactionId}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-1">
                  <span className="text-slate-500 font-sans">Compte/Tél :</span>
                  <span className="font-bold text-slate-900">{phone}</span>
                </div>
                <div className="flex justify-between flex-wrap gap-1">
                  <span className="text-slate-500 font-sans">Date & Heure :</span>
                  <span className="font-bold text-slate-900">
                    {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Statut :</span>
                  <span className="font-bold text-emerald-600 font-sans">VALIDÉ</span>
                </div>
              </div>

              {/* Simulated SMS Notification */}
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-left text-[11px] text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1 text-amber-950">
                  <Smartphone size={14} /> SMS de confirmation ({paymentMethod})
                </p>
                <p className="italic text-amber-900/90 leading-tight">
                  "AgriConnect: Vous avez payé {formatFCFA(amountFCFA)} avec succès. Réf {transactionId}. Merci de votre achat !"
                </p>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full min-h-12 rounded-xl bg-brand-green py-3 text-sm font-extrabold text-white shadow-md hover:bg-green-deep active:scale-[0.99] transition"
              >
                Voir ma commande
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
