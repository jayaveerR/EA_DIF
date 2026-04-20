import React from 'react';
import { Card } from '../components/Card';
import { 
  BarChart3, 
  ShieldCheck, 
  RefreshCcw, 
  LayoutDashboard, 
  Layers, 
  Lock 
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Real-time Detection',
      description: 'Continuous monitoring of student data streams for immediate anomaly identification.',
      icon: <BarChart3 size={24} />,
    },
    {
      title: 'SHAP Explanations',
      description: 'Detailed feature importance analysis to explain the logic behind every detection.',
      icon: <ShieldCheck size={24} />,
    },
    {
      title: 'Drift Detection',
      description: 'ADWIN-based adaptation to handle evolving student behaviors and seasonal changes.',
      icon: <RefreshCcw size={24} />,
    },
    {
      title: 'Dashboard Analytics',
      description: 'Comprehensive visual interface for tracking trends and individual student profiles.',
      icon: <LayoutDashboard size={24} />,
    },
    {
      title: 'Scalable Architecture',
      description: 'Designed to handle large-scale institutional data with high throughput and low latency.',
      icon: <Layers size={24} />,
    },
    {
      title: 'Secure Data Handling',
      description: 'Enterprise-grade encryption and privacy controls to protect sensitive student information.',
      icon: <Lock size={24} />,
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Core Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful tools designed to provide a comprehensive understanding of student behavior.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
