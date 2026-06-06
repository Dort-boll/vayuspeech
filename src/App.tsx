/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Download, 
  RotateCcw, 
  Eraser, 
  Trash2, 
  Clock, 
  Volume2, 
  Info, 
  Film, 
  Megaphone, 
  Globe, 
  Trophy, 
  Sprout, 
  Podcast, 
  GraduationCap, 
  BookOpen,
  Ghost,
  Zap,
  Skull,
  Bot,
  Baby,
  Flame,
  Moon,
  FastForward,
  Wand2,
  Mic2,
  AlertCircle,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Constants ---

const CHARACTERS = [
  { id: 'morgan', name: 'Morgan', role: 'Movie Trailer', icon: Film, color: '#c42020', desc: 'Deep, authoritative, cinematic', p: 0.5, r: 0.78, v: 0.92, script: "In a world where silence speaks louder than words... one voice will rise above the noise. This summer, experience the story that will change everything you thought you knew. The battle begins. Are you ready to witness the unthinkable?" },
  { id: 'aria', name: 'Aria', role: 'Commercial', icon: Megaphone, color: '#d08818', desc: 'Warm, engaging, persuasive', p: 1.15, r: 1.0, v: 0.85, script: "Discover the difference that quality makes. Introducing our all-new premium collection, designed for those who refuse to settle for ordinary. Visit us online or in store today. Because you deserve nothing less than extraordinary." },
  { id: 'dochayes', name: 'Dr. Hayes', role: 'Documentary', icon: Globe, color: '#0c8878', desc: 'Calm, measured, knowledgeable', p: 0.8, r: 0.82, v: 0.78, script: "Deep beneath the ocean surface, where sunlight never reaches, an entirely different world exists. Here, creatures have evolved in ways that challenge our fundamental understanding of life itself. This is the story of the deep." },
  { id: 'flash', name: 'Flash', role: 'Sports / News', icon: Trophy, color: '#d06010', desc: 'High energy, fast-paced', p: 1.35, r: 1.25, v: 0.95, script: "And there it is! An absolutely incredible performance! In the final seconds of the match, he breaks through the defense and delivers the winning goal! The crowd goes absolutely wild! This is what legends are made of!" },
  { id: 'sage', name: 'Sage', role: 'Meditation', icon: Sprout, color: '#18a048', desc: 'Soft, soothing, calming', p: 0.65, r: 0.6, v: 0.55, script: "Close your eyes. Take a deep breath in... and slowly release. Feel the tension leaving your body with each exhale. You are safe. You are present. Let the stillness wash over you like a gentle wave." },
  { id: 'nova', name: 'Nova', role: 'Podcast Host', icon: Podcast, color: '#c02868', desc: 'Bright, conversational', p: 1.2, r: 1.08, v: 0.85, script: "Hey everyone, welcome back to the show! Today we are diving into something I have been really excited to talk about. You know that feeling when everything just clicks into place? That is exactly what we are exploring today." },
  { id: 'profatlas', name: 'Prof. Atlas', role: 'Educational', icon: GraduationCap, color: '#0c68a0', desc: 'Clear, articulate, paced', p: 0.95, r: 0.88, v: 0.8, script: "Let us begin by understanding the fundamental principle at work here. When we observe this process closely, we notice a consistent pattern emerging. This pattern, first documented in the early twentieth century, remains central to our understanding." },
  { id: 'shadow', name: 'Shadow', role: 'Audiobook', icon: BookOpen, color: '#805818', desc: 'Mysterious, dramatic', p: 0.6, r: 0.72, v: 0.72, script: "The old house stood at the end of the lane, its windows like empty eyes staring into the gathering dark. No one had lived there for thirty years. Yet tonight, a faint light flickered in the attic window. And somewhere deep within, a door creaked slowly open." }
];

const TEMPLATES = [
  { label: 'Product Launch', text: 'Introducing the future of innovation. After years of research and development, we are proud to unveil a product that will redefine your expectations. Available now at select retailers and online.' },
  { label: 'Corporate Intro', text: 'Welcome to our annual review. Today we will be covering our key achievements, strategic milestones, and the roadmap that will guide us through the next fiscal year.' },
  { label: 'Radio Ad', text: 'Tired of the same old routine? Break free with something extraordinary. Call now or visit our website for an exclusive limited-time offer. Your new beginning starts today.' },
  { label: 'News Anchor', text: 'Good evening. Tonight we begin with breaking news from the capital, where lawmakers have reached a tentative agreement on the proposed infrastructure bill. We go now to our correspondent on the scene.' },
  { label: 'Audiobook Opening', text: 'Chapter One. The morning fog clung to the cobblestones like a whisper refusing to be silenced. In the distance, the cathedral bell struck six, its resonance carrying across the empty square.' },
  { label: 'Meditation', text: 'Allow your thoughts to drift like clouds across an endless sky. You do not need to hold onto any of them. Simply observe, and let them pass. Breathe in peace. Breathe out tension.' },
  { label: 'Trailer', text: 'They said it could not be done. They said the odds were impossible. But in the darkest hour, one hero will rise. This Christmas, witness the event that will shake the world.' },
  { label: 'Tutorial', text: 'In this lesson, we will walk through the process step by step. Do not worry if it seems complex at first. By the end, you will have a complete understanding of how everything connects.' }
];

const EFFECTS = [
  { id: 'deep', icon: Ghost, label: 'Deep', p: 0.5, r: 0.6, title: 'Very deep and slow' },
  { id: 'chipmunk', icon: Zap, label: 'Chipmunk', p: 1.6, r: 1.3, title: 'High and fast' },
  { id: 'monster', icon: Skull, label: 'Monster', p: 0.3, r: 0.5, title: 'Extremely deep' },
  { id: 'robot', icon: Bot, label: 'Robot', p: 1.4, r: 0.7, title: 'Slow and high' },
  { id: 'speed', icon: Flame, label: 'Speed', p: 0.7, r: 1.4, title: 'Fast and low' },
  { id: 'child', icon: Baby, label: 'Child', p: 1.8, r: 1.0, title: 'Very high pitch' },
  { id: 'darth', icon: Moon, label: 'Darth', p: 0.1, r: 0.3, title: 'Ultra deep and slow' },
  { id: 'hyper', icon: FastForward, label: 'Hyper', p: 2.0, r: 2.5, title: 'Maximum speed' },
  { id: 'drone', icon: Moon, label: 'Drone', p: 1.0, r: 0.4, title: 'Very slow normal' }
];

// --- Helper Functions ---

function formatTime(s: number) {
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

function getWordCount(t: string) {
  return t.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function estimateDuration(t: string, r: number) {
  const w = getWordCount(t);
  if (!w) return 0;
  return (w / 155) / Math.max(0.1, r) * 60;
}

// --- Components ---

export default function App() {
  // State
  const [script, setScript] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [pitch, setPitch] = useState(1.0);
  const [rate, setRate] = useState(1.0);
  const [volume, setVolume] = useState(0.8);
  const [selectedChar, setSelectedChar] = useState<typeof CHARACTERS[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'voice' | 'lang' | 'fx'>('voice');
  const [langFilter, setLangFilter] = useState('');
  const [sessionTime, setSessionTime] = useState(0);
  const [currentWord, setCurrentWord] = useState('');
  const [wordIndex, setWordIndex] = useState(-1);
  const [toasts, setToasts] = useState<{id: number, msg: string, type: 's' | 'e' | 'i' | 'w'}[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isVoicesLoading, setIsVoicesLoading] = useState(true);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const startTimeRef = useRef(0);
  const chromeBugRef = useRef<any>(null);
  const scriptRef = useRef(script);
  scriptRef.current = script;
  const vizRef = useRef<any>({
    bars: 64,
    smooth: Array(64).fill(0.015),
    target: Array(64).fill(0.015),
    time: 0,
    pulse: 0
  });

  // Theme Management
  useEffect(() => {
    const savedTheme = localStorage.getItem('vayu-theme') as 'dark' | 'light';
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem('vayu-theme', theme);
    
    // Update theme-color meta tag
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', theme === 'dark' ? '#040408' : '#ffffff');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    addToast(`Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`, 'i');
  };

  const addToast = (msg: string, type: 's' | 'e' | 'i' | 'w' = 'i') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Initialization
  useEffect(() => {
    let kickInterval: any;
    
    const loadVoices = () => {
      try {
        const v = window.speechSynthesis.getVoices();
        if (v.length > 0) {
          setVoices(v);
          setIsVoicesLoading(false);
          if (kickInterval) clearInterval(kickInterval);
        }
      } catch (err) {
        console.error('Error loading voices:', err);
        addToast('Failed to load system voices', 'e');
      }
    };

    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
      // Some browsers need a little kick
      kickInterval = setInterval(() => {
        if (window.speechSynthesis.getVoices().length > 0) {
          loadVoices();
        }
      }, 200);
      
      // Timeout for loading
      setTimeout(() => {
        setIsVoicesLoading(false);
        if (kickInterval) clearInterval(kickInterval);
      }, 3000);
    } else {
      setIsVoicesLoading(false);
      addToast('Speech synthesis not supported in this browser', 'e');
    }

    const timer = window.setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (kickInterval) clearInterval(kickInterval);
      if (chromeBugRef.current) clearInterval(chromeBugRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  // Keyboard Shortcuts for Play, Pause, Stop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) {
          handlePause();
        } else {
          handlePlay();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleStop();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, wordIndex, script, pitch, rate, volume, selectedVoice, voices]);

  // Visualizer Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;

    const render = () => {
      const { width, height } = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      const viz = vizRef.current;
      viz.time += 0.016;
      viz.pulse *= 0.92; // Decay pulse

      for (let i = 0; i < viz.bars; i++) {
        const n = i / viz.bars;
        if (isPlaying) {
          const env = Math.sin(n * Math.PI) * 0.7 + 0.3;
          const w1 = Math.sin(viz.time * 3.2 + i * 0.5) * 0.28;
          const w2 = Math.sin(viz.time * 5.7 + i * 0.8) * 0.18;
          const w3 = Math.sin(viz.time * 8.3 + i * 1.2) * 0.12;
          const w4 = Math.sin(viz.time * 2.1 + i * 0.3) * 0.1;
          const ns = (Math.random() - 0.5) * 0.28;
          const pulseEffect = viz.pulse * (Math.random() * 0.4 + 0.6) * env;
          viz.target[i] = Math.abs(w1 + w2 + w3 + w4 + ns) * env * 0.85 + 0.06 + pulseEffect;
        } else {
          viz.target[i] = Math.sin(viz.time * 0.35 + i * 0.22) * 0.008 + 0.015;
        }
        const spd = isPlaying ? 0.2 : 0.06;
        viz.smooth[i] += (viz.target[i] - viz.smooth[i]) * spd;
      }

      ctx.clearRect(0, 0, width, height);
      const cy = height / 2;
      const mxh = height * 0.38;
      const tg = (viz.bars - 1) * 2.5;
      const bw = Math.max(1.5, (width - 70 - tg) / viz.bars);
      const sx = 35;

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,.02)';
      ctx.lineWidth = 1;
      for (let y = 0; y < height; y += 22) {
        ctx.beginPath();
        ctx.moveTo(sx, y);
        ctx.lineTo(width - sx, y);
        ctx.stroke();
      }

      // Center line
      ctx.strokeStyle = isPlaying ? (selectedChar?.color || '#e89428') + '25' : 'rgba(255,255,255,.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, cy);
      ctx.lineTo(width - sx, cy);
      ctx.stroke();

      const color = selectedChar?.color || '#e89428';
      const r = parseInt(color.slice(1, 3), 16) || 232;
      const g = parseInt(color.slice(3, 5), 16) || 148;
      const b = parseInt(color.slice(5, 7), 16) || 40;

      for (let i = 0; i < viz.bars; i++) {
        const x = sx + i * (bw + 2.5);
        const v = viz.smooth[i];
        const bh = Math.max(1.5, v * mxh);
        const rad = Math.min(bw / 2, 2.5);

        const gt = ctx.createLinearGradient(x, cy - bh, x, cy);
        gt.addColorStop(0, `rgba(${r},${g},${b},0.92)`);
        gt.addColorStop(1, `rgba(${r},${g},${b},0.3)`);
        ctx.fillStyle = gt;
        ctx.beginPath();
        ctx.moveTo(x, cy);
        ctx.lineTo(x, cy - bh + rad);
        ctx.arcTo(x, cy - bh, x + rad, cy - bh, rad);
        ctx.arcTo(x + bw, cy - bh, x + bw, cy - bh + rad, rad);
        ctx.lineTo(x + bw, cy);
        ctx.closePath();
        ctx.fill();

        const rh = bh * 0.45;
        const gb = ctx.createLinearGradient(x, cy + 1, x, cy + rh);
        gb.addColorStop(0, `rgba(${r},${g},${b},0.2)`);
        gb.addColorStop(1, `rgba(${r},${g},${b},0.01)`);
        ctx.fillStyle = gb;
        ctx.fillRect(x, cy + 1, bw, rh);
      }

      if (isPlaying) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(14px)';
        for (let i = 0; i < viz.bars; i += 3) {
          const x = sx + i * (bw + 2.5);
          const v = viz.smooth[i];
          if (v > 0.22) {
            const bh = v * mxh;
            ctx.fillStyle = `rgba(${r},${g},${b},${v * 0.12})`;
            ctx.fillRect(x - 5, cy - bh - 5, bw + 10, bh * 2 + 10);
          }
        }
        ctx.restore();
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, selectedChar]);

  // Speech Handlers
  const handlePlay = (
    startWordIdx: number | unknown = 0,
    voiceNameOverride?: string,
    pitchOverride?: number,
    rateOverride?: number,
    volumeOverride?: number,
    scriptOverride?: string
  ) => {
    const activeScript = scriptOverride ?? scriptRef.current;
    if (!activeScript.trim()) {
      addToast('Please enter a script first', 'w');
      return;
    }

    const actualStartIdx = typeof startWordIdx === 'number' ? startWordIdx : 0;

    try {
      if (isPaused && actualStartIdx === 0 && !voiceNameOverride && !pitchOverride && !rateOverride && !volumeOverride && !scriptOverride) {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
        return;
      }

      window.speechSynthesis.cancel();
      
      const wordsArray = activeScript.trim().split(/\s+/).filter(w => w.length > 0);
      const totalWords = wordsArray.length;
      
      // Obtain the slice of script to speak
      const textToSpeak = actualStartIdx > 0 && actualStartIdx < totalWords 
        ? wordsArray.slice(actualStartIdx).join(' ') 
        : activeScript;

      const u = new SpeechSynthesisUtterance(textToSpeak);
      u.pitch = pitchOverride ?? pitch;
      u.rate = rateOverride ?? rate;
      u.volume = volumeOverride ?? volume;

      const targetVoiceName = voiceNameOverride ?? selectedVoice;
      const voice = voices.find(v => v.name === targetVoiceName);
      if (voice) u.voice = voice;

      u.onboundary = (e) => {
        if (e.name === 'word') {
          const text = textToSpeak.substring(e.charIndex).split(/\s+/)[0];
          setCurrentWord(text);
          
          const wordsBeforeInSlice = textToSpeak.substring(0, e.charIndex).trim().split(/\s+/).filter(w => w.length > 0);
          const currentAbsoluteIdx = actualStartIdx + wordsBeforeInSlice.length;
          setWordIndex(currentAbsoluteIdx);
          
          // Trigger visualizer pulse
          vizRef.current.pulse = 1.0;
          
          // Improve time accuracy based on word progress
          if (totalWords > 0) {
            const progressRatio = currentAbsoluteIdx / totalWords;
            const estimatedElapsed = progressRatio * totalDuration;
            if (Math.abs(currentTime - estimatedElapsed) > 1) {
              setCurrentTime(estimatedElapsed);
            }
          }
        }
      };

      u.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        
        // Calculate offset correct for actualStartIdx
        const estimatedStartElapsed = totalWords > 0 ? (actualStartIdx / totalWords) * totalDuration : 0;
        startTimeRef.current = Date.now() - (estimatedStartElapsed * 1000);
        setCurrentTime(estimatedStartElapsed);
        
        if (chromeBugRef.current) clearInterval(chromeBugRef.current);
        chromeBugRef.current = window.setInterval(() => {
          if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          }
        }, 10000);
      };

      u.onend = () => {
        if (utteranceRef.current !== u) {
          return;
        }
        
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentWord('');
        setWordIndex(-1);
        if (chromeBugRef.current) clearInterval(chromeBugRef.current);
        
        const newHistory = {
          text: activeScript,
          char: selectedChar?.name || 'Custom',
          color: selectedChar?.color || '#e89428',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          p: pitchOverride ?? pitch,
          r: rateOverride ?? rate,
          v: volumeOverride ?? volume
        };
        setHistory(prev => [newHistory, ...prev].slice(0, 15));
      };

      u.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        setIsPlaying(false);
        setIsPaused(false);
        if (chromeBugRef.current) clearInterval(chromeBugRef.current);
        addToast(`Speech error: ${e.error}`, 'e');
      };

      utteranceRef.current = u;
      window.speechSynthesis.speak(u);
    } catch (err) {
      addToast(`Error: ${err instanceof Error ? err.message : String(err)}`, 'e');
    }
  };

  const restartSpeechFromCurrentWord = (
    overrideVoice?: string,
    overridePitch?: number,
    overrideRate?: number,
    overrideVolume?: number
  ) => {
    if (!isPlaying && !isPaused) return;
    
    utteranceRef.current = null;
    window.speechSynthesis.cancel();
    if (chromeBugRef.current) clearInterval(chromeBugRef.current);
    
    const curIdx = wordIndex >= 0 ? wordIndex : 0;
    
    setTimeout(() => {
      handlePlay(
        curIdx,
        overrideVoice ?? selectedVoice,
        overridePitch ?? pitch,
        overrideRate ?? rate,
        overrideVolume ?? volume
      );
    }, 150);
  };

  const handlePause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
      if (chromeBugRef.current) clearInterval(chromeBugRef.current);
    }
  };

  const handleStop = () => {
    utteranceRef.current = null;
    window.speechSynthesis.cancel();
    // Pause + resume + cancel triggers browser reset on hung engines securely
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setCurrentWord('');
    setWordIndex(-1);
    if (chromeBugRef.current) clearInterval(chromeBugRef.current);
  };


  const copyToClipboard = () => {
    if (!script.trim()) return;
    navigator.clipboard.writeText(script);
    addToast('Script copied to clipboard', 's');
  };

  const downloadScript = () => {
    if (!script.trim()) return;
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VayuScript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Script downloaded', 's');
  };

  // Progress Tracker
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = window.setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setCurrentTime(elapsed);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const totalDuration = useMemo(() => estimateDuration(script, rate), [script, rate]);
  const progress = Math.min(100, (currentTime / totalDuration) * 100);

  const filteredVoices = useMemo(() => {
    if (!langFilter) return voices;
    return voices.filter(v => v.lang.toLowerCase().startsWith(langFilter.toLowerCase()));
  }, [voices, langFilter]);

  const words = useMemo(() => script.split(/(\s+)/), [script]);

  const wordsWithIndices = useMemo(() => {
    let wordCount = 0;
    return words.map((word) => {
      const isWord = word.length > 0 && !word.match(/^\s+$/);
      if (isWord) {
        const index = wordCount;
        wordCount++;
        return { text: word, isWord, index };
      }
      return { text: word, isWord, index: -1 };
    });
  }, [words]);

  return (
    <div className="min-h-screen font-sans selection:bg-[var(--accent)] selection:text-black">
      {/* Toasts */}
      <div className="fixed top-14 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-2xl border pointer-events-auto min-w-[200px] ${
                t.type === 's' ? 'bg-[#0d2e1f] border-[#22c55e] text-white' :
                t.type === 'e' ? 'bg-[#351010] border-[#ef4444] text-white' :
                t.type === 'w' ? 'bg-[#351d04] border-[#e89428] text-white' :
                'bg-[#14263f] border-[#3b82f6] text-white'
              }`}
            >
              {t.type === 's' && <CheckCircle2 size={16} className="text-[#22c55e]" />}
              {t.type === 'e' && <AlertCircle size={16} className="text-[#ef4444]" />}
              {t.type === 'w' && <AlertCircle size={16} className="text-[#e89428]" />}
              {t.type === 'i' && <Info size={16} className="text-[#3b82f6]" />}
              <span className="text-xs font-medium">{t.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-linear-to-br from-[#e89428] to-[#c06a10] shadow-lg shadow-[#e89428]33">
              <Mic2 size={16} className="text-black" />
            </div>
            <span className="font-bold text-sm tracking-tight">Vayu <span className="text-[var(--muted)] font-normal text-xs">Speech</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] transition-all glass hover:bg-white/5"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Moon size={14} /> : <Zap size={14} />}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-[var(--muted)]">
              <kbd className="bg-[var(--surface)] border border-[var(--border)] rounded px-1 text-[9px]">Space</kbd>
              <span>Play</span>
              <kbd className="bg-[var(--surface)] border border-[var(--border)] rounded px-1 text-[9px]">Esc</kbd>
              <span>Stop</span>
            </div>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium glass">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-[var(--danger)] animate-pulse' : 'bg-[var(--success)]'}`} />
              <span>{isPlaying ? 'Speaking' : isPaused ? 'Paused' : 'Ready'}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10px] text-[var(--muted)] font-mono">
              <Clock size={10} />
              <span>{formatTime(sessionTime)}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        {/* Visualizer Section */}
        <section className="relative mt-5">
          <div className={`vg ${isPlaying ? 'on' : ''}`} style={{ '--accentGlow': (selectedChar?.color || '#e89428') + '44' } as any} />
          <div className="relative w-full h-[200px] rounded-2xl overflow-hidden glass-card">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
              <span className="text-[9px] font-mono text-[var(--muted)]">L</span>
              <div className="vu">
                <div className="vu-f" style={{ height: isPlaying ? `${40 + Math.random() * 40}%` : '1%' }} />
              </div>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-10">
              <span className="text-[9px] font-mono text-[var(--muted)]">R</span>
              <div className="vu">
                <div className="vu-f" style={{ height: isPlaying ? `${40 + Math.random() * 40}%` : '1%' }} />
              </div>
            </div>
            
            <canvas ref={canvasRef} className="w-full h-full" />
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <AnimatePresence mode="wait">
                {isPlaying && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="text-center"
                  >
                    <div className="text-xs font-semibold mb-0.5" style={{ color: selectedChar?.color || 'var(--accent)' }}>
                      {selectedChar?.name || 'Custom Voice'}
                    </div>
                    <div className="text-lg font-bold tracking-wide" style={{ textShadow: `0 0 20px ${selectedChar?.color || 'var(--accent)'}44` }}>
                      {currentWord}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {isPlaying && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                <div className="rd" />
                <span className="text-[10px] font-medium text-[var(--rec)] uppercase tracking-widest">Live</span>
              </div>
            )}
          </div>
        </section>

        {/* Transport Controls */}
        <section className="mt-3">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass-card">
            <button 
              onClick={handleStop}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--fg)] transition-all glass hover:bg-white/5"
              title="Stop"
            >
              <Square size={12} fill="currentColor" />
            </button>
            
            <button 
              onClick={isPlaying ? handlePause : () => handlePlay()}
              className={`pb w-11 h-11 rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-xl ${!isPlaying && !isPaused ? 'idle' : ''}`}
              style={{ 
                background: `linear-gradient(135deg, ${selectedChar?.color || '#e89428'}, ${selectedChar?.color ? selectedChar.color + 'dd' : '#c06a10'})`,
                boxShadow: `0 0 20px ${(selectedChar?.color || '#e89428')}44`
              }}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
            </button>
            
            <div className="flex-1 flex items-center gap-2.5">
              <span className="text-[10px] font-mono text-[var(--muted)] w-8 text-right">{formatTime(currentTime)}</span>
              <div className="ptrk flex-1 glass">
                <div className="pfl" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${selectedChar?.color || 'var(--accent)'}, ${selectedChar?.color || 'var(--accent2)'})` }} />
              </div>
              <span className="text-[10px] font-mono text-[var(--muted)] w-8">{formatTime(totalDuration)}</span>
            </div>
            
            <button 
              onClick={copyToClipboard}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] transition-all glass hover:bg-white/5"
              title="Copy Script"
            >
              <Copy size={12} />
            </button>
            
            <button 
              onClick={downloadScript}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] transition-all glass hover:bg-white/5"
              title="Download Script"
            >
              <Download size={14} />
            </button>
            
            <div className="flex items-center gap-1.5">
              <Volume2 size={12} className="text-[var(--muted)]" />
              <span className="text-[10px] font-mono text-[var(--muted)] w-7">{Math.round(volume * 100)}%</span>
            </div>
          </div>
        </section>

        {/* Characters Section */}
        <section className="mt-7">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold tracking-tight">Voice Characters</h2>
            <span className="text-[10px] text-[var(--muted)]">Click to load profile</span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
            {CHARACTERS.map(ch => (
              <div 
                key={ch.id}
                onClick={() => {
                  setSelectedChar(ch);
                  setPitch(ch.p);
                  setRate(ch.r);
                  setVolume(ch.v);
                  setScript(ch.script);
                  // Try to find a matching voice
                  const bestVoice = voices.find(v => v.lang.startsWith('en') && (ch.id === 'morgan' || ch.id === 'shadow' ? /male|daniel|james/i.test(v.name) : /female|samantha|victoria/i.test(v.name)));
                  const targetVoiceName = bestVoice ? bestVoice.name : '';
                  if (bestVoice) setSelectedVoice(targetVoiceName);

                  if (isPlaying || isPaused) {
                    utteranceRef.current = null;
                    window.speechSynthesis.cancel();
                    if (chromeBugRef.current) clearInterval(chromeBugRef.current);
                    setIsPlaying(false);
                    setIsPaused(false);
                    // Settle slightly before playing the brand new character script
                    setTimeout(() => {
                      handlePlay(0, targetVoiceName, ch.p, ch.r, ch.v, ch.script);
                    }, 120);
                  }
                }}
                className={`cc snap-start ${selectedChar?.id === ch.id ? 'on' : ''}`}
              >
                <div className="bar" style={{ background: ch.color }} />
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: ch.color + '18' }}>
                    <ch.icon size={12} style={{ color: ch.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{ch.name}</div>
                    <div className="text-[9px] text-[var(--muted)]">{ch.role}</div>
                  </div>
                </div>
                <p className="text-[10px] text-[var(--dim)] leading-relaxed line-clamp-2">{ch.desc}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[var(--surface)] text-[var(--muted)]">P:{ch.p}</span>
                  <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[var(--surface)] text-[var(--muted)]">S:{ch.r}</span>
                  <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[var(--surface)] text-[var(--muted)]">V:{ch.v}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Workspace Section */}
        <section className="mt-7">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold tracking-tight">Script</h2>
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] text-[var(--muted)]">{getWordCount(script)} words</span>
                  <button 
                    onClick={() => setScript('')}
                    className="text-[10px] text-[var(--muted)] hover:text-[var(--fg)] transition-colors flex items-center gap-1"
                  >
                    <Eraser size={10} /> Clear
                  </button>
                </div>
              </div>
              
              <div className="relative">
                {isPlaying || isPaused ? (
                  <div 
                    className="pv glass cursor-text select-all"
                    onClick={() => {
                      handleStop();
                      setTimeout(() => {
                        const ta = document.querySelector('.ed') as HTMLTextAreaElement;
                        if (ta) {
                          ta.focus();
                        }
                      }, 50);
                    }}
                    title="Click anywhere to edit"
                  >
                    {wordsWithIndices.map((item, i) => {
                      if (!item.isWord) return item.text;
                      return (
                        <span 
                          key={i} 
                          className={`wd ${item.index === wordIndex ? 'cur' : item.index < wordIndex ? 'past' : ''}`}
                        >
                          {item.text}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <textarea 
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="ed glass" 
                    placeholder="Type your script here, or select a voice character to load a sample..."
                    spellCheck={false}
                  />
                )}
              </div>
              
              <div className="flex items-center justify-between mt-1.5 px-0.5">
                <span className="text-[10px] text-[var(--dim)]" style={{ color: selectedChar?.color }}>
                  {selectedChar ? `${selectedChar.name} \u2014 ${selectedChar.role}` : 'No character selected'}
                </span>
                <span className="text-[10px] text-[var(--dim)]">
                  {totalDuration > 0 ? `Est. ${formatTime(totalDuration)}` : ''}
                </span>
              </div>
              
              <div className="mt-3">
                <span className="text-[10px] text-[var(--dim)] block mb-1.5 uppercase tracking-wider font-bold">Quick Templates</span>
                <div className="flex flex-wrap gap-1.5">
                  {TEMPLATES.map(t => (
                    <button 
                      key={t.label}
                      onClick={() => {
                        setScript(t.text);
                        if (isPlaying || isPaused) {
                          utteranceRef.current = null;
                          window.speechSynthesis.cancel();
                          if (chromeBugRef.current) clearInterval(chromeBugRef.current);
                          setIsPlaying(false);
                          setIsPaused(false);
                          setTimeout(() => {
                            handlePlay(0, selectedVoice, pitch, rate, volume, t.text);
                          }, 150);
                        }
                      }}
                      className="tpl"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold tracking-tight mb-2">Controls</h2>
              <div className="flex gap-0 mb-0 border-b border-[var(--border)]">
                {(['voice', 'lang', 'fx'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tb capitalize ${activeTab === tab ? 'on' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="p-4 space-y-4 glass-card border-t-0 rounded-b-xl">
                {activeTab === 'voice' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5 block">System Voice</label>
                      <select 
                        value={selectedVoice}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedVoice(val);
                          if (isPlaying) {
                            restartSpeechFromCurrentWord(val, pitch, rate, volume);
                          }
                        }}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] rounded-lg p-2 text-xs outline-none focus:border-[var(--accent)] glass disabled:opacity-50"
                        disabled={isVoicesLoading}
                      >
                        <option value="">{isVoicesLoading ? 'Loading voices...' : 'Default System Voice'}</option>
                        {voices.map(v => (
                          <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                        ))}
                      </select>
                      <p className="text-[9px] text-[var(--dim)] mt-0.5">
                        {isVoicesLoading ? 'Scanning system for voices...' : `${voices.length} voices detected`}
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider">Pitch</label>
                        <span className="text-[10px] font-mono text-[var(--accent)]">{pitch.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="2" 
                        step="0.01" 
                        value={pitch} 
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setPitch(val);
                          if (isPlaying) {
                            restartSpeechFromCurrentWord(selectedVoice, val, rate, volume);
                          }
                        }} 
                      />
                      <div className="flex justify-between text-[8px] text-[var(--dim)] mt-0.5"><span>Deep</span><span>Normal</span><span>High</span></div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider">Speed</label>
                        <span className="text-[10px] font-mono text-[var(--accent)]">{rate.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="3" 
                        step="0.01" 
                        value={rate} 
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setRate(val);
                          if (isPlaying) {
                            restartSpeechFromCurrentWord(selectedVoice, pitch, val, volume);
                          }
                        }} 
                      />
                      <div className="flex justify-between text-[8px] text-[var(--dim)] mt-0.5"><span>Slow</span><span>Normal</span><span>Fast</span></div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider">Volume</label>
                        <span className="text-[10px] font-mono text-[var(--accent)]">{volume.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume} 
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setVolume(val);
                          if (isPlaying) {
                            restartSpeechFromCurrentWord(selectedVoice, pitch, rate, val);
                          }
                        }} 
                      />
                      <div className="flex justify-between text-[8px] text-[var(--dim)] mt-0.5"><span>Mute</span><span>Max</span></div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setPitch(1.0);
                        setRate(1.0);
                        setVolume(0.8);
                        setSelectedVoice('');
                        setSelectedChar(null);
                        addToast('Settings reset', 'i');
                      }}
                      className="w-full py-1.5 text-[10px] font-medium text-[var(--muted)] rounded-lg hover:text-[var(--fg)] transition-all glass flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={10} /> Reset Defaults
                    </button>
                  </motion.div>
                )}

                {activeTab === 'lang' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div>
                      <label className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5 block">Language Filter</label>
                      <select 
                        value={langFilter}
                        onChange={(e) => setLangFilter(e.target.value)}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] rounded-lg p-2 text-xs outline-none focus:border-[var(--accent)] glass"
                      >
                        <option value="">All Languages</option>
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                        <option value="hi">Hindi</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-medium text-[var(--muted)] uppercase tracking-wider mb-1.5 block">Filtered Voices</label>
                      <select 
                        value={selectedVoice}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedVoice(val);
                          if (isPlaying) {
                            restartSpeechFromCurrentWord(val, pitch, rate, volume);
                          }
                        }}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--fg)] rounded-lg p-2 text-xs outline-none focus:border-[var(--accent)] glass"
                      >
                        <option value="">Select a voice...</option>
                        {filteredVoices.map(v => (
                          <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
                        ))}
                      </select>
                      <p className="text-[9px] text-[var(--dim)] mt-0.5">{filteredVoices.length} voices</p>
                    </div>
                    
                    <p className="text-[9px] text-[var(--dim)] leading-relaxed flex items-start gap-1.5">
                      <Info size={10} className="mt-0.5 shrink-0" />
                      Available languages depend on your browser and operating system. Chrome typically offers the most voice options.
                    </p>
                  </motion.div>
                )}
                
                {activeTab === 'fx' && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <p className="text-[9px] text-[var(--dim)] leading-relaxed flex items-start gap-1.5">
                      <Wand2 size={10} className="mt-0.5 shrink-0" />
                      These presets adjust pitch and rate to create vocal effects. They override character defaults.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {EFFECTS.map(fx => (
                        <button 
                          key={fx.id}
                          onClick={() => {
                            setPitch(fx.p);
                            setRate(fx.r);
                            addToast(`Effect applied: ${fx.label}`, 'i');
                            if (isPlaying) {
                              restartSpeechFromCurrentWord(selectedVoice, fx.p, fx.r, volume);
                            }
                          }}
                          className="mb flex flex-col items-center justify-center h-auto py-2 glass"
                          title={fx.title}
                        >
                          <fx.icon size={14} />
                          <div className="text-[8px] mt-1">{fx.label}</div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section className="mt-9">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold tracking-tight">Session History</h2>
            <button 
              onClick={() => setHistory([])}
              className="text-[10px] text-[var(--muted)] hover:text-[var(--danger)] transition-colors flex items-center gap-1"
            >
              <Trash2 size={10} /> Clear All
            </button>
          </div>
          
          <div className="space-y-1.5">
            {history.length === 0 ? (
              <div className="text-xs text-[var(--dim)] text-center py-7 border border-dashed border-[var(--border)] rounded-xl">
                No playback history yet
              </div>
            ) : (
              history.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i}
                  onClick={() => {
                    setScript(item.text);
                    setPitch(item.p);
                    setRate(item.r);
                    setVolume(item.v);
                    addToast('Loaded from history', 'i');
                  }}
                  className="hi glass"
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
                      <span className="text-[10px] font-semibold" style={{ color: item.color }}>{item.char}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[var(--dim)]">{item.time}</span>
                  </div>
                  <p className="text-[10px] text-[var(--muted)] leading-relaxed line-clamp-1">"{item.text}"</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px] font-mono text-[var(--dim)]">P:{item.p.toFixed(2)}</span>
                    <span className="text-[8px] font-mono text-[var(--dim)]">S:{item.r.toFixed(2)}</span>
                    <span className="text-[8px] font-mono text-[var(--dim)]">V:{item.v.toFixed(2)}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
