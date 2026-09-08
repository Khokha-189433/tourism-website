// صورة احتياطية مدمجة (SVG) لا تتطلب أي اتصال بالإنترنت
const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200"><rect width="400" height="200" fill="#e2e8f0"/><path d="M170 70 L230 130 L170 190 L110 130 Z" fill="#94a3b8"/><text x="50%" y="175" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#64748b">لا توجد صورة</text></svg>`;
export const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(placeholderSvg)}`;

export const getImageUrl = (image) => {
  if (!image) return PLACEHOLDER_IMAGE;
  
  if (Array.isArray(image)) {
    if (image.length === 0) return PLACEHOLDER_IMAGE;
    image = image[0];
  }
  
  if (typeof image === 'object' && image !== null) {
    image = image.image_url || image.image || image.imageUrl || image.image_path || image.imagePath || image.url || image.path || image.filename || image.file_url || image.src;
  }
  
  if (typeof image !== 'string') return PLACEHOLDER_IMAGE;

  if (image.startsWith('http')) {
    if (image.startsWith('http://localhost:5000')) {
      return new URL(image).pathname;
    }
    return image;
  }
  
  if (image.startsWith('/')) {
    return image;
  }
  
  return `/uploads/${image}`;
};

export const getMainImage = (images) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    return PLACEHOLDER_IMAGE;
  }
  
  const primaryImage = images.find(img => typeof img === 'object' && (img.is_primary || img.isPrimary));
  if (primaryImage) {
    return getImageUrl(primaryImage);
  }
  
  return getImageUrl(images[0]);
};