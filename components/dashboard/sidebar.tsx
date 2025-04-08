"use client"

import type React from "react"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Users, Calendar, BarChart3, Home } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  pathname: string
}

export function Sidebar({ className, pathname, ...props }: SidebarProps) {
  const routes = [
    {
      label: "Inicio",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Asociados",
      icon: Users,
      href: "/dashboard/asociados",
      active: pathname.includes("/dashboard/asociados"),
    },
    {
      label: "Eventos",
      icon: Calendar,
      href: "/dashboard/eventos",
      active: pathname.includes("/dashboard/eventos"),
    },
    {
      label: "Reportes",
      icon: BarChart3,
      href: "/dashboard/reportes",
      active: pathname.includes("/dashboard/reportes"),
    },
  ]

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  route.active ? "bg-accent text-accent-foreground" : "transparent",
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                <span>{route.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

