'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define a Page type
interface Page {
  id: string;
  name: string;
}

// Define the context type
interface PageContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  currentPage: Page | null;
  updatePage: (page: Page) => void;
}

// Create the context with default values
const PageContext = createContext<PageContextType>({
  isLoading: false,
  setIsLoading: () => {},
  currentPage: null,
  updatePage: () => {},
});

// Custom hook to use the context
export const usePageContext = () => useContext(PageContext);

// Provider component
export const PageContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page | null>({
    id: 'default-page',
    name: 'Default Page'
  });

  // The value that will be passed to consumers of this context
  const value = {
    isLoading,
    setIsLoading,
    currentPage,
    updatePage: (page: Page) => setCurrentPage(page),
  };

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
};