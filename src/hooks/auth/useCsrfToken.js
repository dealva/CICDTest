'use client';

import { useEffect, useState } from 'react';
import { getCsrfToken } from 'next-auth/react';

export default function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getCsrfToken();
      setCsrfToken(token || '');
    };

    fetchToken();
  }, []);

  return csrfToken;
}
