'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const CanvasEditor = dynamic(() => import('./canvas-editor-client'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-sm text-gray-500 font-bold">Loading Infistyle Design Editor...</p>
      </div>
    </div>
  )
});

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CanvasEditor />
    </Suspense>
  );
}
