'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Legacy page - redirects to /analyze
export default function EvaluatePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/analyze');
  }, [router]);
  return null;
}
