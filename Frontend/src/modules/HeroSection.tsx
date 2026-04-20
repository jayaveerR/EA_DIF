import React, { useEffect, useRef, useState } from 'react';

export const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let requestId: number;

    const update = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (duration > 0) {
        // Fade in over 0.5s at start
        if (currentTime < 0.5) {
          setOpacity(currentTime / 0.5);
        } 
        // Fade out over 0.5s before end
        else if (currentTime > duration - 0.5) {
          setOpacity((duration - currentTime) / 0.5);
        } 
        else {
          setOpacity(1);
        }
      }

      requestId = requestAnimationFrame(update);
    };

    requestId = requestAnimationFrame(update);

    const handleEnded = async () => {
      setOpacity(0);
      await new Promise(resolve => setTimeout(resolve, 100));
      video.currentTime = 0;
      video.play();
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      cancelAnimationFrame(requestId);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden w-full">
      {/* Video Background Layer */}
      <div 
        className="absolute w-full h-full z-0 pointer-events-none top-[150px] sm:top-[200px] md:top-[300px] inset-x-0 bottom-0"
        style={{ 
          opacity: opacity,
          transition: 'opacity 0.1s linear'
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white pointer-events-none" />
      </div>

      {/* Content Layer */}
      <div 
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40 flex-grow"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        <h1 
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-[#000000] animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Beyond <em className="not-italic text-[#6F6F6F]">anomalies,</em> we build <br />
          <em className="not-italic text-[#6F6F6F]">the future of learning.</em>
        </h1>

        <p className="text-[#6F6F6F] text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay">
          AI-Powered Student Behavior Monitoring System. Detect irregularities, 
          understand behavioral patterns, and improve academic outcomes using explainable AI.
        </p>

        <button className="bg-[#000000] text-white rounded-full px-14 py-5 text-base mt-12 hover:scale-[1.03] transition-transform cursor-pointer animate-fade-rise-delay-2">
          Get Started
        </button>
      </div>
    </section>
  );
};
