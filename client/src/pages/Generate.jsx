import { ArrowLeft, Sparkles, Wand2, Clock, Zap, Globe, Code2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from "motion/react"
import { useState } from 'react'
import axios from "axios"
import { serverUrl } from '../App'

const PHASES = [
    "Analyzing your idea…",
    "Designing layout & structure…",
    "Writing HTML & CSS…",
    "Adding animations & interactions…",
    "Final quality checks…",
]

const PHASE_ICONS = [Sparkles, Globe, Code2, Zap, Wand2]

const TIPS = [
    "Be specific about colors, fonts, and overall style.",
    "Mention your target audience for better results.",
    "Include details like sections: hero, about, contact.",
    "Describe the mood: minimal, bold, playful, corporate.",
    "Mention any animations or interactions you want.",
]

function Generate() {
    const navigate = useNavigate()
    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")
    const [tipIndex, setTipIndex] = useState(0)

    const handleGenerateWebsite = async () => {
        setLoading(true)
        setError("")
        try {
            const result = await axios.post(`${serverUrl}/api/website/generate`, { prompt }, { withCredentials: true })
            setProgress(100)
            setLoading(false)
            navigate(`/editor/${result.data.websiteId}`)
        } catch (error) {
            setLoading(false)
            setError(error.response.data.message || "Something went wrong")
            console.log(error)
        }
    }

    useEffect(() => {
        if (!loading) {
            setPhaseIndex(0)
            setProgress(0)
            return
        }

        let value = 0
        let phase = 0

        const interval = setInterval(() => {
            const increment = value < 20
                ? Math.random() * 1.5
                : value < 60
                    ? Math.random() * 1.2
                    : Math.random() * 0.6

            value += increment
            if (value >= 93) value = 93

            phase = Math.min(
                Math.floor((value / 100) * PHASES.length), PHASES.length - 1
            )

            setProgress(Math.floor(value))
            setPhaseIndex(phase)
        }, 1200)

        return () => clearInterval(interval)
    }, [loading])

    // Rotate tips
    useEffect(() => {
        const t = setInterval(() => {
            setTipIndex(prev => (prev + 1) % TIPS.length)
        }, 4000)
        return () => clearInterval(t)
    }, [])

    const PhaseIcon = PHASE_ICONS[phaseIndex]

    return (
        <div className='min-h-screen bg-[#020204] text-white overflow-x-hidden'>

            {/* ── Background ── */}
            <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
                <div className='absolute top-[-20%] left-[50%] -translate-x-1/2 w-[1000px] h-[700px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />
                <div className='absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />
                <div className='absolute top-[40%] right-[-10%] w-[500px] h-[500px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
                <div className='absolute inset-0'
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }} />
                <div className='absolute inset-0 bg-gradient-to-b from-[#020204] via-transparent to-[#020204]' />
                <div className='absolute inset-0 bg-gradient-to-r from-[#020204] via-transparent to-[#020204]' />
            </div>

            {/* ── Navbar ── */}
            <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className='sticky top-0 z-40'
            >
                <div className='px-4 pt-4 pb-2'>
                    <div className='max-w-6xl mx-auto'>
                        <div className='flex items-center justify-between px-5 py-3 rounded-2xl border border-white/[0.07] bg-[#020204]/85 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]'>

                            <div className='flex items-center gap-3'>
                                <button
                                    onClick={() => navigate("/")}
                                    className='flex items-center justify-center w-9 h-9 rounded-xl border border-white/8 bg-white/3 hover:bg-white/8 hover:border-white/15 transition-all duration-200 group'
                                >
                                    <ArrowLeft size={15} className='text-zinc-500 group-hover:text-white transition-colors' />
                                </button>

                                <div className='flex items-center gap-2.5'>
                                    <div className='w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20'>
                                        <Sparkles size={12} className='text-white' />
                                    </div>
                                    <div className='flex items-baseline gap-0.5'>
                                        <span className='text-sm font-bold text-zinc-300'>IntelliWeb</span>
                                        <span className='text-sm font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent'>.ai</span>
                                    </div>
                                </div>

                                <div className='hidden sm:flex items-center gap-1.5 text-zinc-700'>
                                    <span>/</span>
                                    <span className='text-sm text-zinc-500'>Generate</span>
                                </div>
                            </div>

                            {/* Status pill */}
                            <div className='flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-violet-500/20 bg-violet-500/8'>
                                <span className='w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse' />
                                <span className='text-xs text-violet-300 font-medium'>AI Ready</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className='relative z-10 max-w-4xl mx-auto px-6 py-16'>

                {/* ── Hero Text ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-16"
                >
                    {/* Badge */}
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/25 bg-violet-500/8 text-xs text-violet-300 mb-8'>
                        <Wand2 size={12} />
                        <span>Powered by Advanced AI Models</span>
                    </div>

                    <h1 className='text-5xl md:text-6xl font-black tracking-tight leading-[1.05] mb-6'>
                        <span className='text-white'>Describe It.</span>
                        <br />
                        <span className='bg-gradient-to-br from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent'>
                            We Build It.
                        </span>
                    </h1>
                    <p className='text-zinc-600 max-w-lg mx-auto text-base leading-relaxed'>
                        IntelliWeb.ai focuses on quality over speed —
                        expect a fully polished, production-ready website.
                    </p>
                </motion.div>

                {/* ── Main Card ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className='rounded-3xl border border-white/8 overflow-hidden shadow-2xl shadow-black/50'
                    style={{ background: 'linear-gradient(135deg, #0c0c12 0%, #080810 100%)' }}
                >
                    {/* Card header */}
                    <div className='px-6 py-4 border-b border-white/6 flex items-center justify-between'>
                        <div className='flex items-center gap-2.5'>
                            <div className='w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center'>
                                <Code2 size={14} className='text-violet-400' />
                            </div>
                            <div>
                                <p className='text-sm font-semibold text-white'>Website Prompt</p>
                                <p className='text-xs text-zinc-700'>Describe your vision in detail</p>
                            </div>
                        </div>
                        <div className='text-xs text-zinc-700 tabular-nums'>
                            {prompt.length} chars
                        </div>
                    </div>

                    {/* Textarea */}
                    <div className='p-6'>
                        <textarea
                            onChange={(e) => setPrompt(e.target.value)}
                            value={prompt}
                            placeholder='Example: A modern SaaS landing page for a project management tool. Dark theme with purple accents, glassmorphism cards, animated hero section with floating elements, features grid, pricing table with 3 tiers, and a CTA section...'
                            className='w-full h-52 bg-transparent outline-none resize-none text-sm leading-relaxed text-zinc-300 placeholder:text-zinc-700 transition-colors duration-200'
                            disabled={loading}
                        />
                    </div>

                    {/* Rotating tip */}
                    <div className='px-6 pb-5'>
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={tipIndex}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.3 }}
                                className='flex items-start gap-2 px-4 py-3 rounded-2xl bg-white/3 border border-white/6'
                            >
                                <Sparkles size={12} className='text-violet-400 mt-0.5 flex-shrink-0' />
                                <p className='text-xs text-zinc-600'>
                                    <span className='text-zinc-500 font-medium'>Tip: </span>
                                    {TIPS[tipIndex]}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className='px-6 pb-4'
                            >
                                <div className='flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/8 border border-red-500/20'>
                                    <span className='text-red-400 text-sm'>⚠</span>
                                    <p className='text-xs text-red-400'>{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Card footer / CTA */}
                    <div className='px-6 pb-6'>
                        <motion.button
                            whileHover={prompt.trim() && !loading ? { scale: 1.02 } : {}}
                            whileTap={prompt.trim() && !loading ? { scale: 0.98 } : {}}
                            onClick={handleGenerateWebsite}
                            disabled={!prompt.trim() || loading}
                            className={`group relative w-full overflow-hidden flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-bold transition-all duration-300 ${
                                prompt.trim() && !loading
                                    ? 'cursor-pointer'
                                    : 'cursor-not-allowed opacity-40'
                            }`}
                        >
                            {prompt.trim() && !loading && (
                                <>
                                    <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-indigo-500' />
                                    <div className='absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-50 group-hover:opacity-80 transition-opacity duration-300 scale-110' />
                                    <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                                        style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
                                </>
                            )}
                            {!prompt.trim() && !loading && (
                                <div className='absolute inset-0 bg-white/8 rounded-2xl' />
                            )}
                            {loading && (
                                <div className='absolute inset-0 bg-violet-600/30 rounded-2xl' />
                            )}

                            <span className='relative flex items-center gap-2.5 text-white'>
                                {loading ? (
                                    <>
                                        <div className='w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin' />
                                        Generating your website...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 size={18} className='group-hover:rotate-12 transition-transform duration-300' />
                                        Generate Website
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* ── Progress Section ── */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.4 }}
                            className='mt-8 rounded-3xl border border-white/8 overflow-hidden'
                            style={{ background: 'linear-gradient(135deg, #0c0c12 0%, #080810 100%)' }}
                        >
                            {/* Phase header */}
                            <div className='px-6 pt-6 pb-4 flex items-center gap-3'>
                                <motion.div
                                    key={phaseIndex}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className='w-10 h-10 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0'
                                >
                                    <PhaseIcon size={16} className='text-violet-400' />
                                </motion.div>
                                <div className='flex-1 min-w-0'>
                                    <AnimatePresence mode='wait'>
                                        <motion.p
                                            key={phaseIndex}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.25 }}
                                            className='text-sm font-semibold text-white'
                                        >
                                            {PHASES[phaseIndex]}
                                        </motion.p>
                                    </AnimatePresence>
                                    <p className='text-xs text-zinc-700 mt-0.5'>
                                        Phase {phaseIndex + 1} of {PHASES.length}
                                    </p>
                                </div>
                                <div className='text-2xl font-black bg-gradient-to-br from-violet-400 to-indigo-400 bg-clip-text text-transparent tabular-nums'>
                                    {progress}%
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className='px-6'>
                                <div className='h-2 w-full rounded-full bg-white/5 overflow-hidden'>
                                    <motion.div
                                        className='h-full rounded-full'
                                        style={{
                                            background: 'linear-gradient(90deg, #7c3aed, #6366f1, #06b6d4)',
                                            backgroundSize: '200% 100%',
                                        }}
                                        animate={{
                                            width: `${progress}%`,
                                            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                        }}
                                        transition={{
                                            width: { ease: "easeOut", duration: 0.8 },
                                            backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Phase steps */}
                            <div className='px-6 py-5 flex items-center gap-2'>
                                {PHASES.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                                            i < phaseIndex
                                                ? 'bg-violet-500'
                                                : i === phaseIndex
                                                    ? 'bg-violet-500/60 animate-pulse'
                                                    : 'bg-white/5'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* Time estimate */}
                            <div className='px-6 pb-6'>
                                <div className='flex items-center justify-between px-4 py-3 rounded-2xl bg-white/3 border border-white/6'>
                                    <div className='flex items-center gap-2'>
                                        <Clock size={13} className='text-zinc-700' />
                                        <span className='text-xs text-zinc-600'>Estimated time</span>
                                    </div>
                                    <span className='text-xs font-semibold text-zinc-400'>~8–12 minutes</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Feature hints (when not loading) ── */}
                {!loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className='mt-10 grid grid-cols-3 gap-4'
                    >
                        {[
                            { icon: <Code2 size={14} className='text-violet-400' />, label: "Clean Code", sub: "Semantic & modern" },
                            { icon: <Globe size={14} className='text-cyan-400' />, label: "Responsive", sub: "All screen sizes" },
                            { icon: <Zap size={14} className='text-emerald-400' />, label: "Deploy Ready", sub: "Ship immediately" },
                        ].map((f, i) => (
                            <div
                                key={i}
                                className='flex flex-col items-center gap-2 px-4 py-5 rounded-2xl border border-white/6 bg-white/[0.02] text-center'
                            >
                                <div className='w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center'>
                                    {f.icon}
                                </div>
                                <p className='text-xs font-semibold text-zinc-300'>{f.label}</p>
                                <p className='text-xs text-zinc-700'>{f.sub}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* ── Footer ── */}
            <footer className='relative z-10 mt-10 border-t border-white/[0.05] py-8'>
                <div className='max-w-6xl mx-auto px-6 flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center'>
                        <Sparkles size={10} className='text-white' />
                    </div>
                    <p className='text-xs text-zinc-800'>
                        &copy; {new Date().getFullYear()} IntelliWeb.ai
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Generate