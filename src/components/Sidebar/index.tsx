'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #1e1e1e;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #333;
`;

const Logo = styled.div`
  width: 32px;
  height: 32px;
  background-color: #4A90E2;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
`;

const AppName = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const UserSection = styled.div`
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #333;
  margin-top: auto;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #4A90E2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
`;

const UserDetails = styled.div`
  flex: 1;
  overflow: hidden;
  
  h3 {
    font-size: 14px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  p {
    font-size: 12px;
    color: #aaa;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: #aaa;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: #aaa;
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  color: #666;
  margin-top: 50px;
  
  svg {
    margin-bottom: 16px;
    color: #444;
  }
  
  p {
    font-size: 14px;
    margin: 0;
  }
`;

function Sidebar() {
  const { data: session } = useSession();
  
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <SidebarContainer>
      <SidebarHeader>
        <Logo>C</Logo>
        <AppName>Coterate Lite</AppName>
      </SidebarHeader>
      
      <MainContent>
        <SectionTitle>Projects</SectionTitle>
        
        <EmptyState>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
          </svg>
          <p>Your projects will<br />appear here</p>
        </EmptyState>
      </MainContent>
      
      <UserSection>
        <UserInfo>
          <Avatar>{getInitials(session?.user?.name)}</Avatar>
          <UserDetails>
            <h3>{session?.user?.name || 'User'}</h3>
            <p>{session?.user?.email || 'user@example.com'}</p>
          </UserDetails>
        </UserInfo>
        
        <LogoutButton onClick={handleLogout}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </LogoutButton>
      </UserSection>
    </SidebarContainer>
  );
}

// Export both as default and named export
export { Sidebar };
export default Sidebar;