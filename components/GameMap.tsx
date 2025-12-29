
import React from 'react';
import { Territory, PlayerId, Player } from '../types';

interface GameMapProps {
  territories: Territory[];
  players: Record<PlayerId, Player>;
  onTerritoryClick: (territoryId: string) => void;
  selectedTerritoryId: string | null;
  phase: string;
}

const GameMap: React.FC<GameMapProps> = ({ territories, players, onTerritoryClick, selectedTerritoryId, phase }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-[#1a0f00]">
      <div className="relative w-[800px] h-[500px] parchment rounded-xl border-8 border-[#5d4037] shadow-inner overflow-hidden">
        {/* Background Image/Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/map/1200/800')] bg-cover grayscale pointer-events-none"></div>
        
        <svg viewBox="0 0 500 300" className="w-full h-full drop-shadow-2xl">
          {territories.map((t) => {
            const owner = t.ownerId ? players[t.ownerId] : null;
            const isSelected = selectedTerritoryId === t.id;

            return (
              <g 
                key={t.id} 
                className="cursor-pointer group transition-all duration-300"
                onClick={() => onTerritoryClick(t.id)}
              >
                <path
                  d={t.path}
                  fill={owner ? owner.color : '#a8a29e'}
                  fillOpacity={isSelected ? 0.9 : 0.6}
                  stroke={isSelected ? '#fde047' : '#444'}
                  strokeWidth={isSelected ? 3 : 1}
                  className="transition-all hover:fill-opacity-80"
                />
                
                {/* Territory Label */}
                <text
                  x={getCentroid(t.path).x}
                  y={getCentroid(t.path).y}
                  textAnchor="middle"
                  className="fill-white text-[10px] font-bold arabic-font pointer-events-none drop-shadow-lg"
                  style={{ userSelect: 'none' }}
                >
                  {t.name}
                </text>

                {/* Points Label */}
                <text
                  x={getCentroid(t.path).x}
                  y={getCentroid(t.path).y + 12}
                  textAnchor="middle"
                  className="fill-yellow-400 text-[8px] font-bold pointer-events-none"
                >
                  {t.points}
                </text>

                {/* Owner indicator if owned */}
                {owner && (
                    <circle
                        cx={getCentroid(t.path).x}
                        cy={getCentroid(t.path).y - 15}
                        r="5"
                        fill={owner.color}
                        stroke="white"
                        strokeWidth="1"
                    />
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Icons/Ships Decor */}
        <div className="absolute bottom-4 left-4 text-4xl text-[#5d4037] opacity-40">
           <i className="fa-solid fa-ship"></i>
        </div>
        <div className="absolute top-10 right-10 text-3xl text-[#5d4037] opacity-40">
           <i className="fa-solid fa-compass"></i>
        </div>
      </div>
    </div>
  );
};

// Helper to find a rough center for SVG paths (simulated for these simple polygons)
function getCentroid(path: string) {
  const coords = path.match(/[\d.]+/g);
  if (!coords) return { x: 0, y: 0 };
  let x = 0, y = 0;
  for (let i = 0; i < coords.length; i += 2) {
    x += parseFloat(coords[i]);
    y += parseFloat(coords[i+1]);
  }
  return { x: x / (coords.length / 2), y: y / (coords.length / 2) };
}

export default GameMap;
