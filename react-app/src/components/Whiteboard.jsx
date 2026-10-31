import React, { useRef, useEffect, useState } from 'react';
import { Palette, RotateCcw, Trash2, Save, Maximize } from 'lucide-react';

export default function Whiteboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [color, setColor] = useState('#000000');
  const [width, setWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctxRef.current = ctx;

    // Set canvas size to match display
    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [color, width]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const ctx = ctxRef.current;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = ctxRef.current;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvas = () => {
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="card p-4 flex flex-col h-full">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="flex gap-2">
          {['#000000', '#e11d48', '#16a34a', '#2563eb', '#7c3aed', '#f59e0b'].map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-6 h-6 rounded-full border ${c === color ? 'ring-2 ring-offset-2' : ''}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Qalinlik:</span>
          <input
            type="range"
            min="1"
            max="20"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-24 accent-[var(--brand)]"
          />
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={clearCanvas} className="text-xs px-3 py-1 border rounded hover:bg-red-50" title="Tozalash">
            <Trash2 size={16} />
          </button>
          <button onClick={saveCanvas} className="text-xs px-3 py-1 border rounded hover:bg-[var(--bg)]" title="Saqlash">
            <Save size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-white border border-line rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="w-full h-full cursor-crosshair"
        />
      </div>
    </div>
  );
}