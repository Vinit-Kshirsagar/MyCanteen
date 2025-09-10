// components/dashboard/StatsCards.js
'use client'

import { Users, TrendingUp, Calendar } from 'lucide-react';

const StatsCards = ({ totalUsers, activeUsers = 0, newUsersToday = 0 }) => {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "bg-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      title: "Active Today",
      value: activeUsers,
      icon: TrendingUp,
      color: "bg-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      title: "New This Week",
      value: newUsersToday,
      icon: Calendar,
      color: "bg-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;