import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

const branches = [
  { name: "JLT", address: "Cluster X, Jumeirah Lake Towers", phone: "+971 50 000 0001" },
  { name: "Deira", address: "Al Rigga Street, Deira", phone: "+971 50 000 0002" },
  { name: "Dubai Marina", address: "Marina Walk, Dubai Marina", phone: "+971 50 000 0003" },
  { name: "Karama", address: "Karama Shopping Complex", phone: "+971 50 000 0004" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-brand-cream">
      {/* Top pattern */}
      <div className="h-1 bg-gradient-to-r from-brand-red via-brand-gold to-brand-red" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">S</span>
            </div>
            <div>
              <span className="font-heading text-xl font-bold text-white">Sayapatri</span>
              <p className="text-[10px] text-brand-gold leading-none">Authentic Nepali Kitchen</p>
            </div>
          </div>
          <p className="text-sm text-brand-cream/70 leading-relaxed mb-6">
            Bringing the warmth and flavours of Nepal to the heart of Dubai since 2018.
          </p>
          <div className="flex gap-3">
            <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors">
              <Facebook size={16} />
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-heading text-brand-gold font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-brand-cream/70">
            {["Menu", "Order Online", "Our Story", "Branches", "Contact"].map((l) => (
              <li key={l}>
                <Link href={l === "Menu" || l === "Order Online" ? "/menu" : `/#${l.toLowerCase().replace(" ", "-")}`}
                  className="hover:text-brand-gold transition-colors">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Branches */}
        <div className="md:col-span-2">
          <h4 className="font-heading text-brand-gold font-semibold mb-4">Our Branches</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {branches.map((b) => (
              <div key={b.name} className="text-sm">
                <p className="font-semibold text-white mb-1">{b.name}</p>
                <p className="text-brand-cream/60 flex items-start gap-1.5 mb-1">
                  <MapPin size={12} className="mt-0.5 shrink-0 text-brand-gold" />
                  {b.address}
                </p>
                <p className="text-brand-cream/60 flex items-center gap-1.5">
                  <Phone size={12} className="shrink-0 text-brand-gold" />
                  {b.phone}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-brand-cream/40">
        <p>© {new Date().getFullYear()} Sayapatri Restaurant LLC. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-brand-cream transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-brand-cream transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
