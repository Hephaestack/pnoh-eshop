"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingBag, Search, User, Menu } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-light tracking-wider text-black">
            Πνοή
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/earrings" className="text-sm font-light hover:text-gray-600 transition-colors">
              ΚΟΣΜΗΜΑΤΑ
            </Link>
            <Link href="/about" className="text-sm font-light hover:text-gray-600 transition-colors">
              ΠΟΙΟΙ ΕΙΜΑΣΤΕ
            </Link>
              <Link href="/contact" className="text-sm font-light hover:text-gray-600 transition-colors">
              EΠΙΚΟΙΝΩΝΙΑ
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hover:bg-transparent"
            >
              <Search className="w-5 h-5 text-black hover:text-gray-600 transition-colors" />
            </Button>

            <Button variant="ghost" size="icon" className="hover:bg-transparent">
              <User className="w-5 h-5 text-black hover:text-gray-600 transition-colors" />
            </Button>

            <Button variant="ghost" size="icon" className="hover:bg-transparent relative">
              <ShoppingBag className="w-5 h-5 text-black hover:text-gray-600 transition-colors" />
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden hover:bg-transparent">
                  <Menu className="w-5 h-5 text-black" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-6 mt-6">
                  <Link href="/collections" className="text-lg font-light hover:text-gray-600 transition-colors">
                    ΣΥΛΛΟΓΕΣ
                  </Link>
                  <Link href="/rings" className="text-lg font-light hover:text-gray-600 transition-colors">
                    ΔΑΧΤΥΛΙΔΙΑ
                  </Link>
                  <Link href="/necklaces" className="text-lg font-light hover:text-gray-600 transition-colors">
                    ΚΟΛΙΕ
                  </Link>
                  <Link href="/earrings" className="text-lg font-light hover:text-gray-600 transition-colors">
                    ΣΚΟΥΛΑΡΙΚΙΑ
                  </Link>
                  <Link href="/about" className="text-lg font-light hover:text-gray-600 transition-colors">
                    ΣΧΕΤΙΚΑ
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Αναζήτηση προϊόντων..."
                className="flex-1 border-gray-200 focus:border-black transition-colors"
              />
              <Button variant="outline" className="border-gray-200 hover:border-black transition-colors bg-transparent">
                Αναζήτηση
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
