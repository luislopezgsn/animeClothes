import AppInterface from '@/components/AppInterface';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AnimeFit | Find Your Character Style',
  description: 'Draw or upload an anime character and find where to buy their clothes.',
};

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px]" />
      </div>

      <header className="text-center mb-16 relative">
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
          <span className="text-white">Anime</span>
          <span className="text-gradient">Fit</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The ultimate AI-powered fashion finder for cosplayers and fans.
          <span className="block text-slate-400 text-base mt-2">Draw, upload, or name a character to steal their look.</span>
        </p>
      </header>

      <AppInterface />

      <footer className="mt-auto pt-20 text-center text-slate-600 text-sm">
        <p>&copy; 2026 AnimeFit Labs. Powered by Next.js & Playwright.</p>
      </footer>
    </main>
  );
}
