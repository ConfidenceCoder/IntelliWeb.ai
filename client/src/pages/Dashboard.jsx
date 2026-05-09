import { ArrowLeft, Check, Rocket, Share2, Plus, Globe, Clock, Sparkles, Layers } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "motion/react"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { serverUrl } from '../App'

function Dashboard() {
    const { userData } = useSelector(state => state.user)
    const navigate = useNavigate()
    const [websites, setWebsites] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [copiedId, setCopiedId] = useState(null)
    const [deployingId, setDeployingId] = useState(null)

    const handleDeploy = async (id) => {
        setDeployingId(id)
        try {
            const result = await axios.get(`${serverUrl}/api/website/deploy/${id}`, { withCredentials: true })
            window.open(`${result.data.url}`, "_blank")
            setWebsites((prev) =>
                prev.map((w) =>
                    w._id === id
                        ? { ...w, deployed: true, deployUrl: result.data.url }
                        : w
                )
            )
        } catch (error) {
            console.log(error)
        } finally {
            setDeployingId(null)
        }
    }

    useEffect(() => {
        const handleGetAllWebsites = async () => {
            setLoading(true)
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])
                setLoading(false)
            } catch (error) {
                console.log(error)
                setError(error.response.data.message)
                setLoading(false)
            }
        }
        handleGetAllWebsites()
    }, [])

    const handleCopy = async (site) => {
        await navigator.clipboard.writeText(site.deployUrl)
        setCopiedId(site._id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    return (
        <div className='min-h-screen bg-[#020204] text-white overflow-x-hidden'>

            {/* ── Background ── */}
            <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
                <div className='absolute top-[-20%] left-[50%] -translate-x-1/2 w-[900px] h-[600px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
                <div className='absolute bottom-0 right-[-10%] w-[500px] h-[500px] rounded-full'
                    style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.05) 0%, transparent 70%)' }} />
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

                            {/* Left */}
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
                                    <span className='text-sm text-zinc-500'>Dashboard</span>
                                </div>
                            </div>

                            {/* Right */}
                            <button
                                onClick={() => navigate("/generate")}
                                className='group relative overflow-hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold'
                            >
                                <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 group-hover:from-violet-500 group-hover:to-indigo-500' />
                                <div className='absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-40 group-hover:opacity-70 transition-opacity duration-300 scale-110' />
                                <Plus size={15} className='relative text-white' />
                                <span className='relative text-white'>New Website</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className='relative z-10 max-w-6xl mx-auto px-6 py-12'>

                {/* ── Welcome Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
                >
                    <div>
                        <p className='text-xs text-zinc-700 uppercase tracking-widest mb-3 flex items-center gap-1.5'>
                            <span className='w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse' />
                            Welcome back
                        </p>
                        <h1 className='text-4xl md:text-5xl font-black tracking-tight'>
                            <span className='text-white'>{userData.name.split(' ')[0]}</span>
                            <span className='text-zinc-800'>'s</span>
                            <br />
                            <span className='bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent'>
                                Workspace
                            </span>
                        </h1>
                    </div>

                    {/* Stats */}
                    {websites?.length > 0 && (
                        <div className='flex items-center gap-3'>
                            <div className='px-4 py-3 rounded-2xl border border-white/6 bg-white/2 text-center min-w-[80px]'>
                                <p className='text-2xl font-black text-white'>{websites.length}</p>
                                <p className='text-xs text-zinc-700 mt-0.5'>Total Sites</p>
                            </div>
                            <div className='px-4 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center min-w-[80px]'>
                                <p className='text-2xl font-black text-emerald-400'>{websites.filter(w => w.deployed).length}</p>
                                <p className='text-xs text-zinc-700 mt-0.5'>Deployed</p>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* ── Loading ── */}
                {loading && (
                    <div className='mt-32 flex flex-col items-center gap-5'>
                        <div className='relative w-12 h-12'>
                            <div className='absolute inset-0 rounded-full border-2 border-violet-500/20' />
                            <div className='absolute inset-0 rounded-full border-2 border-transparent border-t-violet-500 animate-spin' />
                            <div className='absolute inset-2 rounded-full bg-violet-500/10 flex items-center justify-center'>
                                <Sparkles size={14} className='text-violet-400' />
                            </div>
                        </div>
                        <p className='text-sm text-zinc-600'>Loading your websites...</p>
                    </div>
                )}

                {/* ── Error ── */}
                {error && !loading && (
                    <div className='mt-32 flex flex-col items-center gap-4'>
                        <div className='w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center'>
                            <span className='text-2xl'>⚠️</span>
                        </div>
                        <p className='text-sm text-red-400'>{error}</p>
                    </div>
                )}

                {/* ── Empty State ── */}
                {websites?.length === 0 && !loading && !error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mt-24 flex flex-col items-center gap-6 text-center'
                    >
                        <div className='relative'>
                            <div className='absolute inset-0 rounded-3xl bg-violet-500/20 blur-2xl scale-110' />
                            <div className='relative w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/25 flex items-center justify-center'>
                                <Layers size={32} className='text-violet-400' />
                            </div>
                        </div>
                        <div>
                            <h3 className='text-xl font-bold text-white mb-2'>No websites yet</h3>
                            <p className='text-sm text-zinc-600 max-w-xs'>Generate your first AI-powered website and it will appear here.</p>
                        </div>
                        <button
                            onClick={() => navigate("/generate")}
                            className='group relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold'
                        >
                            <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600' />
                            <div className='absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-50 scale-110' />
                            <Plus size={15} className='relative text-white' />
                            <span className='relative text-white'>Create First Website</span>
                        </button>
                    </motion.div>
                )}

                {/* ── Grid ── */}
                {!loading && !error && websites?.length > 0 && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'>
                        {websites.map((w, i) => {
                            const copied = copiedId === w._id
                            const deploying = deployingId === w._id

                            return (
                                <motion.div
                                    key={w._id}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className="group rounded-3xl border border-white/8 hover:border-white/15 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
                                    style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #070709 100%)' }}
                                >
                                    {/* Preview */}
                                    <div
                                        className='relative h-48 bg-[#050507] overflow-hidden cursor-pointer'
                                        onClick={() => navigate(`/editor/${w._id}`)}
                                    >
                                        {/* Browser chrome */}
                                        <div className='absolute top-0 left-0 right-0 h-7 bg-[#0c0c12] border-b border-white/6 flex items-center px-3 gap-1.5 z-10'>
                                            <span className='w-2 h-2 rounded-full bg-red-500/50' />
                                            <span className='w-2 h-2 rounded-full bg-yellow-500/50' />
                                            <span className='w-2 h-2 rounded-full bg-emerald-500/50' />
                                            <div className='flex-1 mx-3 h-3 rounded-md bg-white/4 border border-white/6' />
                                        </div>

                                        {/* iframe */}
                                        <div className='absolute top-7 left-0 right-0 bottom-0'>
                                            <iframe
                                                srcDoc={w.latestCode}
                                                className='absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white'
                                            />
                                        </div>

                                        {/* Hover overlay */}
                                        <div className='absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300 flex items-center justify-center z-20'>
                                            <div className='flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-xl'>
                                                Open Editor →
                                            </div>
                                        </div>

                                        {/* Deployed badge */}
                                        {w.deployed && (
                                            <div className='absolute top-9 right-3 z-30 flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 backdrop-blur-sm'>
                                                <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' />
                                                <span className='text-[10px] font-semibold text-emerald-400'>Live</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info & Actions */}
                                    <div className='p-5 flex flex-col gap-4 flex-1 border-t border-white/5'>
                                        <div>
                                            <h3 className='text-sm font-bold text-white line-clamp-1 group-hover:text-violet-300 transition-colors duration-200'>
                                                {w.title}
                                            </h3>
                                            <div className='flex items-center gap-1.5 mt-1.5'>
                                                <Clock size={11} className='text-zinc-700' />
                                                <p className='text-xs text-zinc-700'>
                                                    {new Date(w.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        {!w.deployed ? (
                                            <button
                                                onClick={() => handleDeploy(w._id)}
                                                disabled={deploying}
                                                className="mt-auto group/btn relative overflow-hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                <div className='absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300 group-hover/btn:from-violet-500 group-hover/btn:to-indigo-500' />
                                                <div className='absolute inset-0 -z-10 blur-lg bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover/btn:opacity-60 transition-opacity duration-300 scale-110' />
                                                {deploying ? (
                                                    <>
                                                        <div className='relative w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin' />
                                                        <span className='relative text-white'>Deploying...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Rocket size={14} className='relative text-white group-hover/btn:translate-y-[-1px] transition-transform duration-200' />
                                                        <span className='relative text-white'>Deploy Website</span>
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <AnimatePresence mode='wait'>
                                                <motion.button
                                                    key={copied ? 'copied' : 'share'}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.15 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => handleCopy(w)}
                                                    className={`mt-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ${
                                                        copied
                                                            ? "bg-emerald-500/12 text-emerald-400 border border-emerald-500/25"
                                                            : "bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/15 text-zinc-300 hover:text-white"
                                                    }`}
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check size={14} />
                                                            <span>Link Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Globe size={14} className='text-zinc-500' />
                                                            <span>Share Link</span>
                                                            <Share2 size={12} className='text-zinc-600 ml-0.5' />
                                                        </>
                                                    )}
                                                </motion.button>
                                            </AnimatePresence>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Footer ── */}
            <footer className='relative z-10 mt-20 border-t border-white/[0.05] py-8'>
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

export default Dashboard