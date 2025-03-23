'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { usePageContext } from '../contexts/PageContext';
import { Page } from '../types';

const SidebarContainer = styled.div`
  width: 230px;
  height: calc(100% - 60px);
  margin-top: 60px; /* Start below the header */
  border-right: 1px solid #E3E6EA;
  border-top: 2px solid #E3E6EA; /* Increased border width for visibility */
  background-color: #F8F8F8;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 10;
  box-shadow: inset 0 1px 0 #E3E6EA; /* Add inset shadow to reinforce top border */
`;

const TopBorder = styled.div`
  height: 1px;
  width: 100%;
  background-color: #E3E6EA;
  position: absolute;
  top: 0;
  left: 0;
`;

const NewPageButton = styled.button`
  margin: 16px;
  padding: 10px 15px;
  background-color: white;
  color: #333;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s;
  width: calc(100% - 32px);
  text-align: center;
  border: 1px solid #E3E6EA;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: 'Plus Jakarta Sans', sans-serif;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const PageList = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-top: 8px;
`;

const PageItem = styled.div<{ isActive: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${props => props.isActive ? '#EFEFEF' : 'transparent'};
  position: relative;
  
  &:hover {
    background-color: ${props => props.isActive ? '#EFEFEF' : 'rgba(0, 0, 0, 0.03)'};
  }
`;

const PageName = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  color: #333;
  font-size: 14px;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const MoreButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: #666;
  padding: 2px 8px;
  opacity: 0.5;
  
  &:hover {
    opacity: 1;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
  min-width: 150px;
  margin-top: 5px;
  border: 1px solid #E3E6EA;
`;

const MenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  font-family: 'Plus Jakarta Sans', sans-serif;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &.delete {
    color: #e53935;
    
    &:hover {
      background-color: #ffebee;
    }
  }
`;

// Inline edit input
const EditInput = styled.input`
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #4A90E2;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  background-color: white;
  font-family: 'Plus Jakarta Sans', sans-serif;
  
  &:focus {
    outline: none;
  }
`;

const UserProfileContainer = styled.div`
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid #E3E6EA;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 100;
  width: 100%;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #4A90E2;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

interface DropdownProps {
  pageId: string;
  pageName: string;
  onClose: () => void;
  onRename: (id: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ pageId, pageName, onClose, onRename }) => {
  const { deletePage } = usePageContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleDelete = () => {
    deletePage(pageId);
    onClose();
  };
  
  const handleRename = () => {
    onRename(pageId);
    onClose();
  };
  
  return (
    <DropdownMenu ref={dropdownRef}>
      <MenuItem onClick={handleRename}>
        Rename Page
      </MenuItem>
      <MenuItem className="delete" onClick={handleDelete}>
        Delete Page
      </MenuItem>
    </DropdownMenu>
  );
};

export const Sidebar: React.FC = () => {
  const { pages, currentPage, setCurrentPage, addPage, renamePage } = usePageContext();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPageName, setEditingPageName] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);
  
  const toggleMenu = (pageId: string) => {
    setOpenMenuId(openMenuId === pageId ? null : pageId);
  };
  
  const closeMenu = () => {
    setOpenMenuId(null);
  };
  
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>, page: Page) => {
    // Don't change page if we're editing
    if (editingPageId) return;
    
    e.preventDefault();
    setCurrentPage(page);
  };
  
  const handleAddPage = () => {
    // Add a new page with the default name
    addPage("New Page");
  };
  
  const startEditing = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setEditingPageId(pageId);
      setEditingPageName(page.name);
      // Focus the input after it's rendered
      setTimeout(() => {
        if (editInputRef.current) {
          editInputRef.current.focus();
          editInputRef.current.select();
        }
      }, 10);
    }
  };
  
  const savePageName = () => {
    if (editingPageId && editingPageName.trim()) {
      renamePage(editingPageId, editingPageName.trim());
      cancelEditing();
    }
  };
  
  const cancelEditing = () => {
    setEditingPageId(null);
    setEditingPageName('');
  };
  
  // Handle clicks outside the editing input
  useEffect(() => {
    if (!editingPageId) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (editInputRef.current && !editInputRef.current.contains(event.target as Node)) {
        cancelEditing();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingPageId]);

  return (
    <SidebarContainer>
      <TopBorder />
      <NewPageButton onClick={handleAddPage}>
        New Page
      </NewPageButton>
      <PageList>
        {pages.map(page => (
          <PageItem 
            key={page.id}
            isActive={currentPage?.id === page.id}
            onClick={(e) => handlePageClick(e, page)}
          >
            <PageName>
              {editingPageId === page.id ? (
                <EditInput
                  ref={editInputRef}
                  type="text"
                  value={editingPageName}
                  onChange={(e) => setEditingPageName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      savePageName();
                    } else if (e.key === 'Escape') {
                      cancelEditing();
                    }
                  }}
                />
              ) : (
                page.name
              )}
              {editingPageId !== page.id && (
                <MoreButtonContainer>
                  <MoreButton onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent click 
                    toggleMenu(page.id);
                  }}>
                    •••
                  </MoreButton>
                  {openMenuId === page.id && (
                    <Dropdown 
                      pageId={page.id}
                      pageName={page.name}
                      onClose={closeMenu}
                      onRename={startEditing}
                    />
                  )}
                </MoreButtonContainer>
              )}
            </PageName>
          </PageItem>
        ))}
      </PageList>
      
      <UserProfileContainer>
        <UserProfile>
          <UserAvatar>C</UserAvatar>
          <div>Coterate User</div>
        </UserProfile>
      </UserProfileContainer>
    </SidebarContainer>
  );
};