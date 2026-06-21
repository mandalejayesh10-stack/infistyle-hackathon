'use strict';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="brand-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-extrabold text-dark-charcoal">Refund & Return Policy</h1>
        </div>

        <p className="text-xs text-gray-500 font-semibold mb-6">Last Updated: June 22, 2026</p>

        <div className="space-y-6 text-sm text-gray-600 font-medium leading-relaxed">
          <p>
            At Infistyle India, we take pride in the quality of our prints. Since all products are custom manufactured and printed specifically with your custom designs, our refund policy follows these guidelines:
          </p>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">1. Printing Defects or Damaged Items</h2>
          <p>
            If your order arrives damaged during transit, or exhibits substantial manufacturing defects (e.g. incorrect cutting, wrong stock weight, or extreme print alignment shifts), please notify us within 3 days of receiving the package.
          </p>
          <p>
            Send details and photo proofs of the defects to <strong>support@infistyle.in</strong>. If verified, we will reprint and ship your order at no extra charge, or issue a refund.
          </p>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">2. User-Side Design Errors</h2>
          <p>
            Because we provide a full-featured online design editor with clear safety-area + bleed guides, 360 preview rotates, and a PDF proof download capability, we cannot offer refunds or reprints for:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Spelling, grammatical, or typographical errors made by the user.</li>
            <li>Low-resolution image uploads that render blurry or pixelated.</li>
            <li>Design elements placed outside the safety guides that get trimmed.</li>
            <li>Wrong product size, corners, or lamination options selected during order configuration.</li>
          </ul>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">3. Cancellation Window</h2>
          <p>
            Orders can be cancelled with a full refund within 1 hour of placing them. After 1 hour, the order is sent to the printing queue, and we cannot process cancellation requests.
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
