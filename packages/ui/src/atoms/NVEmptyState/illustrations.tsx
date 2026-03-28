import React from 'react';

export type EmptyStateVariant = 'no-results' | 'empty-library' | 'no-favorites' | 'no-recent' | 'offline' | 'custom';

/**
 * Aesthetic Concept: "Spatial Archive Scene" (v24 - Absolute Clarity Revision)
 * - Offline: Single-layer Standard 3-Arc Wi-Fi + Single Bold Red Strike.
 * - Background: Clean Hub slots without ambiguous curved lines.
 * - Goal: Remove all ghosting and faint artifacts.
 */

const SpatialArchive = ({ color = "white", opacity = 0.04 }) => (
  <g transform="translate(115, 85)">
    <rect x="-35" y="-40" width="70" height="50" rx="6" fill={color} fillOpacity={opacity * 0.5} stroke={color} strokeOpacity={opacity} strokeWidth="1" transform="rotate(-5)" />
    <rect x="-35" y="-40" width="70" height="50" rx="6" fill={color} fillOpacity={opacity} stroke={color} strokeOpacity={opacity * 2} strokeWidth="1" transform="rotate(2)" />
    <path d="M-40 -30H-15L-8 -24H40V20H-40V-30Z" fill="#0f0f18" stroke={color} strokeOpacity={opacity * 3} strokeWidth="1.25" />
    <rect x="-40" y="-8" width="80" height="28" rx="2" fill="#0f0f18" stroke={color} strokeOpacity={opacity * 2} strokeWidth="1" />
  </g>
);

/* Document Stack Sub-theme */
const DocumentStack = ({ color = "#f59e0b", opacity = 0.05 }) => (
  <g transform="translate(115, 76)">
    <rect x="-30" y="-35" width="60" height="75" rx="4" fill={color} fillOpacity={opacity * 0.4} stroke={color} strokeOpacity={opacity} strokeWidth="1" transform="rotate(-15)" />
    <rect x="-30" y="-35" width="60" height="75" rx="4" fill={color} fillOpacity={opacity * 0.6} stroke={color} strokeOpacity={opacity * 2} strokeWidth="1" transform="rotate(8)" />
    <rect x="-30" y="-35" width="60" height="75" rx="4" fill="#0f0f18" stroke={color} strokeOpacity={opacity * 4} strokeWidth="1.25" />
  </g>
);

/* 1. No Results */
export const IllustrationNoResults = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 20)">
      <SpatialArchive color="#6366f1" />
    </g>
    <g transform="translate(75, 60)">
      <circle r="34" fill="#0f0f18" fillOpacity="0.8" stroke="#6366f1" strokeOpacity="0.15" strokeWidth="2.5" />
      <circle r="30" stroke="#6366f1" strokeOpacity="1" strokeWidth="1.25" />
      <circle r="20" fill="#6366f1" fillOpacity="0.1" />
      <g transform="translate(24, 24) rotate(45)">
        <rect width="28" height="5" rx="2.5" fill="#0f0f18" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="1.25" />
      </g>
    </g>
  </svg>
);

/* 2. Empty Library */
export const IllustrationEmptyLibrary = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 10)">
      <SpatialArchive color="#6366f1" />
    </g>
    <g transform="translate(75, 65)">
      <circle r="24" fill="#0f0f18" fillOpacity="0.9" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="1.25" strokeDasharray="4 2" />
      <path d="M0 -10V10M-10 0H10" stroke="#6366f1" strokeOpacity="1" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);

/* 3. No Favorites */
export const IllustrationNoFavorites = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <DocumentStack color="#f59e0b" />
    <g transform="translate(85, 66)">
      <path d="M0 -22L6 -8H22L10 4L14 20L0 12L-14 20L-10 4L-22 -8H-6L0 -22Z" fill="#141424" transform="translate(2, 3)" stroke="#f59e0b" strokeOpacity="0.08" strokeWidth="1" strokeLinejoin="round" />
      <path d="M0 -22L6 -8H22L10 4L14 20L0 12L-14 20L-10 4L-22 -8H-6L0 -22Z" fill="#0f0f18" stroke="#f59e0b" strokeOpacity="1" strokeWidth="1.5" strokeLinejoin="round" />
      <circle r="2.5" fill="#f59e0b" />
    </g>
  </svg>
);

/* 4. No Recent */
export const IllustrationNoRecent = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(10, 10)">
      <SpatialArchive color="#818cf8" />
    </g>
    <g transform="translate(75, 65)">
      <circle r="36" fill="#0f0f18" fillOpacity="0.9" stroke="#818cf8" strokeOpacity="0.1" strokeWidth="2.5" />
      <circle r="32" stroke="#818cf8" strokeOpacity="0.8" strokeWidth="1.25" />
      <path d="M0 0V-22" stroke="#818cf8" strokeOpacity="1" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M0 0L15 10" stroke="#c7d2fe" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);

/* 5. Offline - "Absolute Clarity Wi-Fi" (v24) */
export const IllustrationOffline = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Bottom Hub Background (Minimized for Focus) */}
    <g transform="translate(115, 110)">
      <rect x="-42" y="-28" width="84" height="38" rx="5" fill="#0f0f18" stroke="#ef4444" strokeOpacity="0.1" strokeWidth="1.25" />
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={-32 + i * 18} y="-14" width="10" height="10" rx="1.5" stroke="#ef4444" strokeOpacity="0.08" strokeWidth="1.25" />
      ))}
    </g>

    {/* Concentric Wi-Fi Arcs - Absolute Precision Center */}
    <g transform="translate(85, 60)">
      {/* Subtle Arc Fading */}
      <path d="M-34.4 0A42 42 0 0 1 34.4 0" stroke="#ef4444" strokeOpacity="0.15" strokeWidth="2.75" strokeLinecap="round" fill="none" />
      <path d="M-22.9 8A28 28 0 0 1 22.9 8" stroke="#ef4444" strokeOpacity="0.35" strokeWidth="2.75" strokeLinecap="round" fill="none" />
      <path d="M-11.5 16A14 14 0 0 1 11.5 16" stroke="#ef4444" strokeOpacity="0.65" strokeWidth="2.75" strokeLinecap="round" fill="none" />
      <circle r="4" fill="#ef4444" transform="translate(0, 24)" />


      <g transform="rotate(-40)">
        {/* 1. Background Clearing (Creates the gap behind the strike) */}
        <rect x="-4" y="-30" width="8" height="60" fill="#0f0f18" rx="4" />
        
        {/* 2. Primary Red Strike Line */}
        <rect x="-1.5" y="-28" width="3" height="56" fill="#ef4444" rx="1.5" />
        
        {/* 3. Subtle Highlight for Premium Finish */}
        <rect x="-0.75" y="-20" width="1.5" height="25" fill="white" fillOpacity="0.12" rx="0.75" />
        
        {/* 4. Secondary Glint Tip */}
        <rect x="-0.75" y="12" width="1.5" height="10" fill="white" fillOpacity="0.08" rx="0.75" />
      </g>
    </g>
  </svg>
);

export const ILLUSTRATIONS: Record<Exclude<EmptyStateVariant, 'custom'>, React.FC> = {
  'no-results': IllustrationNoResults,
  'empty-library': IllustrationNoResults, // Re-use NoResults for EmptyLibrary or keep it separate
  'no-favorites': IllustrationNoFavorites,
  'no-recent': IllustrationNoRecent,
  'offline': IllustrationOffline,
};

// Map properly (Fixing the ILLUSTRATIONS Map in case of reference error)
ILLUSTRATIONS['empty-library'] = IllustrationEmptyLibrary;
