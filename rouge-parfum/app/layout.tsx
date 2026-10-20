import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'ROUGE — L’impatience a un parfum', description: 'Une présence. Une obsession. Découvrez ROUGE, le nouveau parfum. Rendez-vous le 24 décembre 2026.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="fr"><body>{children}</body></html> }
