"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, MapPin, Phone } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/menu", label: "Menu" },
    { href: "/#about", label: "Our Story" },
    { href: "/#branches", label: "Branches" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <>
      {/* Top bar */}
      <div className="bg-brand-charcoal text-brand-cream text-xs py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-brand-gold" />
              4 Branches Across Dubai
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-brand-gold" />
              +971 50 000 0001
            </span>
          </div>
          <span className="text-brand-gold">Free delivery on orders above AED 150</span>
        </div>
      </div>

      {/* Main nav */}
      <motion.nav
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-brand-cream"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">S</span>
            </div>
            <div>
              <span className="font-heading text-xl font-bold text-brand-charcoal">
                Sayapatri
              </span>
              <p className="text-[10px] text-brand-brown-light leading-none">
                Authentic Nepali Kitchen
              </p>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-brand-charcoal hover:text-brand-red transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/menu"
              className="hidden md:flex items-center gap-2 bg-brand-red text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-red-dark transition-colors"
            >
              Order Now
            </Link>

            {/* Cart */}
            <Link href="/checkout" className="relative p-2">
              <ShoppingCart size={22} className="text-brand-charcoal" />
              {mounted && totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-brand-cream-dark overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-brand-charcoal font-medium py-1"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/menu"
                  className="bg-brand-red text-white px-5 py-3 rounded-full text-center font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  Order Now
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
