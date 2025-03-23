export interface Page {
  id: string;
  name: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface DesignIteration {
  id: string;
  name: string;
  pageId: string;
  imageUrl: string;
  position: Position;
  timestamp: string;
  feedback: string | null;
}