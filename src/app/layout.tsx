import './globals.css';

export const metadata = {
  title: 'Bolt.new Hackathon Terminal',
  description: 'Interactive terminal for the World\'s Largest Hackathon',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
