# Coterate Lite

A lightweight version of Coterate that allows users to:
1. Log in with email/password
2. Upload or paste design images to a canvas
3. Get AI-powered design feedback using GPT-4o

## Features

- Simple email/password authentication
- Canvas-like UI for design display
- Image upload via drag & drop, paste, or file browser
- GPT-4o design analysis
- Minimal and clean user interface

## Tech Stack

- Next.js
- TypeScript
- Next Auth (for authentication)
- Styled Components (for styling)
- OpenAI API (for GPT-4o integration)

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- OpenAI API Key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# OpenAI API
OPENAI_API_KEY=your-openai-api-key
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. Visit the application and log in with the demo account:
   - Email: user@example.com
   - Password: password123

2. Once logged in, you'll see a canvas interface where you can:
   - Drag and drop an image
   - Paste an image from clipboard (Ctrl+V / Cmd+V)
   - Click "Browse files" to select an image from your computer

3. After uploading an image, you can:
   - Pan the canvas by clicking and dragging
   - Zoom in/out using the toolbar buttons or mouse wheel
   - Reset the view using the Reset button

4. Click "Analyze Design" to get GPT-4o feedback on your design

5. The AI feedback will appear in a panel that you can show/hide as needed

## License

MIT