// Function to fetch a Figma file with a specific file key
export async function getFigmaFile(fileKey: string, accessToken: string) {
  try {
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Figma file: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Figma file:', error);
    throw error;
  }
}

// Function to fetch specific nodes from a Figma file
export async function getFigmaNodes(fileKey: string, nodeIds: string[], accessToken: string) {
  try {
    const nodeIdsParam = nodeIds.join(',');
    const response = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeIdsParam}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Figma nodes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Figma nodes:', error);
    throw error;
  }
}

// Function to get image URLs for nodes
export async function getFigmaImages(fileKey: string, nodeIds: string[], accessToken: string, format: 'jpg' | 'png' | 'svg' | 'pdf' = 'png', scale: number = 2) {
  try {
    const nodeIdsParam = nodeIds.join(',');
    const response = await fetch(`https://api.figma.com/v1/images/${fileKey}?ids=${nodeIdsParam}&format=${format}&scale=${scale}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Figma images: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Figma images:', error);
    throw error;
  }
}

// Function to parse a Figma link and extract file key and node ID
export function parseFigmaLink(link: string): { fileKey: string; nodeId: string | null } {
  // Example link formats:
  // https://www.figma.com/file/abcdef123456/FileName?node-id=123%3A456
  // https://www.figma.com/file/abcdef123456/FileName

  try {
    const url = new URL(link);
    const pathParts = url.pathname.split('/');
    
    // Check if this is a valid Figma file link
    if (pathParts[1] !== 'file') {
      throw new Error('Not a valid Figma file link');
    }
    
    // Extract the file key (the third part of the pathname)
    const fileKey = pathParts[2];
    
    // Extract node ID from the query parameters if it exists
    const nodeIdParam = url.searchParams.get('node-id');
    
    return {
      fileKey,
      nodeId: nodeIdParam,
    };
  } catch (error) {
    console.error('Error parsing Figma link:', error);
    throw new Error('Invalid Figma link format');
  }
}