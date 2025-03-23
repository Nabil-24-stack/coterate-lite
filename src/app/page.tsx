'use client';

import React from 'react';
import styled from 'styled-components';
import { Sidebar } from '../components/Sidebar';
import { Canvas } from '../components/Canvas';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
  position: relative;
`;

export default function Home() {
  return (
    <AppContainer>
      <Sidebar />
      <Canvas />
    </AppContainer>
  );
}