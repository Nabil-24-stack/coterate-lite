// Define the base Page type
export interface Page {
  id: string;
  name: string;
  baseImage?: string;
  iteratedImage?: string;
  user_id?: string;
}

// Define a context type for the Page context
export interface PageContextType {
  pages: Page[];
  currentPage: Page | null;
  addPage: (name: string) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  setCurrentPage: (page: Page) => void;
  renamePage: (id: string, newName: string) => void;
}

// Define Design Iteration type
export interface DesignIteration {
  id: string;
  image: string;
  label: string;
  iterationType: 'base' | 'improved';
  iterationNumber: number;
  analysis?: string;
  position?: { x: number; y: number };
  components?: DetectedComponent[];
}

// Define Component type
export interface DetectedComponent {
  id: string;
  type: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  attributes: Record<string, any>;
}