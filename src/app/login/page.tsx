'use strict';

import { Suspense } from 'react';
import LoginPanel from './login-panel';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      }>
        <LoginPanel />
      </Suspense>
    </div>
  );
}
