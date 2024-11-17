import { useState, useEffect } from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';

interface Balance {
  amount: number;
  lastUpdated: string;
  trend: number;
}

export default function BalanceCard() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/balances');
      const data = await response.json();
      setBalance(data);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !balance) {
    return <div className="animate-pulse bg-white p-6 rounded-lg shadow h-32"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Current Balance</h3>
        <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
              .format(balance.amount)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {new Date(balance.lastUpdated).toLocaleString()}
          </p>
        </div>
        <div className={`flex items-center ${balance.trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          <span className="text-lg font-semibold">
            {balance.trend >= 0 ? '+' : ''}{balance.trend}%
          </span>
        </div>
      </div>
    </div>
  );
}