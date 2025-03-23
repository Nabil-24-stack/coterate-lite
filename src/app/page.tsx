'use client';

import React, { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import Canvas from '@/components/Canvas';
import styled from 'styled-components';
import { PageContextProvider } from '@/contexts/PageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Show loading state while checking auth
  if (status === 'loading') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%', 
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #4A90E2',
          animation: 'spin 1s linear infinite'
        }} />
        <p>Loading Coterate...</p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  // If authenticated, show app
  if (status === 'authenticated') {
    return (
      <PageContextProvider>
        <AppContainer>
          <Sidebar />
          <Canvas />
        </AppContainer>
      </PageContextProvider>
    );
  }
  
  // Fallback: shouldn't normally reach here
  return null;
}