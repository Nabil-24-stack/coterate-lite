// This file is deprecated and will be removed in the future.
// The application no longer uses Figma API integration.

// A stub function to prevent import errors during the transition
export function parseFigmaLink(link: string): { fileKey: string; nodeId: string | null } {
  console.warn('parseFigmaLink is deprecated and will be removed');
  return {
    fileKey: '',
    nodeId: null
  };
}