# Coterate Lite

A lightweight version of Coterate that allows users to:
1. Log in with their Figma account
2. Paste a Figma design link
3. View their design on a canvas
4. Get AI-powered design feedback using GPT-4o

## Features

- Figma OAuth authentication
- Canvas-like UI for design display
- GPT-4o design analysis
- Minimal and clean user interface

## Tech Stack

- Next.js
- TypeScript
- Next Auth (for Figma authentication)
- Styled Components (for styling)
- OpenAI API (for GPT-4o integration)

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Figma Developer Account
- OpenAI API Key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Figma API
NEXT_PUBLIC_FIGMA_CLIENT_ID=your_figma_client_id
FIGMA_CLIENT_SECRET=your_figma_client_secret
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# OpenAI API
OPENAI_API_KEY=your_openai_api_key
```

### Figma App Setup

1. Create a Figma app at [https://www.figma.com/developers/apps](https://www.figma.com/developers/apps)
2. Set the redirect URI to `http://localhost:3000/api/auth/callback/figma` 
3. Copy the Client ID and Client Secret to your `.env.local` file

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. Visit the application and log in with your Figma account
2. Once logged in, you'll see a canvas interface
3. Paste a Figma design link (using "Copy link to selection" from Figma)
4. Your design will appear on the canvas
5. Click "Analyze Design" to get GPT-4o feedback

## License

MIT