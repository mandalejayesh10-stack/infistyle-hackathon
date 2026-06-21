'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  base_price: number;
  features: string[];
  images: string[];
}

interface ArrivalsShowcaseProps {
  initialProducts: any[];
}

export default function ArrivalsShowcase({ initialProducts }: ArrivalsShowcaseProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMergedProducts = async () => {
      // Step 1: Start with database products passed from server
      const merged: ProductItem[] = initialProducts.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        base_price: Number(p.base_price),
        features: p.features || [],
        images: p.images || []
      }));

      // Step 2: Load products from localStorage and merge/overwrite
      try {
        const localProdsJson = localStorage.getItem('infistyle_custom_products');
        if (localProdsJson) {
          const localProds: any[] = JSON.parse(localProdsJson);
          localProds.forEach((lp) => {
            const parsed: ProductItem = {
              id: lp.id || lp.slug,
              name: lp.name,
              slug: lp.slug,
              category: lp.category,
              base_price: Number(lp.base_price),
              features: lp.features || [],
              images: lp.images || []
            };

            const existingIdx = merged.findIndex(p => p.slug === parsed.slug);
            if (existingIdx > -1) {
              // Overwrite existing database representation with local version (e.g. customized images)
              merged[existingIdx] = parsed;
            } else {
              // Prepend newly added custom product so they show at the top of the arrivals showcase
              merged.unshift(parsed);
            }
          });
        }
      } catch (err) {
        console.error('Error loading custom products from localStorage:', err);
      }

      // Step 3: If showcase is empty, fallback to default seed items so the section remains visible and elegant
      if (merged.length === 0) {
        merged.push(
          {
            id: 'standard-visiting-cards',
            name: 'Standard Visiting Cards',
            slug: 'standard-visiting-cards',
            category: 'Visiting Cards',
            base_price: 200,
            features: ['Standard 3.5" x 2.0" size', 'Glossy or matte finish', '350 GSM premium cardstock', 'Double-sided printing'],
            images: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80']
          },
          {
            id: 'personalised-notebooks',
            name: 'Personalised Notebooks',
            slug: 'personalised-notebooks',
            category: 'Stationery',
            base_price: 290,
            features: ['Wire-O spiral bound notebook', 'Custom printed front cover', '80 ruled pages'],
            images: ['https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80']
          },
          {
            id: 'polo-t-shirts',
            name: 'Polo T-Shirts',
            slug: 'polo-t-shirts',
            category: 'Clothing',
            base_price: 490,
            features: ['240 GSM heavy cotton pique fabric', 'Ribbed collar and cuffs', 'Vibrant logo print front panel'],
            images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80']
          }
        );
      }

      // Limit showcase to 3 items
      setProducts(merged.slice(0, 3));
      setLoading(false);
    };

    loadMergedProducts();
  }, [initialProducts]);

  if (loading) {
    return (
      <section className="py-16 bg-white border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-dark-charcoal">
            New Customizable <span className="text-primary">Showcase</span>
          </h2>
          <p className="text-sm text-gray-500 font-bold mt-2">
            Fresh, premium styles added directly from our admin panel, uploaded straight from local devices!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((item) => {
            const img = item.images?.[0] || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80';
            return (
              <div key={item.slug} className="brand-card overflow-hidden flex flex-col h-[400px] bg-white hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full bg-yellow-50 overflow-hidden border-b border-primary group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-white border border-primary px-2.5 py-1 rounded-full text-xs font-black text-dark-charcoal shadow-sm">
                    ₹{Number(item.base_price).toFixed(2)}
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-primary bg-yellow-50 border border-primary/30 px-2 py-0.5 rounded-full">
                      {item.category}
                    </span>
                    <h3 className="font-extrabold text-base text-dark-charcoal mt-2 mb-1.5 line-clamp-1">
                      {item.name}
                    </h3>
                    
                    <ul className="text-xs text-gray-500 space-y-1 mt-2 mb-4">
                      {(item.features || []).slice(0, 2).map((feat: string, idx: number) => (
                        <li key={idx} className="line-clamp-1 flex items-center gap-1 font-medium">
                          <span className="text-primary font-bold">•</span> {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={`/product/${item.slug}`} className="w-full btn-primary text-xs py-2 flex items-center justify-center gap-1">
                    <Eye className="h-4 w-4" />
                    Configure & Design
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
