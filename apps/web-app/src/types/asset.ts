export interface Asset {
  id: string;
  fileName: string;
  fileSize: string;
  mimeType: string;
  thumbnailGradient: string;
  palette: string[];
  tags: string[];
  createdAt: string;
  isFavorite: boolean;
}
