
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.slate.900),theme(colors.background))]" />
      
      {/* Main Content */}
      <div className="w-full max-w-5xl space-y-12 text-center animate-fade-up">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gradient">
          Create your perfect profile page
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Express yourself with custom backgrounds, music, and more. Share your story in style.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="rounded-full px-8 glass-dark hover:bg-white/10">
            <Link to="/create">
              Get Started
            </Link>
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-24 animate-fade-up [--animation-delay:200ms]">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="relative group rounded-2xl glass-dark p-6 transition-colors hover:bg-white/10"
          >
            <feature.icon className="h-10 w-10 text-primary mb-4" />
            <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const features = [
  {
    title: "Custom Backgrounds",
    description: "Upload your own video backgrounds to create an immersive experience.",
    icon: Video
  },
  {
    title: "Audio Integration",
    description: "Add your favorite music to play in the background of your profile.",
    icon: Music
  },
  {
    title: "Premium Features",
    description: "Access all premium features by default, no subscription needed.",
    icon: Crown
  }
] as const;

import { Video, Music, Crown } from 'lucide-react';

export default Index;
