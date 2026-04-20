import React from 'react';
import { Button } from '../components/Button';
import { ArrowRight } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-indigo-600">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Transform student data into actionable insights
        </h2>
        <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
          Join institutions using EA-DIF to proactively support student success and improve institutional efficiency.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto border-indigo-400 text-white hover:bg-indigo-500">
            Contact Research Team
          </Button>
        </div>
      </div>
    </section>
  );
};
