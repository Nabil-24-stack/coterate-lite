import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Page, PageContextType } from '../types';

// Create the context with a default value
const PageContext = createContext<PageContextType>({
  pages: [],
  currentPage: null,
  addPage: () => {},
  updatePage: () => {},
  deletePage: () => {},
  setCurrentPage: () => {},
  renamePage: () => {}
});

// Custom hook to use the context
export const usePageContext = () => useContext(PageContext);

// Provider component
export const PageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for pages
  const [pages, setPages] = useState<Page[]>([]);
  
  // State for current page
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  
  // Initialize with a default page on mount
  useEffect(() => {
    // Create a default page if none exist
    const defaultPage: Page = {
      id: uuidv4(),
      name: 'Default Page',
      baseImage: 'https://via.placeholder.com/800x600?text=Paste+Your+UI+Design'
    };
    
    setPages([defaultPage]);
    setCurrentPage(defaultPage);
  }, []);
  
  // Add a new page
  const addPage = (name: string) => {
    const newPage: Page = {
      id: uuidv4(),
      name: name || `Page ${pages.length + 1}`,
      baseImage: 'https://via.placeholder.com/800x600?text=Paste+Your+UI+Design'
    };
    
    setPages(prevPages => [...prevPages, newPage]);
    setCurrentPage(newPage);
  };
  
  // Update a page
  const updatePage = (id: string, updates: Partial<Page>) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === id ? { ...page, ...updates } : page
      )
    );
    
    // Update current page if it's the one being updated
    if (currentPage && currentPage.id === id) {
      setCurrentPage(prevPage => ({
        ...prevPage!,
        ...updates
      }));
    }
  };
  
  // Delete a page
  const deletePage = (id: string) => {
    const newPages = pages.filter(page => page.id !== id);
    setPages(newPages);
    
    // If the deleted page was the current page, set a new current page
    if (currentPage && currentPage.id === id) {
      if (newPages.length > 0) {
        setCurrentPage(newPages[0]);
      } else {
        setCurrentPage(null);
      }
    }
  };
  
  // Rename a page
  const renamePage = (id: string, newName: string) => {
    updatePage(id, { name: newName });
  };
  
  return (
    <PageContext.Provider
      value={{
        pages,
        currentPage,
        addPage,
        updatePage,
        deletePage,
        setCurrentPage,
        renamePage
      }}
    >
      {children}
    </PageContext.Provider>
  );
};