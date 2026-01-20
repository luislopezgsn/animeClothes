"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PenTool, Upload, Type, Search, ShoppingBag, Loader2 } from 'lucide-react';
import DrawCanvas from './DrawCanvas';

type Result = {
    title: string;
    price: string;
    imageUrl: string;
    link: string;
    source: string;
};

export default function AppInterface() {
    const [activeTab, setActiveTab] = useState<'draw' | 'upload' | 'text'>('text');
    const [searchQuery, setSearchQuery] = useState('');
    const [imageData, setImageData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Result[]>([]);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        setLoading(true);
        setError('');
        setResults([]);

        try {
            let body;
            if (activeTab === 'text') {
                if (!searchQuery.trim()) throw new Error('Please enter a character name');
                body = { query: searchQuery, type: 'text' };
            } else {
                // Mocking image search logic if no image provided or just generic
                // In real app, we'd send imageData
                body = { query: 'Anime Character Clothes', type: 'image' };
            }

            const res = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Search failed');

            setResults(data.results || []);
        } catch (err) {
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setImageData(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="glass p-1 rounded-full flex space-x-2">
                    {['draw', 'upload', 'text'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-6 py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === tab
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'hover:bg-white/10 text-slate-300'
                                }`}
                        >
                            {tab === 'draw' && <PenTool size={18} />}
                            {tab === 'upload' && <Upload size={18} />}
                            {tab === 'text' && <Type size={18} />}
                            <span className="capitalize">{tab}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="glass rounded-2xl p-6 min-h-[400px] flex flex-col">
                    <AnimatePresence mode="wait">
                        {activeTab === 'draw' && (
                            <motion.div
                                key="draw"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex-1"
                            >
                                <DrawCanvas onCapture={setImageData} />
                            </motion.div>
                        )}

                        {activeTab === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl hover:border-primary/50 transition-colors"
                            >
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                    {imageData ? (
                                        <img src={imageData} alt="Preview" className="max-h-64 rounded-lg shadow-lg mb-4" />
                                    ) : (
                                        <div className="bg-white/5 p-4 rounded-full mb-4">
                                            <Upload size={32} className="text-primary" />
                                        </div>
                                    )}
                                    <span className="text-lg font-medium">Click to upload image</span>
                                </label>
                            </motion.div>
                        )}

                        {activeTab === 'text' && (
                            <motion.div
                                key="text"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex-1 flex flex-col items-center justify-center"
                            >
                                <div className="w-full max-w-sm">
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Anime Character Name</label>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="e.g. Naruto Uzumaki"
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="mt-6 w-full bg-gradient-to-r from-primary to-secondary py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Search />}
                        Find Clothes
                    </button>

                    {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                </div>

                {/* Results Section */}
                <div className="glass rounded-2xl p-6 min-h-[400px] max-h-[600px] overflow-y-auto custom-scrollbar">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ShoppingBag className="text-secondary" />
                        Where to Buy
                    </h3>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <div className="h-2 w-24 bg-primary rounded-full animate-bounce" />
                            <p className="text-slate-400 animate-pulse">Scanning the multiverse...</p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {results.map((item, i) => (
                                <motion.a
                                    key={i}
                                    href={item.link}
                                    target="_blank"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-900/40 rounded-xl p-3 hover:bg-slate-800/60 transition-colors group"
                                >
                                    <div className="aspect-square rounded-lg overflow-hidden mb-3">
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">{item.title}</h4>
                                    <div className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1">
                                        <span className="text-secondary font-bold">{item.price}</span>
                                        <span className="text-xs text-slate-400">{item.source}</span>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p>Results will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
