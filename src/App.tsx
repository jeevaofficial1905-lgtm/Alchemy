
import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Info, Atom, Thermometer, Weight, Layers, ChevronRight, X, ExternalLink } from 'lucide-react';
import { ELEMENTS, ElementData } from './constants';
import { BohrModel } from './components/BohrModel';

export default function App() {
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [activeShell, setActiveShell] = useState<number | null>(null);
  const [selectedElectron, setSelectedElectron] = useState<{ shell: number, index: number } | null>(null);

  const quantumNumbers = useMemo(() => {
    if (selectedElectron === null) return null;
    const { shell, index } = selectedElectron;
    const n = shell + 1;
    let l = 0;
    let ml = 0;
    const ms = index % 2 === 0 ? 0.5 : -0.5;

    // Simplified subshell distribution for visualization
    if (n === 1) {
      l = 0; ml = 0;
    } else if (n === 2) {
      if (index < 2) { l = 0; ml = 0; }
      else { l = 1; ml = ((index - 2) % 3) - 1; }
    } else if (n === 3) {
      if (index < 2) { l = 0; ml = 0; }
      else if (index < 8) { l = 1; ml = ((index - 2) % 3) - 1; }
      else { l = 2; ml = ((index - 8) % 5) - 2; }
    } else {
      if (index < 2) { l = 0; ml = 0; }
      else if (index < 8) { l = 1; ml = ((index - 2) % 3) - 1; }
      else if (index < 18) { l = 2; ml = ((index - 8) % 5) - 2; }
      else { l = 3; ml = ((index - 18) % 7) - 3; }
    }

    return { n, l, ml, ms };
  }, [selectedElectron]);

  const subshellIndices = useMemo(() => {
    if (selectedElectron === null || !quantumNumbers) return [];
    const { shell, index } = selectedElectron;
    const n = shell + 1;
    const l = quantumNumbers.l;
    
    const indices: number[] = [];
    
    // Logic to find all indices in the same shell that belong to the same subshell 'l'
    // This must match the logic in quantumNumbers useMemo
    if (n === 1) {
      // n=1 only has l=0 (2 electrons)
      indices.push(0, 1);
    } else if (n === 2) {
      if (l === 0) indices.push(0, 1);
      else indices.push(2, 3, 4, 5, 6, 7);
    } else if (n === 3) {
      if (l === 0) indices.push(0, 1);
      else if (l === 1) indices.push(2, 3, 4, 5, 6, 7);
      else indices.push(8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
    } else {
      if (l === 0) indices.push(0, 1);
      else if (l === 1) indices.push(2, 3, 4, 5, 6, 7);
      else if (l === 2) indices.push(8, 9, 10, 11, 12, 13, 14, 15, 16, 17);
      else indices.push(...Array.from({ length: 14 }, (_, i) => i + 18));
    }
    
    return indices.filter(i => i !== index); // Exclude the selected one
  }, [selectedElectron, quantumNumbers]);

  const categories = useMemo(() => {
    const cats = new Set(ELEMENTS.map(e => e.category));
    return Array.from(cats);
  }, []);

  const filteredElements = useMemo(() => {
    return ELEMENTS.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           e.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           e.number.toString() === searchQuery;
      const matchesCategory = !filterCategory || e.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, filterCategory]);

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black/5 overflow-x-hidden">
      {/* Subtle Background Grid */}
      <div className="fixed inset-0 pointer-events-none science-grid opacity-30" />

      {/* Header */}
      <header className="border-b border-black/[0.03] bg-white/90 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-black/[0.05] rounded-full flex items-center justify-center bg-black/[0.01]">
              <Atom className="text-black" size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-black">
                ELEMENTUM
              </h1>
              <p className="text-[9px] text-black/30 uppercase tracking-[0.3em] font-bold">Scientific Database v3.0</p>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-1 max-w-lg">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black/40 transition-colors" size={16} />
              <input 
                type="text"
                placeholder="Search by name, symbol, or number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/[0.02] border border-black/[0.05] rounded-full py-2.5 pl-12 pr-6 focus:outline-none focus:border-black/20 focus:bg-white transition-all text-sm placeholder:text-black/20"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-12 grid grid-cols-1 xl:grid-cols-12 gap-12">
        {/* Left Column: Periodic Table & Filters */}
        <div className="xl:col-span-8 space-y-12">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setFilterCategory(null)}
              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${!filterCategory ? 'bg-black text-white border-black' : 'text-black/30 border-black/[0.05] hover:border-black/10 hover:text-black'}`}
            >
              All
            </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border ${filterCategory === cat ? 'bg-black text-white border-black' : 'text-black/30 border-black/[0.05] hover:border-black/10 hover:text-black'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Periodic Table Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredElements.map((element) => (
              <motion.button
                layoutId={`element-${element.number}`}
                key={element.number}
                onClick={() => {
                  setSelectedElement(element);
                  setActiveShell(null);
                  setSelectedElectron(null);
                }}
                whileHover={{ y: -6 }}
                className={`relative rounded-xl border transition-all text-left group overflow-hidden flex flex-col ${
                  selectedElement?.number === element.number 
                    ? 'bg-white border-black/20 shadow-2xl scale-[1.02] z-10' 
                    : 'bg-white border-black/[0.03] hover:border-black/10 hover:shadow-xl'
                }`}
              >
                {/* Element Image */}
                <div className="aspect-square w-full relative overflow-hidden bg-gray-50">
                  <img 
                    src={`https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/images/${element.name.toLowerCase()}.jpg`}
                    alt={element.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${element.name.toLowerCase()}/400/400?grayscale`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-mono font-bold text-black/30">#{element.number}</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: element.color }} />
                  </div>
                </div>

                <div className="p-5 pt-3">
                  <div className="text-3xl font-black mb-1 tracking-tighter text-black">{element.symbol}</div>
                  <div className="text-[10px] text-black/40 uppercase tracking-[0.2em] truncate font-bold">{element.name}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Column: 3D Viewer & Details */}
        <div className="xl:col-span-4 xl:sticky xl:top-28 h-fit">
          <AnimatePresence mode="wait">
            {selectedElement ? (
              <motion.div
                key={selectedElement.number}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-black/[0.05] rounded-2xl overflow-hidden flex flex-col h-[800px] shadow-2xl relative"
              >
                {/* 3D Canvas */}
                <div className="relative h-[420px] bg-gray-50/50 border-b border-black/[0.03]">
                  <div className="absolute top-8 left-8 z-10">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-black/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-black/10 animate-pulse" />
                      Atomic Visualization
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedElement(null);
                      setSelectedElectron(null);
                    }}
                    className="absolute top-8 right-8 z-10 p-2 text-black/20 hover:text-black transition-colors bg-white/50 backdrop-blur-sm rounded-full"
                  >
                    <X size={20} />
                  </button>
                  
                  <Canvas dpr={[1, 2]}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <OrbitControls enableZoom={true} autoRotate={!activeShell && !selectedElectron} autoRotateSpeed={0.5} />
                    <ambientLight intensity={1} />
                    <pointLight position={[10, 10, 10]} intensity={2} />
                    <BohrModel 
                      shells={selectedElement.electron_shells} 
                      elementColor={selectedElement.color} 
                      activeShellIndex={activeShell}
                      selectedElectron={selectedElectron}
                      subshellIndices={subshellIndices}
                      onShellSelect={(idx) => {
                        setActiveShell(idx);
                        setSelectedElectron(null);
                      }}
                      onElectronSelect={(shell, index) => {
                        setSelectedElectron({ shell, index });
                        setActiveShell(shell);
                      }}
                    />
                    <Environment preset="studio" />
                    <ContactShadows position={[0, -5, 0]} opacity={0.1} scale={15} blur={3} far={6} color={selectedElement.color} />
                  </Canvas>

                  {/* Quantum Numbers HUD */}
                  <AnimatePresence>
                    {quantumNumbers && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute top-20 right-8 z-10 bg-white/80 backdrop-blur-xl border border-black/[0.05] p-5 rounded-xl min-w-[160px] shadow-xl"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/30">Quantum State</div>
                          <button onClick={() => setSelectedElectron(null)} className="text-black/20 hover:text-black">
                            <X size={12} />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-black/30 font-mono uppercase">n</span>
                            <span className="text-xs font-bold font-mono text-black">{quantumNumbers.n}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-black/30 font-mono uppercase">l</span>
                            <span className="text-xs font-bold font-mono text-black">
                              {quantumNumbers.l} <span className="text-black/30 ml-1">{['s', 'p', 'd', 'f'][quantumNumbers.l] || '?'}</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-black/30 font-mono uppercase">mₗ</span>
                            <span className="text-xs font-bold font-mono text-black">{quantumNumbers.ml}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-black/30 font-mono uppercase">mₛ</span>
                            <span className="text-xs font-bold font-mono text-black">{quantumNumbers.ms > 0 ? '+½' : '-½'}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Shell Selection HUD */}
                  <div className="absolute bottom-8 left-8 z-10">
                    <div className="flex gap-2">
                      {selectedElement.electron_shells.map((count, i) => (
                        <button 
                          key={i}
                          onClick={() => {
                            setActiveShell(activeShell === i ? null : i);
                            setSelectedElectron(null);
                          }}
                          className={`w-10 h-10 rounded-full text-[10px] font-bold border transition-all flex items-center justify-center ${activeShell === i ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-black/30 border-black/[0.05] hover:border-black/20 hover:text-black'}`}
                          title={`Shell ${i+1}: ${count} electrons`}
                        >
                          {['K', 'L', 'M', 'N', 'O', 'P', 'Q'][i] || i+1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <div className="text-[10px] font-bold text-black/20 uppercase tracking-[0.3em] mb-2">Atomic Profile</div>
                      <h2 className="text-4xl font-black tracking-tighter text-black">{selectedElement.name}</h2>
                    </div>
                    <div className="text-6xl font-black text-black/[0.03] select-none font-mono">{selectedElement.symbol}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-10">
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-black/20 font-bold uppercase tracking-widest">Atomic Mass</div>
                      <div className="text-sm font-mono font-bold text-black">{selectedElement.atomic_mass} <span className="text-black/30 font-normal">u</span></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-black/20 font-bold uppercase tracking-widest">Phase</div>
                      <div className="text-sm font-mono font-bold uppercase text-black">{selectedElement.phase}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-black/20 font-bold uppercase tracking-widest">Configuration</div>
                      <div className="text-sm font-mono font-bold truncate text-black">{selectedElement.electron_configuration}</div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-black/20 font-bold uppercase tracking-widest">Position</div>
                      <div className="text-sm font-mono font-bold text-black">G{selectedElement.group} P{selectedElement.period}</div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="p-6 bg-black/[0.01] border border-black/[0.03] rounded-xl">
                      <p className="text-xs text-black/50 leading-relaxed font-medium">
                        {selectedElement.summary}
                      </p>
                    </div>
                    
                    <div className="flex gap-4">
                      <button className="flex-1 py-4 bg-black hover:bg-black/90 text-white font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 rounded-full">
                        View Full Data
                        <ChevronRight size={14} />
                      </button>
                      <button className="w-14 h-14 rounded-full border border-black/[0.05] hover:bg-black/[0.02] transition-colors flex items-center justify-center">
                        <ExternalLink size={16} className="text-black/30" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[800px] border border-black/[0.03] bg-black/[0.005] rounded-2xl flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 border border-black/[0.03] rounded-full flex items-center justify-center mb-8 bg-white shadow-sm">
                  <Atom className="text-black/10" size={40} strokeWidth={1} />
                </div>
                <h3 className="text-xs font-bold mb-3 tracking-[0.3em] text-black/30 uppercase">Select Element</h3>
                <p className="text-[10px] text-black/20 max-w-[240px] uppercase leading-relaxed tracking-[0.2em] font-medium">
                  Choose a chemical element from the grid to begin comprehensive atomic analysis.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="border-t border-black/[0.03] py-16 mt-24">
        <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12 opacity-30">
          <div className="flex items-center gap-4">
            <Atom size={20} className="text-black" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black">Elementum Core Database</span>
          </div>
          <div className="flex gap-12 text-[10px] uppercase tracking-[0.3em] font-bold text-black">
            <span className="cursor-default">v3.0.0</span>
            <span className="cursor-default">Science Archive</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
