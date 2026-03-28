import React from 'react';

export type EmptyStateVariant = 'no-results' | 'empty-library' | 'no-favorites' | 'no-recent' | 'offline' | 'custom';

/**
 * Aesthetic Concept: "Spatial Archive Scene" (v24 - Absolute Clarity Revision)
 * - Offline: Single-layer Standard 3-Arc Wi-Fi + Single Bold Red Strike.
 * - Background: Clean Hub slots without ambiguous curved lines.
 * - Goal: Remove all ghosting and faint artifacts.
 */

const SpatialArchive = ({ color = "white", opacity = 0.04 }) => (
  <g transform="translate(125, 105)">
    <rect x="-35" y="-40" width="70" height="50" rx="6" fill={color} fillOpacity={opacity * 0.5} stroke={color} strokeOpacity={opacity} strokeWidth="1" transform="rotate(-5)" />
    <rect x="-35" y="-40" width="70" height="50" rx="6" fill={color} fillOpacity={opacity} stroke={color} strokeOpacity={opacity * 2} strokeWidth="1" transform="rotate(2)" />
    <path d="M-40 -30H-15L-8 -24H40V20H-40V-30Z" fill="#0f0f18" stroke={color} strokeOpacity={opacity * 3} strokeWidth="1.25" />
    <rect x="-40" y="-8" width="80" height="28" rx="2" fill="#0f0f18" stroke={color} strokeOpacity={opacity * 2} strokeWidth="1" />
  </g>
);

/* Document Stack Sub-theme */
const DocumentStack = ({ color = "#f59e0b", opacity = 0.05 }) => (
  <g transform="translate(125, 105)">
    <rect x="-30" y="-35" width="60" height="75" rx="4" fill={color} fillOpacity={opacity * 0.4} stroke={color} strokeOpacity={opacity} strokeWidth="1" transform="rotate(-15)" />
    <rect x="-30" y="-35" width="60" height="75" rx="4" fill={color} fillOpacity={opacity * 0.6} stroke={color} strokeOpacity={opacity * 2} strokeWidth="1" transform="rotate(8)" />
    <rect x="-30" y="-35" width="60" height="75" rx="4" fill="#0f0f18" stroke={color} strokeOpacity={opacity * 4} strokeWidth="1.25" />
  </g>
);

/* 1. No Results */
export const IllustrationNoResults = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <SpatialArchive color="#6366f1" />
    <g transform="translate(75, 65)">
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
    <SpatialArchive color="#6366f1" />
    <g transform="translate(75, 75)">
      <circle r="24" fill="#0f0f18" fillOpacity="0.9" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="1.25" strokeDasharray="4 2" />
      <path d="M0 -10V10M-10 0H10" stroke="#6366f1" strokeOpacity="1" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  </svg>
);

/* 3. No Favorites */
export const IllustrationNoFavorites = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <DocumentStack color="#f59e0b" />
    <g transform="translate(95, 75)">
      <path d="M0 -22L6 -8H22L10 4L14 20L0 12L-14 20L-10 4L-22 -8H-6L0 -22Z" fill="#141424" transform="translate(2, 3)" stroke="#f59e0b" strokeOpacity="0.08" strokeWidth="1" strokeLinejoin="round" />
      <path d="M0 -22L6 -8H22L10 4L14 20L0 12L-14 20L-10 4L-22 -8H-6L0 -22Z" fill="#0f0f18" stroke="#f59e0b" strokeOpacity="1" strokeWidth="1.5" strokeLinejoin="round" />
      <circle r="2.5" fill="#f59e0b" />
    </g>
  </svg>
);

/* 4. No Recent */
export const IllustrationNoRecent = () => (
  <svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <SpatialArchive color="#818cf8" />
    <g transform="translate(75, 75)">
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
    {/* Clean Hub Background SLOT Focus (No confusing curves) */}
    <g transform="translate(125, 105)">
      <rect x="-45" y="-30" width="90" height="40" rx="4" fill="#0f0f18" stroke="#ef4444" strokeOpacity="0.12" strokeWidth="1.5" />
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={-36 + i * 18} y="-15" width="10" height="10" rx="1.5" stroke="#ef4444" strokeOpacity="0.1" strokeWidth="1.25" />
      ))}
      {/* Rectilinear Cable Accent */}
      <path d="M-30 -10V-28H-55" stroke="#ef4444" strokeOpacity="0.08" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </g>

    {/* Hyper-refined Protagonist - Zero Shadow Arcs */}
    <g transform="translate(75, 78)">
      {/* Precision Standard 3-Arcs (Single Layer) */}
      <path d="M-32 -6C-32 -23.6 -17.6 -38 0 -38C17.6 -38 32 -23.6 32 -6" stroke="#ef4444" strokeOpacity="0.2" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M-22 4C-22 -8.1 -12.1 -18 0 -18C12.1 -18 22 -8.1 22 4" stroke="#ef4444" strokeOpacity="0.4" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M-12 14C-12 7.3 -6.6 2 0 2C6.6 2 12 7.3 12 14" stroke="#ef4444" strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle r="4" fill="#ef4444" transform="translate(0, 24)" />
      
      {/* Single Bold Absolute Strike */}
      <g transform="translate(0, 1)">
        {/* Background clearing stroke for the strike */}
        <line x1="-22" y1="-32" x2="22" y2="12" stroke="#0f0f18" strokeWidth="7" strokeLinecap="round" />
        {/* The Strike */}
        <line x1="-22" y1="-32" x2="22" y2="12" stroke="#ef4444" strokeOpacity="1" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </g>
  </svg>
);

export const ILLUSTRATIONS: Record<Exclude<EmptyStateVariant, 'custom'>, React.FC> = {
  'no-results': IllustrationNoResults,
  'empty-library': IllustrationNoResults, // Re-use NoResults for EmptyLibrary or keep it separate
  'empty-library-v1': IllustrationEmptyLibrary, // For reference
  'no-favorites': IllustrationNoFavorites,
  'no-recent': IllustrationNoRecent,
  'offline': IllustrationOffline,
};

// Map properly (Fixing the ILLUSTRATIONS Map in case of reference error)
ILLUSTRATIONS['empty-library'] = IllustrationEmptyLibrary;
