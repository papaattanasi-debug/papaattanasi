'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect direttamente alla pagina di analisi
    router.push('/analyze');
  }, [router]);
  
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-gray-600">Loading...</div>
    </div>
  );
}
