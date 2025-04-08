"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Users, Calendar, BarChart3, Home } from "lucide-react"

interface MobileNavProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ isOpen, onOpenChange }: MobileNavProps) {
  const pathname = usePathname()

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
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link href="/dashboard" className="flex items-center" onClick={() => onOpenChange(false)}>
            <span className="font-bold text-xl">ASOMAMECO</span>
          </Link>
        </div>
        <div className="mt-8 px-7">
          <nav className="flex flex-col gap-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  route.active ? "text-primary" : "text-muted-foreground hover:text-primary",
                )}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

