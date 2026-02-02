"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Home, MessageCircle, PenTool, BookOpen, User, Sparkles, HeartHandshake, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },
  { icon: BookOpen, label: "Reflect", href: "/reflect" },
  { icon: PenTool, label: "Journal", href: "/journal" },
  { icon: Sparkles, label: "Moments", href: "/moments" },
  { icon: HeartHandshake, label: "Therapists", href: "/therapists" },
  { icon: Users, label: "Community", href: "/community" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 p-2 bg-card/60 backdrop-blur-2xl border border-border/50 rounded-full shadow-2xl shadow-primary/10">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-primary/5",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="sr-only">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 bg-primary/10 rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-foreground text-background text-[10px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tracking-widest uppercase">
                {item.label}
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
