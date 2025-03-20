# Bolt.new Hackathon Terminal

An interactive terminal interface for the World's Largest Hackathon by Bolt.new.

## Features

- Interactive terminal interface with command history
- Sound effects for typing and command execution
- Modal windows for different sections (About, Register, Prizes, etc.)
- Responsive design for all screen sizes
- TypeScript support for better development experience

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add sound files to the public directory:
   - Create a `sounds` directory in `public`
   - Add `beep-01a.wav` and `beep-02.wav` to the `sounds` directory

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Commands

- `help` - Show available commands
- `about` - Information about the hackathon
- `register` - Register for the hackathon
- `prizes` - View prize information
- `judges` - View judges
- `sponsors` - View sponsors
- `participants` - View current participant count
- `tweets` - View latest tweets
- `faq` - Frequently asked questions
- `surprise` - A surprise command
- `clear` - Clear the terminal
- `hack` - A fun number guessing game

## Development

- Built with Next.js 14 and TypeScript
- Uses CSS Modules for styling
- Follows accessibility best practices
- Optimized for performance

## License

MIT
