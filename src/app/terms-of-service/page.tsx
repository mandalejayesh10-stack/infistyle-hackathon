'use strict';

import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="brand-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-extrabold text-dark-charcoal">Terms of Service</h1>
        </div>

        <p className="text-xs text-gray-500 font-semibold mb-6">Last Updated: June 22, 2026</p>

        <div className="space-y-6 text-sm text-gray-600 font-medium leading-relaxed">
          <p>
            Welcome to Infistyle India. By accessing our site and placing orders, you agree to comply with the terms and conditions outlined below.
          </p>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">1. Custom Design Ownership & Licensing</h2>
          <p>
            You retain copyright and ownership over all image uploads, logo assets, and custom text layers you add to the design canvas. By checking the authorization box at review, you declare that you have full authorization to use and print all logo designs and text submitted. Infistyle India is not responsible for any copyright infringements arising from printing submitted files.
          </p>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">2. Pricing & Customization Options</h2>
          <p>
            Prices are computed in real-time based on selected item configurations (Quantity, paper stock, laminated finishes, corners, and Delivery speed). All listed prices are subject to GST (18%) and shipping charges which are declared during the checkout process.
          </p>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">3. Acceptable Use Policy</h2>
          <p>
            Users are prohibited from uploading files or layouts containing abusive, defamatory, or unlawful content. We reserve the right to review design submissions and cancel orders that violate these standards.
          </p>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">4. Limitation of Liability</h2>
          <p>
            While we strive for precise color reproduction, minor shifts in shades between screen display and physical printing can occur due to substrate variations. Infistyle India is not liable for errors in alignment arising from user placement outside the marked safety/bleed boundary lines inside the editor.
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-yellow-100">
          <Link href="/" className="btn-primary text-xs">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
