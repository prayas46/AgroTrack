import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  credit?: string;
  aspectRatio?: string;
  fallbackColor?: string;
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
