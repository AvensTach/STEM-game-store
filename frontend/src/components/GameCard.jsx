// frontend/src/components/GameCard.jsx
import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';

export const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function GameCard({ game }) {
  return (
    <motion.div variants={cardVariant} className="h-full">
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        glareEnable={true}
        glareMaxOpacity={0.15}
        scale={1.02}
        transitionSpeed={400}
        className="h-full"
      >
        <Link to={`/game/${game.id}`} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500 transition-colors block flex flex-col h-full shadow-lg">
          <div className="relative h-48 w-full bg-slate-800 flex-shrink-0">
            <img src={game.cover_image_url} alt={game.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />

            {game.minimum_subscription_tier && (
              <div className="absolute top-2 right-2 group/badge">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-400 px-2 py-1 rounded shadow-sm cursor-help block">
                  Included
                </span>
                <div className="absolute top-full right-0 mt-2 w-max px-3 py-1.5 bg-slate-950 text-slate-200 text-xs font-medium rounded-lg opacity-0 group-hover/badge:opacity-100 transition-all pointer-events-none shadow-xl border border-slate-700 z-20">
                  Requires <span className="font-bold text-emerald-400">{game.minimum_subscription_tier.name}</span>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 flex flex-col flex-grow bg-slate-900">
            <h3 className="font-bold truncate mb-1 text-white">{game.title}</h3>
            <p className="text-indigo-400 font-extrabold mt-auto">${game.price}</p>
          </div>
        </Link>
      </Tilt>
    </motion.div>
  );
}