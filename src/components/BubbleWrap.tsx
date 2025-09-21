import React, { useState, useEffect, useRef } from "react";
import "./BubbleWrap.css"; // put the CSS below into a separate file

interface BubbleProps {
  id: number;
  playSound: () => void;
}

const Bubble: React.FC<BubbleProps> = ({ id, playSound }) => {
  const [popped, setPopped] = useState(false);
  const timerRef = useRef<number | null>(null);

  const pop = () => {
    if (popped) return;
    setPopped(true);
    playSound();

    // respawn after 5–10 seconds
    const delay = 5000 + Math.random() * 5000;
    timerRef.current = window.setTimeout(() => setPopped(false), delay);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <button
      className={`bubble ${popped ? "popped" : ""}`}
      onPointerDown={pop}
      onPointerEnter={(e) => e.buttons === 1 && pop()}
    />
  );
};

export const BubbleWrap: React.FC = () => {
  const [rows, setRows] = useState(6);
  const [cols, setCols] = useState(10);
  const [size, setSize] = useState(64);
  const [soundOn, setSoundOn] = useState(true);
  const [poppedCount, setPoppedCount] = useState(0);
  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = () => {
    if (!soundOn) return;
    if (!audioCtx.current) audioCtx.current = new AudioContext();
    const ctx = audioCtx.current;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 900;
    gain.connect(filter);
    filter.connect(ctx.destination);

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 800;
    osc.connect(gain);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.4, now + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.start(now);
    osc.stop(now + 0.11);

    setPoppedCount((c) => c + 1);
  };

  const bubbles = Array.from({ length: rows * cols }, (_, i) => i);

  return (
    <div className="app" style={{ "--bubble-size": `${size}px` } as React.CSSProperties}>
      <header className="header">
        <h1>Bubble Wrap — Stress Buster</h1>
        <div className="controls">
          <span>Popped: {poppedCount}</span>
          <button onClick={() => setSoundOn((s) => !s)}>
            {soundOn ? "Sound: On" : "Sound: Off"}
          </button>
        </div>
      </header>

      <div
        className="bubble-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(var(--bubble-size), 1fr))` }}
      >
        {bubbles.map((id) => (
          <Bubble key={id} id={id} playSound={playSound} />
        ))}
      </div>

      <div className="sliders">
        <label>
          Rows: {rows}
          <input type="range" min={3} max={14} value={rows} onChange={(e) => setRows(+e.target.value)} />
        </label>
        <label>
          Columns: {cols}
          <input type="range" min={4} max={20} value={cols} onChange={(e) => setCols(+e.target.value)} />
        </label>
        <label>
          Bubble Size: {size}px
          <input type="range" min={38} max={96} value={size} onChange={(e) => setSize(+e.target.value)} />
        </label>
      </div>
    </div>
  );
};

export default BubbleWrap;