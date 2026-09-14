"use client"

import React, { useEffect, useState } from "react"
import {
  Play,
  Clock,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  Volume2,
  VolumeX,
} from "lucide-react"

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  category: string
  duration: string
  topics: string[]
  videoSrc: string
}


/* -------------------------------------------------------------------------- */
/* Protected Video Props                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Prevents common browser actions that expose/download the video:
 * - Right-click / context menu
 * - Dragging the video
 * - Text/image selection
 * - Direct pointer interaction with the video element
 *
 * Note:
 * Browser-native video controls are intentionally preserved in the modal.
 * No client-side protection can completely prevent someone from obtaining
 * media that is delivered to the browser.
 */
const protectedVideoProps = {
  onContextMenu: (event: React.MouseEvent<HTMLVideoElement>) => {
    event.preventDefault()
  },
  onDragStart: (event: React.DragEvent<HTMLVideoElement>) => {
    event.preventDefault()
  },
  draggable: false,
}

/* -------------------------------------------------------------------------- */
/* Video Preview Modal                                                        */
/* -------------------------------------------------------------------------- */

export const VideoPreviewModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title,
  category,
  duration,
  topics,
  videoSrc,
}) => {
  const [isMuted, setIsMuted] = useState(false)

  /* ------------------------------------------------------------------------ */
  /* Prevent body scrolling while modal is open                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  /* ------------------------------------------------------------------------ */
  /* Escape key                                                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md select-none"
      onClick={onClose}
      onContextMenu={(event) => event.preventDefault()}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} video preview`}
    >
      <div
        className="relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-2xl shadow-black/50"
        onClick={(event) => event.stopPropagation()}
        onContextMenu={(event) => event.preventDefault()}
      >
        {/* ------------------------------------------------------------------ */}
        {/* Header                                                             */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950/95 px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="rounded border border-blue-500/30 bg-blue-950 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wide text-blue-300 sm:text-xs">
              {category}
            </span>

            <span className="flex shrink-0 items-center gap-1 font-mono text-[10px] text-slate-400 sm:text-xs">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              {duration}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-3 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close video preview"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Real Video Player                                                   */}
        {/* ------------------------------------------------------------------ */}

        <div
          className="relative bg-black select-none"
          onContextMenu={(event) => event.preventDefault()}
          onDragStart={(event) => event.preventDefault()}
        >
          <video
            key={videoSrc}
            className="aspect-video w-full bg-black object-contain select-none"
            src={videoSrc}
            controls
            autoPlay
            playsInline
            muted={isMuted}
            preload="metadata"
            controlsList="nodownload"
            disablePictureInPicture
            {...protectedVideoProps}
          >
            Your browser does not support the HTML5 video element.
          </video>

          {/* Video Information Overlay */}
          <div className="pointer-events-none absolute top-3 left-3 rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-white/80 uppercase">
              CapitalsFargoFX Academy
            </span>
          </div>

          {/* Mute Toggle */}
          <button
            type="button"
            onClick={() => setIsMuted((current) => !current)}
            className="absolute right-3 bottom-14 z-20 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/80"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Video Title                                                         */}
        {/* ------------------------------------------------------------------ */}

        <div className="border-b border-slate-800 bg-slate-900 px-5 py-4 sm:px-6">
          <h4 className="text-lg font-bold tracking-tight text-white sm:text-xl">
            {title}
          </h4>

          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Educational video briefing for institutional and private
            investors.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Topics                                                              */}
        {/* ------------------------------------------------------------------ */}

        <div className="hidden overflow-y-auto bg-slate-900 p-5 sm:p-6">
          <div className="mb-3 text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">
            Core Curriculum Modules
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {topics.map((topic, index) => (
              <div
                key={`${topic}-${index}`}
                className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs font-medium text-slate-200"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{topic}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Close Briefing
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Section One — Crypto Fundamentals                                          */
/* -------------------------------------------------------------------------- */

export const VideoShowcaseSectionOne: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const videoSrc = "/crypto-fundamental-analysis.mp4"

  const topics = [
    "Understanding cryptocurrency",
    "Blockchain infrastructure",
    "Digital asset markets",
    "Cryptocurrency settlement",
  ]

  return (
    <>
      <section
        id="video-showcase-fundamentals"
        className="bg-linear-to-b from-transparent via-slate-900/30 to-transparent py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* ---------------------------------------------------------------- */}
            {/* Left Content                                                     */}
            {/* ---------------------------------------------------------------- */}

            <div className="space-y-6 lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/80 px-3 py-1 font-mono text-xs font-bold tracking-wider text-blue-300 uppercase">
                <BookOpen className="h-3.5 w-3.5 text-blue-400" />
                <span>Understand Digital Assets</span>
              </div>

              <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl">
                Explore the Future of Digital Finance
              </h2>

              <p className="text-base leading-relaxed text-slate-300">
                Gain institutional perspective on blockchain settlement
                mechanics, decentralized liquidity, and how modern cryptographic
                rails are replacing legacy custodial friction.
              </p>

              {/* Supporting Topics */}
              <div className="space-y-3 pt-2">
                {topics.map((topic, index) => (
                  <div
                    key={`${topic}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3 shadow-xs transition-colors hover:border-slate-700"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-blue-600/30 bg-blue-950 text-xs font-bold text-blue-400">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span className="text-sm font-semibold text-slate-200">
                      {topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Right Video Card                                                 */}
            {/* ---------------------------------------------------------------- */}

            <div className="lg:col-span-7">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setModalOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setModalOpen(true)
                  }
                }}
                onContextMenu={(event) => event.preventDefault()}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500 select-none"
                aria-label="Watch Cryptocurrency Foundations and Custody video"
              >
                <div
                  className="relative aspect-16/10 w-full overflow-hidden sm:aspect-video"
                  onContextMenu={(event) => event.preventDefault()}
                  onDragStart={(event) => event.preventDefault()}
                >
                  {/* Real Video Preview */}
                  <video
                    className="absolute inset-0 h-full w-full object-cover select-none"
                    src={videoSrc}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    controlsList="nodownload"
                    disablePictureInPicture
                    {...protectedVideoProps}
                  />

                  {/* Cinematic Overlay */}
                  <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-tr from-slate-950 via-slate-900/65 to-blue-900/50 transition-opacity duration-300 group-hover:via-slate-900/55" />

                  {/* Geometric Grid */}
                  <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-size-[16px_16px]] opacity-20" />

                  {/* Content */}
                  <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8">
                    {/* Top Metadata */}
                    <div className="hidden items-center justify-between">
                      <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs font-medium text-white backdrop-blur-md">
                        Crypto Fundamentals
                      </div>

                      <div className="flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-900/90 px-3 py-1 font-mono text-xs text-white backdrop-blur-md">
                        <Clock className="h-3.5 w-3.5 text-blue-400" />
                        <span>08:45 MIN</span>
                      </div>
                    </div>

                    {/* Play Button */}
                    <div className="my-auto flex flex-col items-center gap-3 self-center">
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white text-blue-600 shadow-2xl transition-transform duration-300 group-hover:scale-110">
                        <span className="absolute inset-0 animate-ping rounded-full bg-white opacity-25" />

                        <Play className="ml-1 h-8 w-8 fill-blue-600 text-blue-600" />
                      </div>

                      <span className="hidden text-xs font-bold tracking-widest text-white/90 uppercase drop-shadow-sm">
                        Watch Briefing
                      </span>
                    </div>

                    {/* Bottom Metadata */}
                    <div className="flex items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-950/70 p-3 text-white backdrop-blur-md sm:p-4">
                      <div>
                        <div className="text-sm font-bold">
                          Cryptocurrency Foundations & Custody
                        </div>

                        <div className="text-xs text-slate-300">
                          Institutional Investor Series • Part I
                        </div>
                      </div>

                      <div className="hidden items-center gap-1 font-mono text-xs font-semibold text-cyan-300 sm:flex">
                        <span>Interactive Video</span>

                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoPreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Crypto Fundamentals & Settlement Mechanics"
        category="Institutional Series"
        duration="08:45 MIN"
        topics={topics}
        videoSrc={videoSrc}
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Section Two — Digital Asset Strategies                                     */
/* -------------------------------------------------------------------------- */

export const VideoShowcaseSectionTwo: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const videoSrc =
    "/digital_assets,_policy_reform_and_smarter_execution_set_the_agenda_for_fixed_income_in_2026.mp4"

  const topics = [
    "Liquidity & Depth",
    "Algorithmic Market Routing",
    "Digital Asset Custody",
    "Portfolio Allocation",
    "Automated Settlement",
  ]

  return (
    <>
      <section
        id="video-showcase-strategies"
        className="relative overflow-hidden bg-slate-900 py-20 text-white"
      >
        {/* ------------------------------------------------------------------ */}
        {/* Background Effects                                                  */}
        {/* ------------------------------------------------------------------ */}

        <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ---------------------------------------------------------------- */}
          {/* Section Header                                                    */}
          {/* ---------------------------------------------------------------- */}

          <div className="mx-auto mb-12 max-w-3xl space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-1 font-mono text-xs font-bold tracking-wider text-cyan-400 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Inside Digital Asset Markets</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              See How Modern Digital Asset Strategies Work
            </h2>

            <p className="text-base text-slate-400">
              A cinematic deep dive into high-throughput cross-exchange
              liquidity, multi-signature cold vault protocols, and automated
              epoch distributions.
            </p>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Main Showcase Container                                           */}
          {/* ---------------------------------------------------------------- */}

          <div className="rounded-3xl border border-slate-700/80 bg-slate-800/60 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              {/* -------------------------------------------------------------- */}
              {/* Left Video                                                     */}
              {/* -------------------------------------------------------------- */}

              <div
                role="button"
                tabIndex={0}
                onClick={() => setModalOpen(true)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setModalOpen(true)
                  }
                }}
                onContextMenu={(event) => event.preventDefault()}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 shadow-xl transition-all duration-300 hover:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 lg:col-span-7 select-none"
                aria-label="Watch Digital Asset Strategies and Liquidity Execution video"
              >
                <div
                  className="relative aspect-video w-full overflow-hidden"
                  onContextMenu={(event) => event.preventDefault()}
                  onDragStart={(event) => event.preventDefault()}
                >
                  {/* Real Video Preview */}
                  <video
                    className="absolute inset-0 h-full w-full object-cover select-none"
                    src={videoSrc}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    controlsList="nodownload"
                    disablePictureInPicture
                    {...protectedVideoProps}
                  />

                  {/* Cinematic Overlay */}
                  <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-slate-950 via-slate-900/60 to-transparent" />

                  {/* Telemetry */}
                  <div className="pointer-events-none hidden inset-0 z-10 items-center justify-center opacity-40">
                    <div className="flex h-full w-full flex-col justify-between p-4 font-mono text-[10px] text-cyan-400">
                      <div className="flex justify-between gap-4">
                        <span>ROUTING: 100 GIGABIT FIBER</span>
                        <span>LATENCY: 0.12ms</span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span>COLD VAULT: 3-OF-5 MULTI-SIG</span>
                        <span>SETTLEMENT: INSTANT</span>
                      </div>
                    </div>
                  </div>

                  {/* Play Button */}
                  <div className="relative z-20 mt-24 flex flex-col items-center gap-3 pointer-events-none">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 transition-transform group-hover:scale-105">
                      <Play className="ml-1 h-8 w-8 fill-white" />
                    </div>

                    <span className="hidden font-mono text-xs font-bold tracking-widest text-cyan-300">
                      PLAY STRATEGY BRIEFING
                    </span>
                  </div>

                  {/* Bottom Strip */}
                  <div className="pointer-events-none absolute right-4 bottom-3 left-4 z-20 flex items-center justify-between text-xs text-slate-300">
                    <span className="rounded border border-slate-700 bg-slate-900/80 px-2 py-0.5 font-mono backdrop-blur-md">
                      Digital Asset Strategies
                    </span>
                  </div>
                </div>
              </div>

              {/* -------------------------------------------------------------- */}
              {/* Right Strategic Topics                                          */}
              {/* -------------------------------------------------------------- */}

              <div className="space-y-4 lg:col-span-5">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Architectural Pillars of Execution
                </h3>

                <p className="text-xs leading-relaxed text-slate-400">
                  How CapitalsFargoFX bridges institutional quantitative
                  methodologies with decentralized digital markets.
                </p>

                <div className="space-y-2 pt-2">
                  {topics.map((topic, index) => (
                    <div
                      key={`${topic}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3 transition-colors hover:border-slate-700"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-950 font-mono text-xs font-bold text-cyan-400">
                          {index + 1}
                        </span>

                        <span className="text-sm font-medium text-slate-200">
                          {topic}
                        </span>
                      </div>

                      <span className="rounded border border-emerald-500/20 bg-emerald-950/60 px-2 py-0.5 font-mono text-[10px] text-emerald-400 uppercase">
                        Operational
                      </span>
                    </div>
                  ))}
                </div>

                {/* Launch Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:from-blue-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  >
                    <span>Launch Strategy Overview</span>

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoPreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Digital Asset Strategies & Liquidity Execution"
        category="Advanced Mechanics"
        duration="12:18 MIN"
        topics={topics}
        videoSrc={videoSrc}
      />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Default Export                                                             */
/* -------------------------------------------------------------------------- */

const VideoShowcase: React.FC = () => {
  return (
    <>
      <VideoShowcaseSectionOne />
      <VideoShowcaseSectionTwo />
    </>
  )
}

export default VideoShowcase