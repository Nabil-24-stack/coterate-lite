'use client';

import React from 'react';
import styled from 'styled-components';

const PanelContainer = styled.div`
  position: absolute;
  right: 0;
  top: 60px; /* Below toolbar */
  bottom: 0;
  width: 350px;
  background-color: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
  z-index: 100;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
`;

const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
`;

const FeedbackContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  
  p {
    margin: 0 0 16px;
    line-height: 1.5;
    color: #333;
  }
  
  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 24px 0 8px;
    color: #333;
  }
  
  ul {
    margin: 8px 0 24px;
    padding-left: 20px;
    
    li {
      margin-bottom: 8px;
      line-height: 1.5;
    }
  }
`;

interface FeedbackPanelProps {
  feedback: string;
  onClose: () => void;
}

export default function FeedbackPanel({ feedback, onClose }: FeedbackPanelProps) {
  // Function to format the feedback text with proper HTML structure
  const formatFeedback = () => {
    // Split the feedback into paragraphs
    const paragraphs = feedback.split('\n\n');
    
    return paragraphs.map((paragraph, index) => {
      // Check if this paragraph is a list
      if (paragraph.includes('\n- ')) {
        // Split by the first occurrence of a list item to get the heading and items
        const [heading, ...rest] = paragraph.split('\n- ');
        const listItems = ['- ' + rest.join('\n- ')].join('').split('\n- ');
        
        return (
          <React.Fragment key={index}>
            <h3>{heading.trim()}</h3>
            <ul>
              {listItems.map((item, itemIndex) => (
                <li key={itemIndex}>{item.replace('- ', '')}</li>
              ))}
            </ul>
          </React.Fragment>
        );
      }
      
      // Normal paragraph
      return <p key={index}>{paragraph}</p>;
    });
  };
  
  return (
    <PanelContainer>
      <PanelHeader>
        <h2>Design Feedback</h2>
        <CloseButton onClick={onClose} aria-label="Close feedback panel">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseButton>
      </PanelHeader>
      
      <FeedbackContent>
        {formatFeedback()}
      </FeedbackContent>
    </PanelContainer>
  );
}