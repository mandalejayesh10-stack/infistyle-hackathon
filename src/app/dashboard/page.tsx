'use strict';

import { Suspense } from 'react';
import DashboardContent from './dashboard-content';

export default function DashboardPage() {
  return (
    <div className="bg-white min-h-screen">
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
