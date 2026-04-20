import React from 'react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 
              className="text-4xl md:text-5xl font-normal text-[#000000] mb-8"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Explainable AI for <br />
              <em className="not-italic text-[#6F6F6F]">student success.</em>
            </h2>
            <p className="text-[#6F6F6F] text-lg leading-relaxed max-w-lg">
              EA-DIF (Explainable Adaptive Deep Isolation Forest) combines deep learning 
              with unsupervised anomaly detection to identify student behavioral shifts. 
              We provide transparent reasoning for every detection, helping educators 
              intervene with confidence.
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/aethera-about/1000/1000" 
              alt="Aethera Studio" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
