'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import Canvas from '@/components/Canvas';
import styled from 'styled-components';
import { PageContextProvider } from '@/contexts/PageContext';

const AppContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

export default function Home() {
  return (
    <PageContextProvider>
      <AppContainer>
        <Sidebar />
        <Canvas />
      </AppContainer>
    </PageContextProvider>
  );
}