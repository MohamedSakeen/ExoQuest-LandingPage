'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './curly-404.css';

type Theme = 'purple' | 'cyan' | 'emerald';

interface Curly404PageProps {
  theme: Theme;
  headline?: string;
  homeUrl?: string;
}

export default function Curly404Page({
  theme,
  headline = 'Looks like you reached an unhandled exception.',
  homeUrl = '/',
}: Curly404PageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleBack = useCallback(() => {
    const referrer = typeof document !== 'undefined' ? document.referrer : '';
    const isLoginReferrer =
      referrer.includes('/login') ||
      referrer.includes('/register') ||
      referrer.includes('accounts');

    if (!isLoginReferrer && typeof window !== 'undefined' && window.history.length > 1 && referrer) {
      router.back();
    } else {
      if (homeUrl.startsWith('http')) {
        window.location.href = homeUrl;
      } else {
        router.replace(homeUrl);
      }
    }
  }, [router, homeUrl]);

  useEffect(() => {
    if (!containerRef.current) return;

    let instance: import('./curly-404-logic').Curly404 | null = null;

    import('./curly-404-logic').then(({ Curly404 }) => {
      if (!containerRef.current) return;
      instance = new Curly404({
        target: containerRef.current,
        headline,
        homeText: 'Go Back',
        onAction: ({ type }) => {
          if (type === 'home') handleBack();
        },
      });
    });

    return () => {
      instance?.destroy();
    };
  }, [headline, handleBack]);

  return (
    <div
      ref={containerRef}
      className={`c404-theme-${theme}`}
      style={{ minHeight: '100vh', width: '100%' }}
    />
  );
}
