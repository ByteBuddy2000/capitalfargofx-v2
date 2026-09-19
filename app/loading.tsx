// app/(dashboard)/dashboard/loading.tsx

"use client"

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="hidden max-w-sm text-center">
      {/* <div className="w-full max-w-sm text-center"> */}
        <div className="mb-6">
          <h1 className="animate-pulse text-2xl font-bold text-blue-600">
            CapitalsFargoFX
          </h1>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-linear-to-r from-blue-600 to-cyan-500" />
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Preparing your investment dashboard...
        </p>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  )
}