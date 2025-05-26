
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-96 bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=1200&h=400&fit=crop')`
        }}
      />
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4">Premium Catering</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Delicious food for your special celebrations. From intimate gatherings to grand events.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-3"
          >
            View Menu
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-3"
          >
            Get Quote
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
