import heroProducts from '@/assets/hero-products.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen hero-gradient flex items-center justify-center overflow-hidden pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Subtle label */}
          <span className="label-subtle mb-6 animate-fade-up opacity-0" style={{ animationDelay: '100ms' }}>
            New Launch
          </span>

          {/* Product Display - Hero Image */}
          <div className="relative w-full max-w-2xl mb-12 animate-fade-up opacity-0" style={{ animationDelay: '200ms' }}>
            <img 
              src={heroProducts} 
              alt="Lumière Premium Skincare Collection" 
              className="w-full h-auto rounded-3xl"
            />
            {/* Subtle shadow/glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-3xl pointer-events-none" />
          </div>

          {/* CTA Button */}
          <button 
            className="btn-ghost text-base md:text-lg animate-fade-up opacity-0"
            style={{ animationDelay: '400ms' }}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
