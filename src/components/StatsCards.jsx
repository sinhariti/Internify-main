import React from 'react';
import { Target, Clock, AlertCircle, TrendingUp } from 'lucide-react';

const StatsCards = ({ applications }) => {
  const stats = [
    {
      label: 'Total Applications',
      value: applications.length || 0,
      icon: Target,
      color: 'blue'
    },
    {
      label: 'In Progress',
      value: applications.filter(a => a.status === 'Applied' || a.status === 'applied').length || 0,
      icon: Clock,
      color: 'yellow'
    },
    {
      label: 'Interviews',
      value: applications.filter(a => a.status === 'Interview' || a.status === 'interview').length || 0,
      icon: AlertCircle,
      color: 'purple'
    },
    {
      label: 'Success Rate',
      value: applications.length
        ? `${Math.round((applications.filter(a => a.status === 'Accepted' || a.status === 'accepted').length / applications.length) * 100)}%`
        : '0%',
      icon: TrendingUp,
      color: 'green'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 transform hover:scale-105 transition-all duration-300 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;