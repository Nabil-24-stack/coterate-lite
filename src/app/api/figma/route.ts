import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseFigmaLink } from '@/lib/figma-api';

export async function POST(request: NextRequest) {
  try {
    // Get the user's session to access their Figma token
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const accessToken = session.accessToken;
    const { figmaLink } = await request.json();
    
    if (!figmaLink) {
      return NextResponse.json(
        { error: 'Figma link is required' },
        { status: 400 }
      );
    }
    
    // Parse the Figma link to get the file key and node ID
    const { fileKey, nodeId } = parseFigmaLink(figmaLink);
    
    if (!fileKey) {
      return NextResponse.json(
        { error: 'Invalid Figma link format' },
        { status: 400 }
      );
    }
    
    // First, fetch file data to verify access and get node information
    const fileResponse = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!fileResponse.ok) {
      const errorData = await fileResponse.json();
      return NextResponse.json(
        { error: 'Failed to access Figma file', details: errorData },
        { status: fileResponse.status }
      );
    }
    
    // If we have a node ID, fetch that specific node
    let nodeData;
    if (nodeId) {
      const nodesResponse = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${nodeId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!nodesResponse.ok) {
        const errorData = await nodesResponse.json();
        return NextResponse.json(
          { error: 'Failed to access node data', details: errorData },
          { status: nodesResponse.status }
        );
      }
      
      nodeData = await nodesResponse.json();
    }
    
    // Next, get image URLs for the selected node
    let images;
    if (nodeId) {
      const imagesResponse = await fetch(
        `https://api.figma.com/v1/images/${fileKey}?ids=${nodeId}&format=png&scale=2`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );
      
      if (!imagesResponse.ok) {
        const errorData = await imagesResponse.json();
        return NextResponse.json(
          { error: 'Failed to get image data', details: errorData },
          { status: imagesResponse.status }
        );
      }
      
      images = await imagesResponse.json();
    }
    
    // Construct our response with all the necessary design data
    const fileData = await fileResponse.json();
    
    const designData = {
      fileKey,
      nodeId,
      fileName: fileData.name,
      fileLastModified: fileData.lastModified,
      imageUrl: nodeId && images ? images.images[nodeId] : null,
      nodeData: nodeId && nodeData ? nodeData.nodes[nodeId] : null,
    };
    
    return NextResponse.json(designData);
  } catch (error) {
    console.error('Error handling Figma request:', error);
    return NextResponse.json(
      { error: 'Failed to process Figma data' },
      { status: 500 }
    );
  }
}