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
  
  // Canvas drag handlers
  const handleCanvasMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (draggingDesign) return; // Prevent canvas drag if we're dragging a design
    
    // Check if we're clicking on the canvas itself, not a design element
    if ((e.target as HTMLElement).closest('.design-card')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - canvasPosition.x,
      y: e.clientY - canvasPosition.y
    });
  };
  
  const handleCanvasMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging && !draggingDesign) return;
    
    if (isDragging) {
      // We're moving the canvas
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      };
      
      setCanvasPosition(newPosition);
      
      // If we have a current page, store its canvas position
      if (currentPage) {
        setPageCanvasPositions(prev => ({
          ...prev,
          [currentPage.id]: {
            x: newPosition.x,
            y: newPosition.y,
            scale: canvasScale
          }
        }));
      }
    } else if (draggingDesign && selectedIteration) {
      // We're moving a design
      // Update the selected iteration's position based on the drag
      // This would require calculating the position based on canvas scale and offset
      
      // For now, we'll just update state to show the UI feedback
      // In a real implementation, you'd calculate the new position here
    }
  };
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    
    if (draggingDesign) {
      setDraggingDesign(null);
      
      // Handle dropping the design iteration here
      // In a full implementation, you'd update the iteration's position in the state
    }
  };
  
  // Handle design selection
  const handleSelectDesign = (iteration: DesignIteration, e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent canvas drag start
    
    if (selectedIteration?.id === iteration.id) {
      // If we're clicking on an already selected item, start dragging it
      setDraggingDesign(iteration.id);
      setDesignDragStart({
        x: e.clientX,
        y: e.clientY
      });
    } else {
      // Select the iteration
      setSelectedIteration(iteration);
    }
  };
  
  // Handle design drag events
  const handleDesignMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!draggingDesign || !selectedIteration) return;
    
    // In a real implementation, you'd calculate new position based on mouse movement, 
    // canvas scale, and canvas position
    // For this UI prototype, we're just showing the interaction
  };

  const handleDesignMouseUp = () => {
    setDraggingDesign(null);
  };
  
  // Paste link overlay
  const [showPasteOverlay, setShowPasteOverlay] = useState(true);
  const [figmaLinkInput, setFigmaLinkInput] = useState('');
  
  // Handle Figma link input
  const handlePasteFigmaLink = () => {
    if (!figmaLinkInput.trim() || !currentPage) return;
    
    // In a real implementation, you'd fetch the design from Figma API here
    // For this UI prototype, we'll create a mock iteration
    
    const mockDesign: DesignIteration = {
      id: `iteration-${Date.now()}`,
      name: 'New Design',
      pageId: currentPage.id,
      imageUrl: 'https://via.placeholder.com/500x300',
      position: { x: 100, y: 100 },
      timestamp: new Date().toISOString(),
      feedback: null
    };
    
    // Add the new iteration to the current page
    setIterationsMap(prev => ({
      ...prev,
      [currentPage.id]: [
        ...(prev[currentPage.id] || []),
        mockDesign
      ]
    }));
    
    // Hide the paste overlay
    setShowPasteOverlay(false);
    
    // Select the new iteration
    setSelectedIteration(mockDesign);
  };
  
  // Function to handle analysis with GPT-4
  const analyzeDesign = () => {
    if (!selectedIteration) return;
    
    // In a real implementation, you would:
    // 1. Send the design to the GPT-4 API
    // 2. Get the feedback
    // 3. Update the design iteration with the feedback
    
    // For this UI prototype, we'll simulate the feedback
    setTimeout(() => {
      if (selectedIteration) {
        const updatedIteration = {
          ...selectedIteration,
          feedback: `
            This design has several strong points:
            
            - The layout is clean and well-structured
            - Good use of whitespace to separate content areas
            - Typography hierarchy is clear
            
            Suggestions for improvement:
            
            1. Consider increasing the contrast ratio between text and background for better accessibility
            2. The call-to-action button could be more prominent
            3. Mobile responsiveness may need adjustment for smaller screens
            4. Try adding subtle drop shadows to create more depth in the UI
          `
        };
        
        // Update the iteration in the map
        setIterationsMap(prev => {
          const pageIterations = [...(prev[updatedIteration.pageId] || [])];
          const index = pageIterations.findIndex(it => it.id === updatedIteration.id);
          
          if (index >= 0) {
            pageIterations[index] = updatedIteration;
          }
          
          return {
            ...prev,
            [updatedIteration.pageId]: pageIterations
          };
        });
        
        // Update the selected iteration
        setSelectedIteration(updatedIteration);
      }
    }, 2000); // Simulate API delay
  };
  
  // Zoom controls
  const zoomIn = () => {
    const newScale = Math.min(canvasScale * 1.2, 5); // Max zoom is 5x
    setCanvasScale(newScale);
    
    // Update stored scale for current page
    if (currentPage) {
      setPageCanvasPositions(prev => ({
        ...prev,
        [currentPage.id]: {
          ...(prev[currentPage.id] || { x: canvasPosition.x, y: canvasPosition.y }),
          scale: newScale
        }
      }));
    }
  };
  
  const zoomOut = () => {
    const newScale = Math.max(canvasScale / 1.2, 0.2); // Min zoom is 0.2x
    setCanvasScale(newScale);
    
    // Update stored scale for current page
    if (currentPage) {
      setPageCanvasPositions(prev => ({
        ...prev,
        [currentPage.id]: {
          ...(prev[currentPage.id] || { x: canvasPosition.x, y: canvasPosition.y }),
          scale: newScale
        }
      }));
    }
  };
  
  // Effect to restore canvas position when changing pages
  useEffect(() => {
    if (!currentPage) return;
    
    const pageId = currentPage.id;
    
    // If we already centered for this page, don't do it again
    if (centeringRef.current.pageId === pageId && centeringRef.current.hasCentered) {
      return;
    }
    
    // Check if we have a stored position for this page
    const storedPosition = pageCanvasPositions[pageId];
    
    if (storedPosition) {
      // Restore the position
      setCanvasPosition({ x: storedPosition.x, y: storedPosition.y });
      setCanvasScale(storedPosition.scale);
      
      // Mark that we've centered for this page
      centeringRef.current = {
        pageId,
        hasCentered: true,
        animationFrameId: null
      };
    } else {
      // If no stored position, center the canvas
      const delayedCentering = () => {
        if (canvasRef.current) {
          if (centeringRef.current.animationFrameId) {
            cancelAnimationFrame(centeringRef.current.animationFrameId);
          }
          
          centeringRef.current.animationFrameId = requestAnimationFrame(() => {
            resetCanvas();
          });
        } else {
          // If ref isn't available yet, try again in the next frame
          centeringRef.current.animationFrameId = requestAnimationFrame(delayedCentering);
        }
      };
      
      delayedCentering();
    }
    
    // Update the ref
    centeringRef.current.pageId = pageId;
    
    // Clean up animation frame on unmount
    return () => {
      if (centeringRef.current.animationFrameId) {
        cancelAnimationFrame(centeringRef.current.animationFrameId);
      }
    };
  }, [currentPage, pageCanvasPositions]);
  
  // Placeholder for initial design link setting
  useEffect(() => {
    // This would be replaced with actual Figma API handling
    // Mock initial data for UI prototype
    if (currentPage && !iterationsMap[currentPage.id]) {
      const mockDesigns: DesignIteration[] = [];
      setIterationsMap(prev => ({
        ...prev,
        [currentPage.id]: mockDesigns
      }));
    }
  }, [currentPage, iterationsMap]);
  
  // Return the appropriate UI for this component
  return (
    <CanvasContainer>
      <CanvasHeader>
        <Logo>
          <LogoIcon>C</LogoIcon>
          Coterate
        </Logo>
        
        <HeaderTabs>
          <HeaderTab 
            active={activeTab === 'research'} 
            onClick={() => setActiveTab('research')}
          >
            Research
          </HeaderTab>
          <HeaderTab 
            active={activeTab === 'iterations'} 
            onClick={() => setActiveTab('iterations')}
          >
            Iterations
          </HeaderTab>
        </HeaderTabs>
        
        <HeaderActions>
          <ActionButton onClick={resetCanvas}>Center</ActionButton>
          <ActionButton onClick={zoomIn}>Zoom In</ActionButton>
          <ActionButton onClick={zoomOut}>Zoom Out</ActionButton>
          
          {selectedIteration && !selectedIteration.feedback && (
            <ActionButton onClick={analyzeDesign}>
              Analyze Design
            </ActionButton>
          )}
        </HeaderActions>
      </CanvasHeader>
      
      <InfiniteCanvas
        scale={canvasScale}
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        <CanvasContent 
          x={canvasPosition.x} 
          y={canvasPosition.y} 
          scale={canvasScale}
        >
          <DesignContainer>
            {iterations.map(iteration => (
              <DesignCard
                key={iteration.id}
                className={`design-card ${selectedIteration?.id === iteration.id ? 'selected' : ''} ${draggingDesign === iteration.id ? 'dragging' : ''}`}
                style={{ 
                  left: `${iteration.position.x}px`, 
                  top: `${iteration.position.y}px`,
                }}
                onClick={(e) => handleSelectDesign(iteration, e)}
                onMouseMove={handleDesignMouseMove}
                onMouseUp={handleDesignMouseUp}
              >
                <DesignLabel>{iteration.name}</DesignLabel>
                <DesignImage 
                  src={iteration.imageUrl} 
                  alt={iteration.name} 
                />
                
                {iteration.feedback && (
                  <div style={{ 
                    marginTop: '1rem',
                    padding: '1rem', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px', 
                    fontSize: '14px',
                    color: '#333',
                    whiteSpace: 'pre-line',
                    width: '100%'
                  }}>
                    <h4 style={{ 
                      marginTop: 0, 
                      marginBottom: '0.5rem', 
                      fontWeight: 600 
                    }}>
                      GPT-4o Feedback
                    </h4>
                    {iteration.feedback}
                  </div>
                )}
              </DesignCard>
            ))}
          </DesignContainer>
        </CanvasContent>
        
        {showPasteOverlay && (
          <PasteOverlay>
            <h2>Paste your Figma design link</h2>
            <p>Copy a link to your design from Figma using "Copy link to selection" and paste it here.</p>
            
            <div style={{ 
              width: '100%', 
              marginTop: '1rem', 
              marginBottom: '1rem', 
              display: 'flex', 
              gap: '8px' 
            }}>
              <input 
                type="text" 
                placeholder="Paste Figma link here..."
                value={figmaLinkInput}
                onChange={(e) => setFigmaLinkInput(e.target.value)}
                style={{ 
                  flex: 1, 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid #E3E6EA',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
              <button 
                onClick={handlePasteFigmaLink}
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#1a73e8', 
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'inherit'
                }}
              >
                Import
              </button>
            </div>
            
            <small style={{ 
              color: '#888', 
              marginTop: '8px', 
              fontSize: '12px' 
            }}>
              Make sure you have permissions to access this design.
            </small>
          </PasteOverlay>
        )}
        
        {selectedIteration && (
          <SelectionHint>
            <HintIcon>i</HintIcon>
            Click "Analyze Design" to get AI-powered feedback
          </SelectionHint>
        )}
      </InfiniteCanvas>
    </CanvasContainer>
  );
};

export default Canvas;