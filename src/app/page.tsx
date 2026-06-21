import Link from 'next/link';
import { PRODUCT_CATALOG } from '@/lib/catalog';
import { QrCode, ArrowRight, ShieldCheck, CreditCard, Sparkles, MapPin, Eye } from 'lucide-react';

export default async function Home() {
  const featuredCategories = PRODUCT_CATALOG.slice(0, 6);

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-yellow-50/40 border-b-2 border-primary py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-primary bg-white text-xs font-bold text-dark-charcoal">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span>Premium Quality Online Printing</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-dark-charcoal tracking-tight leading-none">
              Design and Print Your <br/>
              <span className="bg-gradient-to-r from-primary via-yellow-500 to-primary bg-clip-text text-transparent">Brand Identity</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 font-semibold max-w-xl leading-relaxed">
              Create professional, customized business cards, stationery, apparel, and marketing materials. Edit online in real-time, generate scannable QR codes, and review in 3D.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/catalog" className="w-full sm:w-auto btn-primary py-3.5 px-8 text-sm shadow-md hover:shadow-lg">
                Browse Catalog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto btn-secondary py-3.5 px-8 text-sm">
                Google Login
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            {/* Visual Abstract Hero Card */}
            <div className="brand-card p-8 bg-white rotate-3 shadow-xl max-w-sm mx-auto border-4 border-primary">
              <div className="h-10 w-10 rounded-full bg-primary mb-4 flex items-center justify-center font-extrabold text-dark-charcoal">
                inf
              </div>
              <h2 className="text-2xl font-black text-dark-charcoal">Standard Visiting Card</h2>
              <div className="h-2 w-20 bg-primary my-3 rounded-full"></div>
              <p className="text-xs text-gray-500 font-bold mb-6">
                Premium 350 GSM • Rounded Corners • Soft Touch Matte Finish
              </p>
              
              {/* Dummy QR code */}
              <div className="border-2 border-primary p-2 rounded-xl inline-block bg-yellow-50/20">
                <QrCode className="h-16 w-16 text-dark-charcoal" />
              </div>

              <div className="mt-8 pt-4 border-t-2 border-primary flex justify-between items-center text-xs font-black">
                <span className="text-gray-400 uppercase tracking-widest">Infistyle India</span>
                <span className="text-primary font-black">₹200.00</span>
              </div>
            </div>
            {/* background circle decor */}
            <div className="absolute -top-10 -right-10 h-72 w-72 rounded-full bg-primary/10 -z-10 blur-xl"></div>
          </div>

        </div>
      </section>



      {/* 3. Featured Categories Grid */}
      <section className="py-16 bg-yellow-50/20 border-t border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-dark-charcoal">Shop By Category</h2>
              <p className="text-sm text-gray-500 font-semibold mt-1">
                Explore our catalog of custom-printed items
              </p>
            </div>
            <Link href="/catalog" className="text-sm font-bold text-dark-charcoal hover:text-primary flex items-center gap-1">
              View All Catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCategories.map((category) => (
              <div key={category.slug} className="brand-card overflow-hidden flex flex-col h-[350px]">
                <div className="h-48 w-full bg-yellow-50 border-b border-primary relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-lg text-dark-charcoal">{category.name}</h3>
                    <p className="text-xs text-gray-500 font-semibold line-clamp-2 mt-1">{category.description}</p>
                  </div>
                  <Link
                    href={`/catalog?category=${category.name}`}
                    className="btn-primary py-2 text-xs"
                  >
                    Explore Items
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trust and Tech stack highlights */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="brand-card bg-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border-4 border-primary">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-black text-dark-charcoal">
              Start Designing Your Assets Today
            </h2>
            <p className="text-sm text-gray-500 font-bold leading-relaxed">
              Login securely using your Google Account, load your designs in our editor, choose finishing options (glossy/matte, corners, quantity), and make seamless payments via Razorpay or Cash on Delivery.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2 bg-yellow-50 border border-primary px-4 py-2.5 rounded-full text-xs font-bold text-dark-charcoal">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Google OAuth</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 border border-primary px-4 py-2.5 rounded-full text-xs font-bold text-dark-charcoal">
              <CreditCard className="h-4 w-4 text-primary" />
              <span>Razorpay & COD</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-50 border border-primary px-4 py-2.5 rounded-full text-xs font-bold text-dark-charcoal">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Google Maps API</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
