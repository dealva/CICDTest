'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function HomePage() {
  // const router = useRouter();
  useEffect(() => {
    window.location.href = "/dashboard";
  }, []);
  // useEffect(() => {
  //   router.replace('/dashboard');
  // }, [router]);

  return <p>Redirecting to dashboard page...</p>;
}

