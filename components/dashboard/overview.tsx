"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Ene",
    total: 132,
  },
  {
    name: "Feb",
    total: 156,
  },
  {
    name: "Mar",
    total: 178,
  },
  {
    name: "Abr",
    total: 145,
  },
  {
    name: "May",
    total: 189,
  },
  {
    name: "Jun",
    total: 167,
  },
  {
    name: "Jul",
    total: 198,
  },
  {
    name: "Ago",
    total: 187,
  },
  {
    name: "Sep",
    total: 210,
  },
  {
    name: "Oct",
    total: 176,
  },
  {
    name: "Nov",
    total: 192,
  },
  {
    name: "Dic",
    total: 168,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip formatter={(value) => [`${value} asistentes`, "Total"]} labelFormatter={(label) => `${label}`} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

