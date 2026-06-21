'use strict';

import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="brand-card p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-extrabold text-dark-charcoal">Privacy Policy</h1>
        </div>

        <p className="text-xs text-gray-500 font-semibold mb-6">Last Updated: June 22, 2026</p>

        <div className="space-y-6 text-sm text-gray-600 font-medium leading-relaxed">
          <p>
            Welcome to Infistyle India. We value your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website, design custom prints, and place orders.
          </p>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">1. Information We Collect</h2>
          <p>
            When you use our services, we collect information necessary to process your login and orders:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li><strong>Identity Data:</strong> Full name and email address provided during Google OAuth login.</li>
            <li><strong>Contact Data:</strong> Shipping address, billing address, phone number, and optional GSTIN.</li>
            <li><strong>Design Assets:</strong> Canvas layouts, customized text layers, uploaded images, and configuration options.</li>
            <li><strong>Transaction Data:</strong> Details of orders placed, payment statuses, and transaction reference IDs (processed securely through Razorpay).</li>
          </ul>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">2. How We Use Your Information</h2>
          <p>
            We process your information to fulfill our contract with you, specifically to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5">
            <li>Set up and manage your user account dashboard.</li>
            <li>Render, print, and manufacture your customized orders.</li>
            <li>Provide delivery details to shipping carriers based on your Google Maps coordinates and address inputs.</li>
            <li>Send transactional updates regarding your order progress.</li>
          </ul>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">3. Security of Your Data</h2>
          <p>
            We deploy secure data transfer practices. Your designs and profile details are stored securely within Supabase, protected by Row-Level Security (RLS) policies. Payment details are processed entirely by Razorpay using bank-grade tokenized structures.
          </p>

          <h2 className="text-lg font-bold text-dark-charcoal mt-8">4. Contact Us</h2>
          <p>
            For any queries regarding this policy, please reach out to us at:
            <br />
            <strong>Email:</strong> support@infistyle.in
            <br />
            <strong>Address:</strong> Bengaluru, India
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
