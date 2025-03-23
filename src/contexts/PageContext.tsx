'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the context type
interface PageContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

// Create the context with default values
const PageContext = createContext<PageContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

// Custom hook to use the context
export const usePageContext = () => useContext(PageContext);

// Provider component
export const PageContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  // The value that will be passed to consumers of this context
  const value = {
    isLoading,
    setIsLoading,
  };

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
};