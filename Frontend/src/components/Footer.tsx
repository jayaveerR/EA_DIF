import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-sm">
            <h2 
              className="text-3xl font-normal text-[#000000] mb-6"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              EA-DIF<sup className="text-xs">®</sup>
            </h2>
            <p className="text-[#6F6F6F] leading-relaxed">
              Explainable Adaptive Deep Isolation Forest. 
              Designing digital havens for student success and academic excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <div>
              <h3 className="text-sm font-bold text-[#000000] uppercase tracking-wider mb-6">Resources</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-[#6F6F6F] hover:text-[#000000] transition-colors">Research Paper</a></li>
                <li><a href="#" className="text-[#6F6F6F] hover:text-[#000000] transition-colors">Documentation</a></li>
                <li><a href="#" className="text-[#6F6F6F] hover:text-[#000000] transition-colors">Methodology</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#000000] uppercase tracking-wider mb-6">Connect</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-[#6F6F6F] hover:text-[#000000] transition-colors">Twitter</a></li>
                <li><a href="#" className="text-[#6F6F6F] hover:text-[#000000] transition-colors">Instagram</a></li>
                <li><a href="#" className="text-[#6F6F6F] hover:text-[#000000] transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[#6F6F6F] text-sm">
            &copy; {new Date().getFullYear()} EA-DIF Project. All rights reserved.
          </p>
          <div className="flex space-x-8 text-sm">
            <a href="#" className="text-[#6F6F6F] hover:text-[#000000]">Privacy</a>
            <a href="#" className="text-[#6F6F6F] hover:text-[#000000]">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
