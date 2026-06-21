'use strict';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark-charcoal text-white border-t-4 border-primary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <span className="text-3xl font-extrabold tracking-tight">
              infi<span className="text-primary">style</span>
            </span>
            <p className="text-gray-400 text-sm max-w-sm font-medium leading-relaxed">
              Infistyle India is your premium destination for high-quality custom printing. Designing, editing, and ordering professional assets has never been easier.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-primary font-bold text-sm uppercase tracking-wider mb-4">Product Catalog</h3>
            <ul className="space-y-2 text-sm text-gray-400 font-semibold">
              <li>
                <Link href="/catalog?category=Visiting Cards" className="hover:text-primary transition-colors">
                  Visiting Cards
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Stationery" className="hover:text-primary transition-colors">
                  Stationery
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Clothing" className="hover:text-primary transition-colors">
                  Clothing & Caps
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=Stickers" className="hover:text-primary transition-colors">
                  Labels & Packaging
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy Links */}
          <div>
            <h3 className="text-primary font-bold text-sm uppercase tracking-wider mb-4">Policies & Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400 font-semibold">
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-primary transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <div>
            &copy; {new Date().getFullYear()} Infistyle India. All rights reserved.
          </div>
          <div className="flex gap-4">
            <span>Supabase Auth</span>
            <span>•</span>
            <span>Razorpay Secure Payments</span>
            <span>•</span>
            <span>Google Maps Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
