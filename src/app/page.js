'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return <p>Redirecting to dashboard page...</p>;
}

