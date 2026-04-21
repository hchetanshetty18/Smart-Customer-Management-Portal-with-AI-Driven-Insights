import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const customersData = [
  { id: 1, name: 'TechFlow Inc.', region: 'US East', plan: 'Enterprise', usage: '94%', health: 'Moderate', risk: 'High' },
  { id: 2, name: 'CloudSync', region: 'EMEA', plan: 'Pro', usage: '12%', health: 'At Risk', risk: 'Critical' },
  { id: 3, name: 'DataGrid', region: 'US West', plan: 'Enterprise', usage: '88%', health: 'Moderate', risk: 'High' },
  { id: 4, name: 'Nexus Systems', region: 'APAC', plan: 'Starter', usage: '45%', health: 'Healthy', risk: 'Low' },
  { id: 5, name: 'OmniCorp', region: 'US East', plan: 'Pro', usage: '78%', health: 'Healthy', risk: 'Low' },
  { id: 6, name: 'DevWorks', region: 'LATAM', plan: 'Enterprise', usage: '91%', health: 'Healthy', risk: 'Low' },
  { id: 7, name: 'Alpha Stream', region: 'EMEA', plan: 'Starter', usage: '22%', health: 'Moderate', risk: 'Medium' },
];

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredCustomers = customersData.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.region.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <td className="px-6 py-4 text-[14px] font-medium text-slate-700">{customer.usage}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      customer.health === 'Healthy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      customer.health === 'Moderate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {customer.health}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      customer.risk === 'Low' ? 'bg-slate-100 text-slate-600' :
                      customer.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {customer.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No customers found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
