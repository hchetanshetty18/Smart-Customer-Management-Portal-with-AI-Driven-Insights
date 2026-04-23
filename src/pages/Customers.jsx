import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch(`${API_URL}/customers`);
        const data = await res.json();
        if (data.success) setCustomers(data.data);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.region?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Customers</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Region</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Plan</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Usage</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Health</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    onClick={() => navigate(`/customers/${customer.id}`)}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 text-[14px] font-medium text-slate-900">{customer.name}</td>
                    <td className="px-6 py-4 text-[14px] text-slate-500">{customer.region}</td>
                    <td className="px-6 py-4 text-[14px] text-slate-500">{customer.plan}</td>
                    <td className="px-6 py-4 text-[14px] font-medium text-slate-700">{customer.usage}%</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        customer.health_score >= 70 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        customer.health_score >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {customer.health_score >= 70 ? 'Healthy' : customer.health_score >= 40 ? 'Moderate' : 'At Risk'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        customer.churn_risk === 'Healthy' ? 'bg-emerald-100 text-emerald-700' :
                        customer.churn_risk === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {customer.churn_risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {(!loading && filteredCustomers.length === 0) && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No customers found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
