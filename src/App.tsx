import { useEffect, useRef } from 'react';
import { Engine } from './game/engine';
import { Overlays } from './components/Overlays';

export default function App() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const engine = new Engine(ref.current);
    return () => engine.dispose();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030308] select-none">
      <div ref={ref} className="absolute inset-0" />
      <Overlays />
    </div>
  );
}
