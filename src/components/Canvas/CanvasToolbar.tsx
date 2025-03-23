'use client';

import React from 'react';
import styled from 'styled-components';

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
  height: 60px;
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToolbarButton = styled.button<{ active?: boolean }>`
  background-color: ${props => props.active ? '#f0f7ff' : 'transparent'};
  color: ${props => props.active ? '#4A90E2' : '#333'};
  border: 1px solid ${props => props.active ? '#4A90E2' : '#eaeaea'};
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#e6f0ff' : '#f9f9f9'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: transparent;
    border-color: #eaeaea;
  }
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ZoomText = styled.span`
  font-size: 14px;
  padding: 0 8px;
  color: #666;
  min-width: 60px;
  text-align: center;
`;

const AnalyzeButton = styled(ToolbarButton)`
  background-color: ${props => props.disabled ? '#eaeaea' : '#4A90E2'};
  color: ${props => props.disabled ? '#999' : 'white'};
  font-weight: 600;
  padding: 6px 16px;
  
  &:hover:not(:disabled) {
    background-color: #3A80D2;
  }
`;

interface CanvasToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
  hasImage: boolean;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onToggleFeedback: () => void;
  hasFeedback: boolean;
  showFeedback: boolean;
}

export default function CanvasToolbar({
  onZoomIn,
  onZoomOut,
  onReset,
  scale,
  hasImage,
  onAnalyze,
  isAnalyzing,
  onToggleFeedback,
  hasFeedback,
  showFeedback,
}: CanvasToolbarProps) {
  const formattedScale = Math.round(scale * 100);
  
  return (
    <ToolbarContainer>
      <ToolbarSection>
        <ZoomControls>
          <ToolbarButton onClick={onZoomOut} disabled={!hasImage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </ToolbarButton>
          
          <ZoomText>{formattedScale}%</ZoomText>
          
          <ToolbarButton onClick={onZoomIn} disabled={!hasImage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </ToolbarButton>
        </ZoomControls>
        
        <ToolbarButton onClick={onReset} disabled={!hasImage}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Reset
        </ToolbarButton>
      </ToolbarSection>
      
      <ToolbarSection>
        {hasFeedback && (
          <ToolbarButton 
            onClick={onToggleFeedback}
            active={showFeedback}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {showFeedback ? 'Hide Feedback' : 'Show Feedback'}
          </ToolbarButton>
        )}
        
        <AnalyzeButton 
          onClick={onAnalyze} 
          disabled={!hasImage || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <span style={{ 
                display: 'inline-block', 
                width: '14px', 
                height: '14px', 
                border: '2px solid rgba(255, 255, 255, 0.3)', 
                borderTopColor: 'white', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite'
              }}></span>
              Analyzing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Analyze Design
            </>
          )}
        </AnalyzeButton>
      </ToolbarSection>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </ToolbarContainer>
  );
}