import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import LoginModal from '../components/LoginModal'
import { useDispatch, useSelector } from 'react-redux'
import { Coins, Sparkles, Zap, Globe, ArrowRight, Star, Code2, Layers, ExternalLink, ChevronRight, Menu, X } from "lucide-react"
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

function Home() {

    const highlights = [
        {
            title: "AI Generated Code",
            icon: <Code2 size={20} className='text-violet-400' />,
            desc: "Production-grade code generated instantly — semantic HTML, modern CSS, clean JavaScript with zero bloat.",
            tag: "Intelligent",
            color: "violet",
        },
        {
            title: "Fully Responsive Layouts",
            icon: <Globe size={20} className='text-cyan-400' />,
            desc: "Every website is crafted mobile-first with fluid layouts that look stunning across all screen sizes.",
            tag: "Adaptive",
            color: "cyan",
        },
        {
            title: "Production Ready Output",
            icon: <Zap size={20} className='text-emerald-400' />,
            desc: "Deploy-ready code with optimized performance, accessibility standards and modern architecture.",
            tag: "Instant",
            color: "emerald",
        },
    ]

    const colorMap = {
        violet: {
            tag: "bg-violet-500/10 text-violet-400 border-violet-500/20",
            glow: "group-hover:shadow-violet-500/10",
            icon: "bg-violet-500/10 border-violet-500/20",
            border: "group-hover:border-violet-500/30",
            line: "bg-violet-500",
        },
        cyan: {
            tag: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            glow: "group-hover:shadow-cyan-500/10",
            icon: "bg-cyan-500/10 border-cyan-500/20",
            border: "group-hover:border-cyan-500/30",
            line: "bg-cyan-500",
        },
        emerald: {
            tag: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            glow: "group-hover:shadow-emerald-500/10",
            icon: "bg-emerald-500/10 border-emerald-500/20",
            border: "group-hover:border-emerald-500/30",
            line: "bg-emerald-500",
        },
    }

    const [openLogin, setOpenLogin] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [openProfile, setOpenProfile] = useState(false)
    const [websites, setWebsites] = useState(null)
    const [mobileMenu, setMobileMenu] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setOpenProfile(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!userData) return;
        const handleGetAllWebsites = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])
            } catch (error) {
                console.log(error)
            }
        }
        handleGetAllWebsites()
    }, [userData])

    return (
        <div className='relative min-h-screen bg-[#020204] text-white overflow-x-hidden'>

            {/* ── Background Layer ── */}
            <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
                {/* Primary orb */}
                <div className='absolute top-[-15%] left-[50%] -translate-x-1/2 w-[1100px] h-[700px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)' }} />
                {/* Secondary orbs */}
                <div className='absolute top-[55%] left-[-15%] w-[600px] h-[600px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.07) 0%, transparent 70%)' }} />
                <div className='absolute top-[30%] right-[-15%] w-[600px] h-[600px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />

                {/* Dot grid */}
                <div className='absolute inset-0'
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                        backgroundSize: '36px 36px',
                    }} />

                {/* Fade edges */}
                <div className='absolute inset-0 bg-gradient-to-b from-[#020204] via-transparent to-[#020204]' />
                <div className='absolute inset-0 bg-gradient-to-r from-[#020204] via-transparent to-[#020204]' />

                {/* Noise texture */}
                <div className='absolute inset-0 opacity-[0.015]'
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '128px 128px',
                    }} />
            </div>

            {/* ── Navbar ── */}
            <motion.header
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className='fixed top-0 left-0 right-0 z-50'
            >
                <div className='px-4 pt-4'>
                    <div className='max-w-6xl mx-auto'>
                        <div className='flex items-center justify-between px-5 py-3 rounded-2xl border border-white/[0.07] bg-[#020204]/80 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]'>

                            {/* Logo */}
                            <button onClick={() => navigate("/")} className='flex items-center gap-3 group'>
                                <div className='relative w-8 h-8'>
                                    <div className='absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300' />
                                    <div className='relative w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg'>
                                        <Sparkles size={14} className='text-white' />
                                    </div>
                                </div>
                                <div className='flex items-baseline gap-0.5'>
                                    <span className='text-sm font-bold text-white tracking-tight'>IntelliWeb</span>
                                    <span className='text-sm font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent'>.ai</span>
                                </div>
                            </button>

                            {/* Center Nav */}
                            <nav className='hidden md:flex items-center gap-1'>
                                <button
                                    onClick={() => navigate("/pricing")}
                                    className='px-4 py-2 text-sm text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200'
                                >
                                    Pricing
                                </button>
                                {userData && (
                                    <button
                                        onClick={() => navigate("/dashboard")}
                                        className='px-4 py-2 text-sm text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200'
                                    >
                                        Dashboard
                                    </button>
                                )}
                            </nav>

                            {/* Right */}
                            <div className='flex items-center gap-2.5'>
                                {userData && (
                                    <button
                                        onClick={() => navigate("/pricing")}
                                        className='hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-200 group'
                                    >
                                        <Coins size={13} className='text-yellow-400' />
                                        <span className='text-xs text-zinc-500'>Credits</span>
                                        <span className='text-xs font-bold text-yellow-300'>{userData.credits}</span>
                                    </button>
                                )}

                                {!userData ? (
                                    <button
                                        onClick={() => setOpenLogin(true)}
                                        className='relative px-5 py-2.5 rounded-xl text-sm font-semibold overflow-hidden group'
                                    >
                                        <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-indigo-500' />
                                        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.1), transparent)' }} />
                                        <span className='relative text-white flex items-center gap-1.5'>
                                            Get Started
                                            <ArrowRight size={13} className='group-hover:translate-x-0.5 transition-transform duration-200' />
                                        </span>
                                    </button>
                                ) : (
                                    <div className='relative'>
                                        <button
                                            onClick={() => setOpenProfile(!openProfile)}
                                            className='relative flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl border border-white/8 hover:border-white/15 bg-white/3 hover:bg-white/6 transition-all duration-200'
                                        >
                                            <img
                                                src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=7c3aed&color=fff`}
                                                alt=""
                                                referrerPolicy='no-referrer'
                                                className='w-7 h-7 rounded-lg object-cover'
                                            />
                                            <span className='hidden sm:block text-xs font-medium text-zinc-300 max-w-[80px] truncate'>
                                                {userData.name.split(' ')[0]}
                                            </span>
                                            <ChevronRight size={12} className={`text-zinc-600 transition-transform duration-200 ${openProfile ? 'rotate-90' : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {openProfile && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                                                    transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                                                    className="absolute right-0 mt-2.5 w-64 z-50 rounded-2xl border border-white/8 overflow-hidden shadow-2xl shadow-black/70"
                                                    style={{ background: 'linear-gradient(135deg, #0e0e12 0%, #0a0a0e 100%)' }}
                                                >
                                                    {/* Header */}
                                                    <div className='p-4 border-b border-white/6'>
                                                        <div className='flex items-center gap-3'>
                                                            <div className='relative'>
                                                                <img
                                                                    src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=7c3aed&color=fff`}
                                                                    alt=""
                                                                    referrerPolicy='no-referrer'
                                                                    className='w-10 h-10 rounded-xl object-cover'
                                                                />
                                                                <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0e0e12]' />
                                                            </div>
                                                            <div className='flex-1 min-w-0'>
                                                                <p className='text-sm font-semibold text-white truncate'>{userData.name}</p>
                                                                <p className='text-xs text-zinc-600 truncate'>{userData.email}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Mobile Credits */}
                                                    <button
                                                        className='md:hidden w-full px-4 py-3 flex items-center gap-3 border-b border-white/6 hover:bg-white/4 transition-colors'
                                                        onClick={() => navigate("/pricing")}
                                                    >
                                                        <div className='w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center'>
                                                            <Coins size={14} className='text-yellow-400' />
                                                        </div>
                                                        <div className='text-left'>
                                                            <p className='text-xs text-zinc-400'>Available Credits</p>
                                                            <p className='text-sm font-bold text-yellow-300'>{userData.credits}</p>
                                                        </div>
                                                        <ChevronRight size={14} className='ml-auto text-zinc-700' />
                                                    </button>

                                                    {/* Menu Items */}
                                                    <div className='p-2'>
                                                        <button
                                                            className='w-full px-3 py-2.5 flex items-center gap-3 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-150 text-left'
                                                            onClick={() => { navigate("/dashboard"); setOpenProfile(false) }}
                                                        >
                                                            <Layers size={15} className='text-zinc-600' />
                                                            Dashboard
                                                        </button>
                                                        <button
                                                            className='w-full px-3 py-2.5 flex items-center gap-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl transition-all duration-150 text-left mt-0.5'
                                                            onClick={handleLogOut}
                                                        >
                                                            <X size={15} className='text-red-500/60' />
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* ── Hero ── */}
            <section className='relative z-10 pt-52 pb-40 px-6 flex flex-col items-center text-center'>

                {/* Pill badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className='flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/25 bg-violet-500/8 backdrop-blur-sm mb-10 cursor-default'
                >
                    <div className='flex items-center gap-1'>
                        <span className='w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse' />
                        <span className='w-1 h-1 rounded-full bg-violet-400/60 animate-pulse' style={{ animationDelay: '150ms' }} />
                        <span className='w-0.5 h-0.5 rounded-full bg-violet-400/40 animate-pulse' style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className='text-xs font-medium text-violet-300 tracking-wide'>Powered by Advanced AI Models</span>
                    <Star size={10} className='fill-violet-400 text-violet-400' />
                </motion.div>

                {/* Main Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className='max-w-5xl mx-auto'
                >
                    <h1 className='text-6xl md:text-8xl font-black tracking-tight leading-[1.02]'>
                        <span className='text-white'>Transform Ideas</span>
                        <br />
                        <span className='relative'>
                            <span className='bg-gradient-to-br from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent'>
                                Into Websites
                            </span>
                            {/* Underline glow */}
                            <span className='absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent' />
                        </span>
                        <span className='text-zinc-700'> Instantly</span>
                    </h1>
                </motion.div>

                {/* Subheading */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className='mt-10 max-w-lg mx-auto text-zinc-500 text-lg leading-relaxed'
                >
                    Describe your vision — IntelliWeb.ai generates a fully responsive,
                    production-ready website in seconds. No coding needed.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    className='mt-12 flex flex-col sm:flex-row items-center gap-4'
                >
                    <button
                        onClick={() => userData ? navigate("/dashboard") : setOpenLogin(true)}
                        className='group relative overflow-hidden px-8 py-4 rounded-2xl text-sm font-bold text-white transition-all duration-300 hover:scale-[1.03]'
                    >
                        {/* Button bg layers */}
                        <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600' />
                        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-violet-500 to-indigo-500' />
                        <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                            style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />
                        {/* Glow */}
                        <div className='absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-50 group-hover:opacity-80 transition-opacity duration-300 scale-110' />
                        <span className='relative flex items-center gap-2'>
                            {userData ? "Open Dashboard" : "Start Building — It's Free"}
                            <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform duration-200' />
                        </span>
                    </button>

                    {!userData && (
                        <button
                            onClick={() => navigate("/pricing")}
                            className='group flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/8 text-sm font-medium text-zinc-400 hover:text-white hover:border-white/16 hover:bg-white/4 transition-all duration-300'
                        >
                            See Pricing
                            <ChevronRight size={14} className='group-hover:translate-x-0.5 transition-transform duration-200' />
                        </button>
                    )}
                </motion.div>

                {/* Trust badges */}
                {!userData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className='mt-14 flex flex-wrap items-center justify-center gap-6'
                    >
                        {[
                            { label: "No credit card", icon: "🔒" },
                            { label: "Free plan available", icon: "✨" },
                            { label: "Instant results", icon: "⚡" },
                        ].map((b, i) => (
                            <div key={i} className='flex items-center gap-2 text-xs text-zinc-700'>
                                <span>{b.icon}</span>
                                <span>{b.label}</span>
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* Hero visual — floating code card */}
                {!userData && (
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className='mt-24 relative max-w-3xl w-full mx-auto'
                    >
                        {/* Glow behind card */}
                        <div className='absolute inset-x-20 top-10 bottom-0 bg-violet-600/15 blur-3xl rounded-full pointer-events-none' />

                        <div className='relative rounded-3xl border border-white/8 bg-[#08080c]/90 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/60'>
                            {/* Window chrome */}
                            <div className='flex items-center gap-2 px-5 py-4 border-b border-white/6'>
                                <span className='w-3 h-3 rounded-full bg-red-500/70' />
                                <span className='w-3 h-3 rounded-full bg-yellow-500/70' />
                                <span className='w-3 h-3 rounded-full bg-emerald-500/70' />
                                <div className='flex-1 mx-4'>
                                    <div className='px-4 py-1 rounded-lg bg-white/4 border border-white/6 text-xs text-zinc-600 text-center max-w-xs mx-auto'>
                                        intelliweb.ai/editor
                                    </div>
                                </div>
                            </div>

                            {/* Code preview mockup */}
                            <div className='p-6 font-mono text-xs leading-relaxed text-left'>
                                <div className='flex items-start gap-4'>
                                    {/* Line numbers */}
                                    <div className='text-zinc-800 select-none text-right'>
                                        {[1, 2, 3, 4, 5, 6, 7].map(n => <div key={n}>{n}</div>)}
                                    </div>
                                    {/* Code */}
                                    <div className='flex-1'>
                                        <div><span className='text-violet-400'>const</span> <span className='text-cyan-300'>website</span> <span className='text-zinc-500'>=</span> <span className='text-violet-400'>await</span> <span className='text-emerald-400'>IntelliWeb</span><span className='text-zinc-500'>.</span><span className='text-cyan-400'>generate</span><span className='text-zinc-500'>({"{"}</span></div>
                                        <div className='pl-4'><span className='text-orange-400'>prompt</span><span className='text-zinc-500'>:</span> <span className='text-emerald-300'>"A modern SaaS landing page with hero section"</span><span className='text-zinc-500'>,</span></div>
                                        <div className='pl-4'><span className='text-orange-400'>style</span><span className='text-zinc-500'>:</span> <span className='text-emerald-300'>"glassmorphism"</span><span className='text-zinc-500'>,</span></div>
                                        <div className='pl-4'><span className='text-orange-400'>responsive</span><span className='text-zinc-500'>:</span> <span className='text-violet-400'>true</span></div>
                                        <div><span className='text-zinc-500'>{"})"};</span></div>
                                        <div className='mt-2 flex items-center gap-2'><span className='text-zinc-600'>// ✅ </span><span className='text-emerald-400'>Generated in 1.2s — 847 lines of clean code</span></div>
                                        <div className='mt-1 flex items-center gap-1.5'>
                                            <span className='w-2 h-2 rounded-full bg-emerald-400 animate-pulse' />
                                            <span className='text-zinc-600'>Ready to deploy</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </section>

            {/* ── Features ── */}
            {!userData && (
                <section className='relative z-10 max-w-6xl mx-auto px-6 pb-40'>
                    {/* Section header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='text-center mb-20'
                    >
                        <div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/8 bg-white/3 text-xs text-zinc-600 uppercase tracking-widest mb-6'>
                            <Layers size={11} />
                            Features
                        </div>
                        <h2 className='text-4xl md:text-5xl font-black text-white tracking-tight'>
                            Everything you need
                        </h2>
                        <p className='mt-4 text-zinc-600 text-lg max-w-xl mx-auto'>
                            From idea to deployment — IntelliWeb handles every step of the process.
                        </p>
                    </motion.div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        {highlights.map((h, i) => {
                            const c = colorMap[h.color]
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.12 }}
                                    whileHover={{ y: -8, transition: { duration: 0.25 } }}
                                    className={`group relative rounded-3xl border border-white/8 ${c.border} p-8 overflow-hidden cursor-default transition-all duration-300 hover:shadow-2xl ${c.glow}`}
                                    style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #070709 100%)' }}
                                >
                                    {/* Top accent line */}
                                    <div className={`absolute top-0 left-8 right-8 h-px ${c.line} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />

                                    {/* Background glow */}
                                    <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl'
                                        style={{ background: `radial-gradient(ellipse at top left, rgba(var(--glow), 0.05) 0%, transparent 60%)` }} />

                                    {/* Tag */}
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium mb-6 ${c.tag}`}>
                                        <span className='w-1 h-1 rounded-full bg-current' />
                                        {h.tag}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${c.icon} transition-transform duration-300 group-hover:scale-110`}>
                                        {h.icon}
                                    </div>

                                    <h3 className='text-lg font-bold text-white mb-3 group-hover:text-white transition-colors'>{h.title}</h3>
                                    <p className='text-sm text-zinc-600 leading-relaxed group-hover:text-zinc-500 transition-colors'>{h.desc}</p>

                                    {/* Hover arrow */}
                                    <div className='mt-6 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0'>
                                        <span className='text-xs text-zinc-600'>Learn more</span>
                                        <ArrowRight size={12} className='text-zinc-600' />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Stats row */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className='mt-16 grid grid-cols-3 gap-4'
                    >
                        {[
                            { value: "< 3s", label: "Generation time" },
                            { value: "100%", label: "Responsive output" },
                            { value: "∞", label: "Creative possibilities" },
                        ].map((s, i) => (
                            <div key={i} className='rounded-2xl border border-white/6 bg-white/2 p-6 text-center'>
                                <p className='text-3xl font-black bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent'>{s.value}</p>
                                <p className='mt-1.5 text-xs text-zinc-700'>{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </section>
            )}

            {/* ── User Websites ── */}
            {userData && websites?.length > 0 && (
                <section className='relative z-10 max-w-6xl mx-auto px-6 pb-40'>
                    <div className='flex items-end justify-between mb-10'>
                        <div>
                            <p className='text-xs text-zinc-700 uppercase tracking-widest mb-2'>Recent Work</p>
                            <h3 className='text-3xl font-black text-white'>Your Websites</h3>
                        </div>
                        <button
                            onClick={() => navigate("/dashboard")}
                            className='group flex items-center gap-1.5 text-sm text-zinc-600 hover:text-white transition-colors duration-200'
                        >
                            View all
                            <ArrowRight size={14} className='group-hover:translate-x-1 transition-transform duration-200' />
                        </button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        {websites.slice(0, 3).map((w, i) => (
                            <motion.div
                                key={w._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                onClick={() => navigate(`/editor/${w._id}`)}
                                className="group cursor-pointer rounded-3xl border border-white/8 hover:border-white/15 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
                                style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #070709 100%)' }}
                            >
                                {/* Preview area */}
                                <div className='relative h-48 bg-[#050507] overflow-hidden'>
                                    {/* Browser chrome */}
                                    <div className='absolute top-0 left-0 right-0 h-7 bg-[#0c0c12] border-b border-white/6 flex items-center px-3 gap-1.5 z-10'>
                                        <span className='w-2 h-2 rounded-full bg-red-500/50' />
                                        <span className='w-2 h-2 rounded-full bg-yellow-500/50' />
                                        <span className='w-2 h-2 rounded-full bg-emerald-500/50' />
                                        <div className='flex-1 mx-3 h-3.5 rounded-md bg-white/4 border border-white/6' />
                                    </div>
                                    {/* iFrame */}
                                    <div className='absolute top-7 left-0 right-0 bottom-0'>
                                        <iframe
                                            srcDoc={w.latestCode}
                                            className='w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white'
                                        />
                                    </div>
                                    {/* Hover overlay */}
                                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center z-20'>
                                        <div className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-xl'>
                                            <ExternalLink size={12} />
                                            Open Editor
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className='p-5 border-t border-white/5'>
                                    <div className='flex items-start justify-between gap-3'>
                                        <div className='flex-1 min-w-0'>
                                            <h4 className='text-sm font-semibold text-white line-clamp-1 group-hover:text-violet-300 transition-colors duration-200'>{w.title}</h4>
                                            <p className='text-xs text-zinc-700 mt-1'>
                                                Updated {new Date(w.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className='w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0'>
                                            <ArrowRight size={13} className='text-violet-400' />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Footer ── */}
            <footer className='relative z-10 border-t border-white/[0.05]'>
                <div className='max-w-6xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-6'>
                    {/* Brand */}
                    <div className='flex items-center gap-3'>
                        <div className='w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20'>
                            <Sparkles size={12} className='text-white' />
                        </div>
                        <div className='flex items-baseline gap-0.5'>
                            <span className='text-sm font-bold text-zinc-400'>IntelliWeb</span>
                            <span className='text-sm font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent'>.ai</span>
                        </div>
                    </div>

                    {/* Links */}
                    <div className='flex items-center gap-6'>
                        <button onClick={() => navigate("/pricing")} className='text-xs text-zinc-700 hover:text-zinc-400 transition-colors'>Pricing</button>
                        {userData && <button onClick={() => navigate("/dashboard")} className='text-xs text-zinc-700 hover:text-zinc-400 transition-colors'>Dashboard</button>}
                    </div>

                    <p className='text-xs text-zinc-800'>
                        &copy; {new Date().getFullYear()} IntelliWeb.ai — All rights reserved.
                    </p>
                </div>
            </footer>

            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

export default Home