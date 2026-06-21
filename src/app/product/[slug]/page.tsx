'use strict';

import { Suspense } from 'react';
import ProductDetailContent from './product-detail-content';

export default function ProductDetailPage() {
  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <ProductDetailContent />
      </Suspense>
    </div>
  );
}
