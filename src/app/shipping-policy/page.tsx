'use strict';

import Link from 'next/link';
import { Truck } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="brand-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <Truck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-extrabold text-dark-charcoal">Shipping & Delivery Policy</h1>
        </div>

        <p className="text-xs text-gray-500 font-semibold mb-6">Last Updated: June 22, 2026</p>

        <div className="space-y-6 text-sm text-gray-600 font-medium leading-relaxed">
          <p>
            Infistyle India delivers custom-printed products across India. Please review our shipping timelines, speeds, and terms.
          </p>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">1. Delivery Speeds & Printing Turnaround</h2>
          <p>
            We offer two printing and shipping packages based on your urgency:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>
              <strong>Standard Delivery (FREE):</strong> Printing and shipping take 3 to 5 business days. Delivery is free across India.
            </li>
            <li>
              <strong>Same Day / Next Day Delivery (+₹150.00):</strong> Orders placed before 12:00 PM are printed and dispatched the same day, arriving within 24 to 48 hours depending on your city.
            </li>
          </ul>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">2. Pincode Eligibility Check</h2>
          <p>
            During configuration on the product detail page, you can enter your local pincode to verify shipping availability and estimated arrival dates.
          </p>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">3. Address Validation with Google Maps</h2>
          <p>
            To ensure zero courier return failures, our checkout utilizes Google Maps autocomplete and GPS location pins to capture precise coordinate mappings for delivery.
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
