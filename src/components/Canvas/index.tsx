'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import CanvasToolbar from './CanvasToolbar';
import FeedbackPanel from './FeedbackPanel';

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  background-color: #f5f5f5;
  overflow: hidden;
`;

const CanvasArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const CanvasContent = styled.div<{ scale: number; x: number; y: number }>`
  position: absolute;
  transform-origin: 0 0;
  transform: scale(${props => props.scale}) translate(${props => props.x}px, ${props => props.y}px);
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.05s ease-out;
  min-width: 800px;
  min-height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CanvasImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const UploadOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  border: 3px dashed #ddd;
  border-radius: 8px;
  margin: 20px;
  z-index: 100;
  pointer-events: none;
  opacity: 0.8;
`;

const DropInstructions = styled.div`
  text-align: center;
  margin-top: 16px;
  
  h3 {
    font-size: 24px;
    margin-bottom: 8px;
    color: #333;
  }
  
  p {
    font-size: 16px;
    color: #666;
    max-width: 500px;
  }
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4A90E2;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function Canvas() {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      }
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageUpload(file);
            break;
          }
        }
      }
    }
  };
  
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setImageUrl(result);
        // Reset position and scale when new image is loaded
        setPosition({ x: 0, y: 0 });
        setScale(1);
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        handleImageUpload(file);
      }
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.1, scale + delta), 5);
    setScale(newScale);
  };
  
  const handleZoomIn = () => {
    setScale(Math.min(scale + 0.1, 5));
  };
  
  const handleZoomOut = () => {
    setScale(Math.max(scale - 0.1, 0.1));
  };
  
  const handleReset = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };
  
  const handleAnalyze = async () => {
    if (!imageUrl) return;
    
    setIsAnalyzing(true);
    setFeedback(null);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFeedback(data.feedback);
        setShowFeedback(true);
      } else {
        console.error('Analysis error:', data.error);
        setFeedback('Error analyzing design. Please try again.');
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      setFeedback('Error analyzing design. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Set up keyboard events for paste functionality
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Ctrl+V / Cmd+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        // React will handle paste event on focused elements
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <CanvasContainer>
      <CanvasToolbar 
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        scale={scale}
        hasImage={!!imageUrl}
        onAnalyze={handleAnalyze}
        isAnalyzing={isAnalyzing}
        onToggleFeedback={() => setShowFeedback(!showFeedback)}
        hasFeedback={!!feedback}
        showFeedback={showFeedback}
      />
      
      <CanvasArea 
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0} // Required for the div to receive keyboard events
      >
        <CanvasContent 
          scale={scale} 
          x={position.x} 
          y={position.y}
        >
          {imageUrl ? (
            <CanvasImage src={imageUrl} alt="Design" />
          ) : (
            <UploadOverlay>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#4A90E2" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <DropInstructions>
                <h3>Upload your design</h3>
                <p>Drag & drop an image, paste from clipboard, or 
                  <span 
                    style={{ 
                      color: '#4A90E2', 
                      cursor: 'pointer', 
                      textDecoration: 'underline',
                      marginLeft: '5px'
                    }}
                    onClick={handleBrowseFiles}
                  >
                    browse files
                  </span>
                </p>
              </DropInstructions>
            </UploadOverlay>
          )}
        </CanvasContent>
        
        {isAnalyzing && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
          }}>
            <LoadingSpinner />
            <p>Analyzing your design...</p>
          </div>
        )}
      </CanvasArea>
      
      {showFeedback && feedback && (
        <FeedbackPanel 
          feedback={feedback} 
          onClose={() => setShowFeedback(false)} 
        />
      )}
      
      {/* Hidden file input for browse functionality */}
      <input 
        type="file" 
        ref={fileInputRef}
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={handleFileSelect}
      />
    </CanvasContainer>
  );
}