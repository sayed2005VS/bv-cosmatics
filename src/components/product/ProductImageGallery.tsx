import { useState } from 'react';
import { ShoppingBag, ZoomIn } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ProductImage {
  node: {
    url: string;
    altText: string | null;
  };
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productTitle: string;
}

const ProductImageGallery = ({ images, productTitle }: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const currentImage = images[selectedImage]?.node;

  return (
    <div className="space-y-4">
      {/* Main Image with Zoom */}
      <div 
        className="aspect-square bg-secondary/50 rounded-2xl overflow-hidden relative group cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onClick={() => currentImage && setIsZoomed(false)}
      >
        {currentImage ? (
          <>
            <img
              src={currentImage.url}
              alt={currentImage.altText || productTitle}
              className="w-full h-full object-cover transition-transform duration-300"
            />
            {/* Zoom overlay */}
            {isZoomed && (
              <div 
                className="absolute inset-0 hidden md:block"
                style={{
                  backgroundImage: `url(${currentImage.url})`,
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  backgroundSize: '200%',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}
            {/* Zoom indicator */}
            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-5 h-5 text-foreground" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all duration-300 hover:scale-105 ${
                selectedImage === index 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-transparent hover:border-primary/50'
              }`}
            >
              <img
                src={img.node.url}
                alt={img.node.altText || `${productTitle} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Dialog */}
      <Dialog open={false}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {currentImage && (
            <img
              src={currentImage.url}
              alt={currentImage.altText || productTitle}
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageGallery;
