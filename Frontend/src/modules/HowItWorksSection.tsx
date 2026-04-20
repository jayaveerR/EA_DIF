import React from 'react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Data Collection',
      description: 'Aggregating activity, attendance, and performance data from multiple institutional sources.'
    },
    {
      number: '02',
      title: 'AI Detection',
      description: 'WOS-IForest and LSGRU models process data to identify behavioral anomalies in real-time.'
    },
    {
      number: '03',
      title: 'Explainable Alerts',
      description: 'Generating SHAP-based explanations to provide context for every flagged behavior.'
    }
  ];

  return (
    <section id="how-it-works" className="py-32 bg-[#F9F9F9] relative z-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 
            className="text-4xl md:text-5xl font-normal text-[#000000] mb-4"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            The <em className="not-italic text-[#6F6F6F]">EA-DIF</em> Pipeline
          </h2>
          <p className="text-[#6F6F6F] text-lg">From raw data to actionable behavioral insights.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.number} className="group">
              <div className="text-5xl font-normal text-gray-200 mb-6 group-hover:text-indigo-100 transition-colors" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-[#000000] mb-4">{step.title}</h3>
              <p className="text-[#6F6F6F] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
