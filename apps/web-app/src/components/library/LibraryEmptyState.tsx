import React from 'react';
import { 
  Asset, 
  NVNoFavoritesState, 
  NVNoRecentState, 
  NVEmptyLibraryState, 
  NVNoResultsState 
} from '@nova/ui';

interface LibraryEmptyStateProps {
  assets: Asset[];
  filteredAssets: Asset[];
  filter: string;
  searchText: string;
}

export const LibraryEmptyState: React.FC<LibraryEmptyStateProps> = ({
  assets,
  filteredAssets,
  filter,
  searchText,
}) => {
  // case 1: No favorites
  if (filter === 'favorites' && filteredAssets.length === 0) {
    return <NVNoFavoritesState />;
  }

  // case 2: No recent assets
  if (filter === 'recent' && filteredAssets.length === 0) {
    return <NVNoRecentState />;
  }

  // case 3: Entire library is truly empty (filter is all)
  if (filter === 'all' && assets.length === 0) {
    return <NVEmptyLibraryState />;
  }

  // case 4: Search keyword results empty
  if (searchText !== '' && filteredAssets.length === 0) {
    return <NVNoResultsState query={searchText} />;
  }

  // case 5: Advanced filters empty or unknown
  if (filteredAssets.length === 0) {
    return <NVNoResultsState />;
  }

  return null;
};
