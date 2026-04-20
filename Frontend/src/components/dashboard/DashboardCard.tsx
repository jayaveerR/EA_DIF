import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: string;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendColor = "text-green-600",
  className 
}) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={cn(
        "bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/5 transition-all group", 
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 text-gray-400 transition-colors">
          {icon}
        </div>
        {trend && (
          <span className={cn("text-[10px] font-black uppercase tracking-widest", trendColor)}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-4xl font-black text-gray-900 font-mono tracking-tighter tabular-nums">
          {value}
        </h3>
      </div>
    </motion.div>
  );
};
