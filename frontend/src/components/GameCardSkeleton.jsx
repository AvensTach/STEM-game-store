// frontend/src/components/GameCardSkeleton.jsx
export default function GameCardSkeleton() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-48 bg-slate-800 w-full"></div>
      <div className="p-4 flex flex-col flex-grow gap-3">
        <div className="h-5 bg-slate-700 rounded w-3/4"></div>
        <div className="h-4 bg-slate-800 rounded w-1/2"></div>
        <div className="h-6 bg-indigo-900/50 rounded w-1/4 mt-auto"></div>
      </div>
    </div>
  );
}