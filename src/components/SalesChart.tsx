import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { SalesPoint } from '../types'
import { formatFCFA } from '../lib/format'

interface SalesChartProps { data: SalesPoint[] }

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="h-[220px] w-full min-w-0 sm:h-[260px]" role="img" aria-label="Graphique des ventes en francs CFA au cours des sept derniers jours">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 6, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#e1e7dd" vertical={false} strokeDasharray="3 4" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#647365', fontSize: 11 }} tickMargin={10} />
          <YAxis width={56} axisLine={false} tickLine={false} tick={{ fill: '#647365', fontSize: 10 }} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
          <Tooltip cursor={{ fill: '#e5f1e5', radius: 6 }} contentStyle={{ borderRadius: 12, borderColor: '#e1e7dd', fontFamily: 'Nunito Sans' }} formatter={(value) => [formatFCFA(Number(value)), 'Ventes']} labelStyle={{ color: '#182f1c', fontWeight: 800 }} />
          <Bar dataKey="amountFCFA" name="Ventes" fill="#1F7A3D" radius={[6, 6, 0, 0]} maxBarSize={38} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
