'use client';
import useSWR from 'swr';

export const useRexBalance = (publicKey: string) => {
  const pkString = typeof publicKey === 'string' ? publicKey : (publicKey as any)?.address || (publicKey as any)?.publicKey || '';

  const { data, isLoading, mutate } = useSWR(
    pkString ? `/api/balance/${pkString}` : null,
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 8000 }
  );

  return {
    rexBalance: data?.rexBalance || '0',
    xlmBalance: data?.xlmBalance || '0',
    hasTrustline: data?.hasTrustline || false,
    isLoading,
    mutate,
  };
};
