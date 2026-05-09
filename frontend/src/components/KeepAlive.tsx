'use client';
import { useEffect } from 'react';
import { startSupabaseKeepAlive } from '@/lib/supabase';

export function KeepAlive() {
  useEffect(() => {
    startSupabaseKeepAlive();
  }, []);
  return null;
}
