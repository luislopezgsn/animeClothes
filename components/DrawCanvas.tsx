"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Eraser, Pen, RotateCcw } from 'lucide-react';

export default function DrawCanvas({ onCapture }: { onCapture: (dataUrl: string) => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ffffff');
    const [lineWidth, setLineWidth] = useState(4);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set resolution
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        }
    }, []);

    const getCtx = () => canvasRef.current?.getContext('2d');

    const start = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const ctx = getCtx();
        if (!ctx) return;
        ctx.beginPath();
        const { x, y } = getPos(e);
        ctx.moveTo(x, y);
    };

    const move = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const ctx = getCtx();
        if (!ctx) return;
        const { x, y } = getPos(e);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const end = () => {
        setIsDrawing(false);
        if (canvasRef.current) {
            onCapture(canvasRef.current.toDataURL());
        }
    };

    const getPos = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const clear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex gap-2 mb-2">
                <button onClick={() => setColor('#ffffff')} className={`p-2 rounded-full border ${color === '#ffffff' ? 'border-primary' : 'border-transparent'}`} style={{ background: 'white' }} />
                <button onClick={() => setColor('#ef4444')} className="p-2 rounded-full bg-red-500" />
                <button onClick={() => setColor('#3b82f6')} className="p-2 rounded-full bg-blue-500" />
                <button onClick={() => setColor('#22c55e')} className="p-2 rounded-full bg-green-500" />
                <div className="flex-1" />
                <button onClick={clear} className="p-2 text-white hover:text-red-400"><RotateCcw size={20} /></button>
            </div>
            <canvas
                ref={canvasRef}
                className="flex-1 w-full bg-slate-900/50 rounded-xl border border-white/10 touch-none cursor-crosshair"
                onMouseDown={start}
                onMouseMove={move}
                onMouseUp={end}
                onMouseLeave={end}
                onTouchStart={start}
                onTouchMove={move}
                onTouchEnd={end}
            />
            <p className="text-xs text-center text-slate-400">Draw the character or outfit here</p>
        </div>
    );
}
