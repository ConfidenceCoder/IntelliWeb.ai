import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App'
import axios from 'axios'
import { motion, AnimatePresence } from 'motion/react'
import { Sparkles, Globe, AlertTriangle, ExternalLink } from 'lucide-react'

function LiveSite() {
    const { id } = useParams()
    const [html, setHtml] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const handleGetWebsite = async () => {
            setLoading(true)
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-by-slug/${id}`)
                setHtml(result.data.latestCode)
                setLoading(false)
            } catch (error) {
                console.log(error)
                setError("Site not found")
                setLoading(false)
            }
        }
        handleGetWebsite()
    }, [id])

    // ── Error State ──
    if (error) {
        return (
            <div className='h-screen flex items-center justify-center bg-[#020204] text-white overflow-hidden'>

                {/* Background */}
                <div className='fixed inset-0 pointer-events-none'>
                    <div className='absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] rounded-full'
                        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
                    <div className='absolute inset-0'
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                            backgroundSize: '36px 36px',
                        }} />
                    <div className='absolute inset-0 bg-gradient-to-b from-[#020204] via-transparent to-[#020204]' />
                    <div className='absolute inset-0 bg-gradient-to-r from-[#020204] via-transparent to-[#020204]' />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className='relative z-10 flex flex-col items-center gap-6 text-center px-6'
                >
                    {/* Icon */}
                    <div className='relative'>
                        <div className='absolute inset-0 rounded-3xl bg-red-500/20 blur-2xl scale-125' />
                        <div className='relative w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500/15 to-red-600/10 border border-red-500/25 flex items-center justify-center'>
                            <AlertTriangle size={32} className='text-red-400' />
                        </div>
                    </div>

                    {/* Text */}
                    <div>
                        <h1 className='text-3xl font-black text-white mb-2'>404 — Not Found</h1>
                        <p className='text-zinc-600 text-sm max-w-xs'>
                            The site you're looking for doesn't exist or may have been removed.
                        </p>
                    </div>

                    {/* Back button */}
                    <a
                        href='/'
                        className='group relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold'
                    >
                        <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-indigo-500' />
                        <div className='absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-50 scale-110' />
                        <Sparkles size={14} className='relative text-white' />
                        <span className='relative text-white'>Go to IntelliWeb.ai</span>
                    </a>

                    {/* Branding */}
                    <div className='flex items-center gap-2 mt-2'>
                        <div className='w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center'>
                            <Sparkles size={10} className='text-white' />
                        </div>
                        <div className='flex items-baseline gap-0.5'>
                            <span className='text-xs font-bold text-zinc-600'>IntelliWeb</span>
                            <span className='text-xs font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent'>.ai</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    // ── Loading State ──
    if (loading) {
        return (
            <div className='h-screen flex items-center justify-center bg-[#020204] text-white overflow-hidden'>

                {/* Background */}
                <div className='fixed inset-0 pointer-events-none'>
                    <div className='absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] rounded-full'
                        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
                    <div className='absolute inset-0'
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                            backgroundSize: '36px 36px',
                        }} />
                    <div className='absolute inset-0 bg-gradient-to-b from-[#020204] via-transparent to-[#020204]' />
                    <div className='absolute inset-0 bg-gradient-to-r from-[#020204] via-transparent to-[#020204]' />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className='relative z-10 flex flex-col items-center gap-6'
                >
                    {/* Spinner */}
                    <div className='relative w-16 h-16'>
                        <div className='absolute inset-0 rounded-full border-2 border-violet-500/15' />
                        <div className='absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin' />
                        <div className='absolute inset-0 rounded-full border-2 border-transparent border-b-indigo-500/50 animate-spin'
                            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                        <div className='absolute inset-3 rounded-full bg-violet-500/10 flex items-center justify-center'>
                            <Globe size={16} className='text-violet-400' />
                        </div>
                    </div>

                    <div className='text-center'>
                        <p className='text-sm font-semibold text-zinc-300 mb-1'>Loading Site</p>
                        <p className='text-xs text-zinc-700'>Fetching content...</p>
                    </div>

                    {/* Branding */}
                    <div className='flex items-center gap-2'>
                        <div className='w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center'>
                            <Sparkles size={10} className='text-white' />
                        </div>
                        <div className='flex items-baseline gap-0.5'>
                            <span className='text-xs font-bold text-zinc-600'>IntelliWeb</span>
                            <span className='text-xs font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent'>.ai</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    // ── Live Site ──
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className='w-screen h-screen relative'
            >
                {/* Powered by badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className='fixed bottom-5 right-5 z-50'
                >
                    <a
                        href='/'
                        target='_blank'
                        rel='noreferrer'
                        className='group flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl hover:border-white/20 hover:bg-black/85 transition-all duration-300 shadow-2xl shadow-black/50'
                    >
                        <div className='w-5 h-5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30'>
                            <Sparkles size={10} className='text-white' />
                        </div>
                        <div className='flex items-baseline gap-0.5'>
                            <span className='text-[11px] font-bold text-zinc-400 group-hover:text-zinc-300 transition-colors'>IntelliWeb</span>
                            <span className='text-[11px] font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent'>.ai</span>
                        </div>
                        <ExternalLink size={10} className='text-zinc-700 group-hover:text-zinc-500 transition-colors ml-0.5' />
                    </a>
                </motion.div>

                {/* iframe */}
                <iframe
                    title='Live Site'
                    srcDoc={html}
                    className='w-screen h-screen border-none'
                    sandbox='allow-scripts allow-same-origin allow-forms'
                />
            </motion.div>
        </AnimatePresence>
    )
}

export default LiveSite