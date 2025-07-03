
import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';

const RitmoLanding = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">

      <Navbar />

      <Hero />

      <Features />

    </div>
  );
};

export default RitmoLanding;