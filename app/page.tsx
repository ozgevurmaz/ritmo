
import Navbar from '@/components/landing/navbar';
import Hero from '@/components/landing/hero';
import Features from '@/components/landing/features';
import Footer from '@/components/landing/footer';

const RitmoLanding = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">

      <Navbar />

      <Hero />

      <Features />

      <Footer />

    </div>
  );
};

export default RitmoLanding;