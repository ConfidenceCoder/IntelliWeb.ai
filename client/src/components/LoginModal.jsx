import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import axios from "axios"
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { Sparkles, Shield, Zap, X } from 'lucide-react'

function LoginModal({ open, onClose }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleGoogleAuth = async () => {
        setLoading(true)
        setError("")
        try {
            const result = await signInWithPopup(auth, provider)
            const { data } = await axios.post(`${serverUrl}/api/auth/google`, {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL
            }, { withCredentials: true })
            dispatch(setUserData(data))
            onClose()
        } catch (error) {
            console.log(error)
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <div className='absolute inset-0 bg-black/75 backdrop-blur-2xl' />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.88, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-md z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Outer glow border */}
                        <div className='absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-violet-500/50 via-indigo-500/30 to-transparent' />

                        {/* Card */}
                        <div className='relative rounded-3xl overflow-hidden border border-white/8'
                            style={{ background: 'linear-gradient(135deg, #0e0c18 0%, #0a0910 100%)' }}
                        >

                            {/* Ambient background orbs */}
                            <motion.div
                                animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
                                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute -top-36 -left-36 w-80 h-80 rounded-full"
                                style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)' }}
                            />
                            <motion.div
                                animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.15, 1] }}
                                transition={{ duration: 7, repeat: Infinity, delay: 2.5, ease: 'easeInOut' }}
                                className="absolute -bottom-36 -right-36 w-80 h-80 rounded-full"
                                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }}
                            />

                            {/* Top accent line */}
                            <div className='absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent' />

                            {/* Close button */}
                            <button
                                className='absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center rounded-xl border border-white/8 bg-white/4 text-zinc-500 hover:text-white hover:bg-white/10 hover:border-white/15 transition-all duration-200'
                                onClick={onClose}
                            >
                                <X size={14} />
                            </button>

                            {/* Content */}
                            <div className='relative px-8 pt-12 pb-10'>

                                {/* Logo + Brand */}
                                <div className='flex flex-col items-center mb-8'>
                                    <div className='relative mb-5'>
                                        <div className='absolute inset-0 rounded-2xl bg-violet-500/30 blur-xl scale-125' />
                                        <div className='relative w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/30'>
                                            <Sparkles size={24} className='text-white' />
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <div className='inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-violet-500/25 bg-violet-500/8 mb-5'>
                                        <span className='w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse' />
                                        <span className='text-xs font-medium text-violet-300'>AI-Powered Website Builder</span>
                                    </div>

                                    <h2 className='text-3xl font-black tracking-tight text-center leading-tight mb-2'>
                                        <span className='text-white'>Welcome to </span>
                                        <span className='bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent'>
                                            IntelliWeb.ai
                                        </span>
                                    </h2>
                                    <p className='text-sm text-zinc-600 text-center max-w-xs'>
                                        Sign in to start building premium AI-generated websites instantly
                                    </p>
                                </div>

                                {/* Error message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className='mb-4'
                                        >
                                            <div className='flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/8 border border-red-500/20'>
                                                <span className='text-red-400 text-xs'>⚠</span>
                                                <p className='text-xs text-red-400'>{error}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Google Sign In Button */}
                                <motion.button
                                    whileHover={!loading ? { scale: 1.02 } : {}}
                                    whileTap={!loading ? { scale: 0.98 } : {}}
                                    onClick={handleGoogleAuth}
                                    disabled={loading}
                                    className="group relative w-full h-14 rounded-2xl overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                                >
                                    {/* Button bg */}
                                    <div className='absolute inset-0 bg-white transition-all duration-300 group-hover:bg-zinc-50' />
                                    <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                                        style={{ background: 'radial-gradient(ellipse at top, rgba(124,58,237,0.06) 0%, transparent 60%)' }} />
                                    {/* Glow */}
                                    <div className='absolute inset-0 -z-10 blur-xl bg-white opacity-0 group-hover:opacity-30 transition-opacity duration-300 scale-110' />

                                    <div className='relative flex items-center justify-center gap-3'>
                                        {loading ? (
                                            <>
                                                <div className='w-4 h-4 rounded-full border-2 border-black/20 border-t-black animate-spin' />
                                                <span className='text-black font-semibold text-sm'>Signing in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <img
                                                    src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                                                    alt="Google"
                                                    className='h-5 w-5'
                                                />
                                                <span className='text-black font-bold text-sm'>Continue with Google</span>
                                            </>
                                        )}
                                    </div>
                                </motion.button>

                                {/* Divider */}
                                <div className='flex items-center gap-4 my-8'>
                                    <div className='h-px flex-1 bg-white/6' />
                                    <div className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/3 border border-white/6'>
                                        <Shield size={11} className='text-zinc-600' />
                                        <span className='text-xs text-zinc-600'>Secure & Encrypted</span>
                                    </div>
                                    <div className='h-px flex-1 bg-white/6' />
                                </div>

                                {/* Trust badges */}
                                <div className='flex items-center justify-center gap-5 mb-8'>
                                    {[
                                        { icon: <Shield size={12} className='text-violet-400' />, label: "Privacy first" },
                                        { icon: <Zap size={12} className='text-yellow-400' />, label: "Instant access" },
                                        { icon: <Sparkles size={12} className='text-cyan-400' />, label: "Free to start" },
                                    ].map((badge, i) => (
                                        <div key={i} className='flex items-center gap-1.5'>
                                            {badge.icon}
                                            <span className='text-xs text-zinc-700'>{badge.label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Terms */}
                                <p className='text-xs text-zinc-700 leading-relaxed text-center'>
                                    By continuing, you agree to our{" "}
                                    <span className="text-zinc-500 underline underline-offset-2 cursor-pointer hover:text-zinc-300 transition-colors">
                                        Terms of Service
                                    </span>{" "}
                                    and{" "}
                                    <span className="text-zinc-500 underline underline-offset-2 cursor-pointer hover:text-zinc-300 transition-colors">
                                        Privacy Policy
                                    </span>.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default LoginModal
