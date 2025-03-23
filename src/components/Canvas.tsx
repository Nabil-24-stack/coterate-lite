'use client';

import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import styled from 'styled-components';
import { usePageContext } from '../contexts/PageContext';
import { DesignIteration } from '../types';

// Logo component
const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 28px;
  color: #333;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background-color: #4A90E2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

// Redesigned Canvas Container
const CanvasContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
  z-index: 1; /* Lower z-index to ensure borders are visible */
`;

// Canvas header with tabs
const CanvasHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #E3E6EA;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* Enhanced shadow for better visibility */
`;

const HeaderTabs = styled.div`
  display: flex;
  gap: 16px;
  justify-self: center;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  justify-self: end;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: white;
  color: #333;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid #E3E6EA;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: 'Plus Jakarta Sans', sans-serif;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const HeaderTab = styled.button<{ active?: boolean }>`
  padding: 8px 16px;
  background-color: ${props => props.active ? '#EFEFEF' : 'transparent'};
  color: ${props => props.active ? '#333' : '#666'};
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Plus Jakarta Sans', sans-serif;
  
  &:hover {
    background-color: ${props => props.active ? '#EFEFEF' : '#F5F5F5'};
  }
`;

// Infinite Canvas
const InfiniteCanvas = styled.div<{ scale: number }>`
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);
  margin-top: 60px; /* Add margin to account for fixed header */
  overflow: hidden;
  background-color: #f5f5f5;
  background-image: 
    linear-gradient(rgba(150, 150, 150, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(150, 150, 150, 0.1) 1px, transparent 1px);
  background-size: ${props => 20 * props.scale}px ${props => 20 * props.scale}px;
  cursor: grab;
  border: none !important;
  outline: none !important;
  z-index: 1; /* Lower z-index to ensure borders are visible */
  margin-left: 1px; /* Add margin to prevent overlap with sidebar border */
  
  &:active {
    cursor: grabbing;
  }
  
  &:focus, &:focus-visible, &:focus-within {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  * {
    border: none !important;
    outline: none !important;
  }
`;

const CanvasContent = styled.div<{ x: number; y: number; scale: number }>`
  position: absolute;
  transform: translate(${props => props.x}px, ${props => props.y}px) scale(${props => props.scale});
  transform-origin: 0 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100%;
  min-height: 100%;
  border: none !important;
  outline: none !important;
  z-index: 1; /* Lower z-index to ensure borders are visible */
  
  &:focus, &:focus-visible, &:focus-within {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
  
  * {
    border: none !important;
    outline: none !important;
  }
`;

// Design elements
const DesignContainer = styled.div`
  position: relative;
  min-width: 100%;
  min-height: 100%;
  padding: 100px;
`;

const DesignCard = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
  max-width: 600px;
  border: 2px solid transparent;
  outline: none;
  z-index: 10;
  cursor: pointer; /* Default cursor is pointer for selection */
  transition: box-shadow 0.2s ease, transform 0.05s ease, border-color 0.2s ease;
  
  &:focus, &:focus-visible, &:focus-within {
    outline: none;
    border-color: #1a73e8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  &.selected {
    border-color: #1a73e8; /* Darker Google blue for selected state */
    border-width: 3px; /* Thicker border */
    box-shadow: 0 0 0 1px rgba(26, 115, 232, 0.3);
    cursor: move; /* Change cursor to move when selected */
  }
  
  &.selected:active {
    cursor: grabbing; /* Show grabbing cursor when active and selected */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(26, 115, 232, 0.3);
    transform: scale(1.01); /* Slight scale effect when dragging */
  }
  
  &.dragging {
    opacity: 0.9; /* Slight transparency when dragging */
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(26, 115, 232, 0.5);
  }
`;

const DesignLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 12px;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const DesignImage = styled.img`
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 4px;
  border: none !important;
  outline: none !important;
  
  &:focus, &:focus-visible, &:focus-within {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }
`;

// Paste overlay
const PasteOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  width: 500px;
  max-width: 90%;
  
  h2 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 24px;
    font-weight: 600;
    color: #333;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  
  p {
    font-size: 16px;
    color: #666;
    max-width: 400px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
`;

// Tooltip for selection hint
const SelectionHint = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1a73e8;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  pointer-events: none;
  opacity: 0.9;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
`;

// Icon for the hint
const HintIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  font-size: 14px;
`;

// Canvas component
export const Canvas = () => {
  const { currentPage, updatePage } = usePageContext();
  const [iterationsMap, setIterationsMap] = useState<Record<string, DesignIteration[]>>({});
  const [selectedIteration, setSelectedIteration] = useState<DesignIteration | null>(null);
  const [activeTab, setActiveTab] = useState<'research' | 'iterations'>('iterations');
  
  // Canvas state
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [canvasScale, setCanvasScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Store canvas positions for each page
  const [pageCanvasPositions, setPageCanvasPositions] = useState<Record<string, { x: number, y: number, scale: number }>>({});
  
  // Dragging state for designs
  const [draggingDesign, setDraggingDesign] = useState<string | null>(null);
  const [designDragStart, setDesignDragStart] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Ref to track the current page ID and whether we've centered for it
  const centeringRef = useRef<{
    pageId: string | null;
    hasCentered: boolean;
    animationFrameId: number | null;
  }>({
    pageId: null,
    hasCentered: false,
    animationFrameId: null
  });

  // Get the iterations for the current page
  const iterations = currentPage ? (iterationsMap[currentPage.id] || []) : [];

  // Reset canvas position and scale
  const resetCanvas = () => {
    // If we don't have a current page, do nothing
    if (!currentPage) return;
    
    // Center the canvas if there's a canvasRef
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newPosition = {
        x: rect.width / 2,
        y: rect.height / 3  // Position slightly higher to account for UI elements
      };
      
      // Force the canvas position to be centered
      setCanvasPosition(newPosition);
      
      // Reset scale to 1 for consistent view
      const newScale = 1;
      setCanvasScale(newScale);
      
      // Mark that we've centered for this page
      centeringRef.current = {
        pageId: currentPage.id,
        hasCentered: true,
        animationFrameId: null
      };
      
      // Clear any saved position for this page to prevent it from being restored
      setPageCanvasPositions(prev => {
        const newPositions = {...prev};
        delete newPositions[currentPage.id];
        return newPositions;
      });
    } else {
      const newPosition = { x: 0, y: 0 };
      setCanvasPosition(newPosition);
      const newScale = 1;
      setCanvasScale(newScale);
      
      // Mark that we've centered for this page
      centeringRef.current = {
        pageId: currentPage.id,
        hasCentered: true,
        animationFrameId: null
      };
      
      // Clear any saved position for this page
      setPageCanvasPositions(prev => {
        const newPositions = {...prev};
        delete newPositions[currentPage.id];
        return newPositions;
      });
    }
  };