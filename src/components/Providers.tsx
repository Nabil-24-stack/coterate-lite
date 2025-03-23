'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import StyledComponentsRegistry from '@/lib/registry';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}