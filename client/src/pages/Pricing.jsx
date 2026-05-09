import { ArrowLeft, Check, Coins, Sparkles, Zap, Star, Shield, Users, HeadphonesIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "motion/react"
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';

const plans = [
    {
        key: "free",
        name: "Starter",
        price: "₹0",
        credits: 100,
        description: "Perfect to explore IntelliWeb.ai",
        features: [
            "AI website generation",
            "Responsive HTML output",
            "Basic animations",
        ],
        icons: [Sparkles, Zap, Star],
        popular: false,
        button: "Get Started Free",
        color: "zinc",
    },
    {
        key: "pro",
        name: "Pro",
        price: "₹499",
        credits: 500,
        description: "For serious creators & freelancers",
        features: [
            "Everything in Starter",
            "Faster generation",
            "Edit & regenerate",
        ],
        icons: [Shield, Zap, Sparkles],
        popular: true,
        button: "Upgrade to Pro",
        color: "violet",
    },
    {
        key: "enterprise",
        name: "Enterprise",
        price: "₹1499",
        credits: 1000,
        description: "For teams & power users",
        features: [
            "Unlimited iterations",
            "Highest priority queue",
            "Team collaboration",
            "Dedicated support",
        ],
        icons: [Users, Zap, Shield, HeadphonesIcon],
        popular: false,
        button: "Contact Sales",
        color: "cyan",
    },
]

function Pricing() {
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)
    const [loading, setLoading] = useState(null)

    const handleBuy = async (planKey) => {
        if (!userData) {
            navigate("/")
            return
        }
        if (planKey === "free") {
            navigate("/dashboard")
            return
        }
        setLoading(planKey)
        try {
            const result = await axios.post(`${serverUrl}/api/billing`, { planType: planKey }, { withCredentials: true })
            window.location.href = result.data.sessionUrl
        } catch (error) {
            console.log(error)
            setLoading(null)
        }
    }

    return (
        <div className='relative min-h-screen bg-[#020204] text-white overflow-x-hidden'>

            {/* ── Background ── */}
            <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
                <div className='absolute top-[-20%] left-[50%] -translate-x-1/2 w-[1000px] h-[700px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)' }} />
                <div className='absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.06) 0%, transparent 70%)' }} />
                <div className='absolute top-[30%] right-[-15%] w-[500px] h-[500px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />
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

                                <button onClick={() => navigate("/")} className='flex items-center gap-2.5 group'>
                                    <div className='w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20'>
                                        <Sparkles size={12} className='text-white' />
                                    </div>
                                    <div className='flex items-baseline gap-0.5'>
                                        <span className='text-sm font-bold text-zinc-300'>IntelliWeb</span>
                                        <span className='text-sm font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent'>.ai</span>
                                    </div>
                                </button>

                                <div className='hidden sm:flex items-center gap-1.5 text-zinc-700'>
                                    <span>/</span>
                                    <span className='text-sm text-zinc-500'>Pricing</span>
                                </div>
                            </div>

                            {/* Credits display */}
                            {userData && (
                                <div className='flex items-center gap-2 px-3.5 py-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5'>
                                    <Coins size={13} className='text-yellow-400' />
                                    <span className='text-xs text-zinc-500'>Credits</span>
                                    <span className='text-xs font-bold text-yellow-300'>{userData.credits}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className='relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-32'>

                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-20"
                >
                    {/* Badge */}
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/25 bg-violet-500/8 text-xs text-violet-300 mb-8'>
                        <Coins size={12} className='text-yellow-400' />
                        <span>Buy once. Build forever.</span>
                    </div>

                    <h1 className='text-5xl md:text-6xl font-black tracking-tight leading-tight mb-5'>
                        <span className='text-white'>Simple,</span>{' '}
                        <span className='bg-gradient-to-br from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent'>
                            Transparent
                        </span>
                        <br />
                        <span className='text-zinc-700'>Pricing</span>
                    </h1>

                    <p className='text-zinc-600 text-lg max-w-md mx-auto'>
                        No subscriptions. No hidden fees.
                        Purchase credits once and build anytime.
                    </p>
                </motion.div>

                {/* ── Plans Grid ── */}
                <div className='grid grid-cols-1 md:grid-cols-3 gap-5 items-start'>
                    {plans.map((p, i) => (
                        <motion.div
                            key={p.key}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
                            className={`relative rounded-3xl border overflow-hidden transition-all duration-300 ${
                                p.popular
                                    ? 'border-violet-500/40 shadow-2xl shadow-violet-500/15'
                                    : 'border-white/8 hover:border-white/16 hover:shadow-2xl hover:shadow-black/40'
                            }`}
                            style={{
                                background: p.popular
                                    ? 'linear-gradient(135deg, #110f1e 0%, #0c0a18 100%)'
                                    : 'linear-gradient(135deg, #0a0a0f 0%, #070709 100%)'
                            }}
                        >
                            {/* Popular glow */}
                            {p.popular && (
                                <div className='absolute inset-0 pointer-events-none'>
                                    <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent' />
                                    <div className='absolute top-[-60px] left-[50%] -translate-x-1/2 w-[200px] h-[120px] rounded-full blur-3xl'
                                        style={{ background: 'rgba(124,58,237,0.15)' }} />
                                </div>
                            )}

                            {/* Popular badge */}
                            {p.popular && (
                                <div className='absolute top-5 right-5'>
                                    <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/35'>
                                        <Star size={10} className='fill-violet-400 text-violet-400' />
                                        <span className='text-[10px] font-bold text-violet-300 uppercase tracking-wide'>Most Popular</span>
                                    </div>
                                </div>
                            )}

                            <div className='p-8'>
                                {/* Plan name & desc */}
                                <div className='mb-6'>
                                    <h2 className={`text-lg font-bold mb-1.5 ${p.popular ? 'text-violet-300' : 'text-white'}`}>
                                        {p.name}
                                    </h2>
                                    <p className='text-sm text-zinc-600'>{p.description}</p>
                                </div>

                                {/* Price */}
                                <div className='mb-6'>
                                    <div className='flex items-end gap-2'>
                                        <span className='text-5xl font-black text-white tracking-tight'>{p.price}</span>
                                        <span className='text-sm text-zinc-700 mb-2'>one-time</span>
                                    </div>
                                </div>

                                {/* Credits pill */}
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border mb-8 ${
                                    p.popular
                                        ? 'bg-yellow-500/8 border-yellow-500/20'
                                        : 'bg-white/4 border-white/8'
                                }`}>
                                    <Coins size={15} className='text-yellow-400' />
                                    <span className='text-sm font-bold text-yellow-300'>{p.credits}</span>
                                    <span className='text-sm text-zinc-600'>Credits included</span>
                                </div>

                                {/* Divider */}
                                <div className='h-px bg-white/6 mb-7' />

                                {/* Features */}
                                <ul className='space-y-3.5 mb-8'>
                                    {p.features.map((f, fi) => {
                                        const Icon = p.icons[fi] || Check
                                        return (
                                            <li key={f} className='flex items-center gap-3'>
                                                <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                                    p.popular
                                                        ? 'bg-violet-500/15 border border-violet-500/25'
                                                        : 'bg-white/5 border border-white/8'
                                                }`}>
                                                    <Check size={11} className={p.popular ? 'text-violet-400' : 'text-zinc-500'} />
                                                </div>
                                                <span className='text-sm text-zinc-400'>{f}</span>
                                            </li>
                                        )
                                    })}
                                </ul>

                                {/* CTA Button */}
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    disabled={loading !== null}
                                    onClick={() => handleBuy(p.key)}
                                    className={`group relative w-full overflow-hidden flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${
                                        p.popular
                                            ? 'text-white'
                                            : 'text-zinc-300 hover:text-white'
                                    }`}
                                >
                                    {/* Button backgrounds */}
                                    {p.popular ? (
                                        <>
                                            <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-indigo-500' />
                                            <div className='absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-60 transition-opacity duration-300 scale-110' />
                                            <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                                                style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.1) 0%, transparent 60%)' }} />
                                        </>
                                    ) : (
                                        <div className='absolute inset-0 bg-white/6 hover:bg-white/10 border border-white/8 hover:border-white/15 rounded-2xl transition-all duration-300' />
                                    )}

                                    <AnimatePresence mode='wait'>
                                        {loading === p.key ? (
                                            <motion.span
                                                key='loading'
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className='relative flex items-center gap-2'
                                            >
                                                <div className='w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin' />
                                                Redirecting...
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key='default'
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className='relative flex items-center gap-2'
                                            >
                                                {p.button}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── Guarantee row ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className='mt-16 flex flex-wrap items-center justify-center gap-8'
                >
                    {[
                        { icon: <Shield size={14} className='text-violet-400' />, text: "Secure payments via Stripe" },
                        { icon: <Zap size={14} className='text-yellow-400' />, text: "Credits never expire" },
                        { icon: <Sparkles size={14} className='text-cyan-400' />, text: "Instant activation" },
                    ].map((item, i) => (
                        <div key={i} className='flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/6 bg-white/[0.02]'>
                            {item.icon}
                            <span className='text-xs text-zinc-600'>{item.text}</span>
                        </div>
                    ))}
                </motion.div>

                {/* ── FAQ teaser ── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className='mt-20 text-center'
                >
                    <p className='text-sm text-zinc-700'>
                        Questions?{' '}
                        <a href='mailto:support@intelliweb.ai' className='text-violet-500 hover:text-violet-400 transition-colors underline underline-offset-2'>
                            Contact our team
                        </a>
                    </p>
                </motion.div>
            </div>

            {/* ── Footer ── */}
            <footer className='relative z-10 border-t border-white/[0.05] py-8'>
                <div className='max-w-6xl mx-auto px-6 flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center'>
                        <Sparkles size={10} className='text-white' />
                    </div>
                    <p className='text-xs text-zinc-800'>
                        &copy; {new Date().getFullYear()} IntelliWeb.ai — All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}

export default Pricing