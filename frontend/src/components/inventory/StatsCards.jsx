// src/components/inventory/StatsCards.jsx
import React from 'react';
import { Package, CheckCircle, AlertTriangle, TrendingDown } from 'lucide-react';

const StatsCards = ({ stats, products }) => {
  const cards = [
    {
      title: 'Total Products',
      value: stats.totalProducts || products.length,
      icon: Package,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'In Stock',
      value: stats.inStock || products.filter(p => p.status === 'In Stock').length,
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Low Stock',
      value: stats.lowStock || products.filter(p => p.status === 'Low Stock').length,
      icon: AlertTriangle,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Critical',
      value: stats.critical || products.filter(p => p.status === 'Critical').length,
      icon: TrendingDown,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className={`p-2 ${card.bgColor} rounded-lg`}>
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};



export default { StatsCards };