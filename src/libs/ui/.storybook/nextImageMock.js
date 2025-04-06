import React from 'react';
import { placeholderSvg } from './placeholderImage';

// Mock Next.js Image component for Storybook
const NextImage = ({
  src,
  alt,
  fill,
  width,
  height,
  className,
  style,
  priority,
  quality,
  ...props
}) => {
  // Use the placeholder SVG for image paths that would normally be resolved by Next.js
  const imageSrc = src?.startsWith('/') ? placeholderSvg : src;

  const imgStyle = {
    objectFit: style?.objectFit || 'cover',
    ...(fill
      ? { position: 'absolute', height: '100%', width: '100%', top: 0, left: 0 }
      : {}),
    ...style,
  };

  const imgProps = {
    src: imageSrc,
    alt: alt || '',
    width: width || undefined,
    height: height || undefined,
    className,
    style: imgStyle,
    loading: priority ? 'eager' : 'lazy',
    ...props,
  };

  return React.createElement('img', imgProps);
};

// Set displayName for the component
NextImage.displayName = 'Image';

// Add default property for handling layout & placeholder props
Object.defineProperties(NextImage, {
  default: {
    configurable: true,
    value: NextImage,
  },
});

export default NextImage;
export { NextImage };
