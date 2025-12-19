import promoProduct from '@/assets/promo-product.png';

const PromoBanner = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={promoProduct} 
          alt="Radiance Collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/50 to-transparent" />
      </div>

      <div className="container-custom relative z-10">
        <div className="py-20 md:py-32 max-w-xl">
          <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
            Limited Edition
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-background mb-4 leading-tight">
            Discover Our New
            <br />
            <span className="text-gradient-gold">Radiance Collection</span>
          </h2>
          <p className="font-body text-background/70 text-lg mb-8 max-w-md">
            Advanced formulas for luminous, healthy-looking skin.
          </p>
          <button className="btn-gold">
            Explore Collection
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
