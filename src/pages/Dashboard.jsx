import React from 'react';
import { Users, Activity, AlertTriangle } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const revenueData = [
  { month: 'Jan', value: 32000 },
  { month: 'Feb', value: 34500 },
  { month: 'Mar', value: 38200 },
  { month: 'Apr', value: 36000 },
  { month: 'May', value: 41000 },
  { month: 'Jun', value: 44000 },
];

const healthData = [
  { name: 'Healthy', value: 165, color: '#10b981' },
  { name: 'Moderate', value: 72, color: '#f59e0b' },
  { name: 'At Risk', value: 17, color: '#ef4444' },
];

const highRiskCustomers = [
  { id: 1, name: 'TechFlow Inc.', risk: 'High', reason: 'Low login activity past 14 days' },
  { id: 2, name: 'CloudSync', risk: 'Critical', reason: 'Declined latest payment method' },
  { id: 3, name: 'DataGrid', risk: 'High', reason: 'Support tickets pending > 48h' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Customers</p>
              <h3 className="text-3xl font-bold text-slate-900">254</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Avg Health Score</p>
              <h3 className="text-3xl font-bold text-slate-900">86<span className="text-lg text-slate-400">/100</span></h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Churn Rate</p>
              <h3 className="text-3xl font-bold text-slate-900">3.2%</h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid: 2fr 1fr spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden flex flex-col">
          <h3 className="text-[16px] font-semibold text-slate-900 mb-4">Revenue Trend</h3>
          <div className="h-[260px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden flex flex-col">
          <h3 className="text-[16px] font-semibold text-slate-900 mb-4">Health Distribution</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {healthData.map(d => (
              <div key={d.name} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-semibold text-slate-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-full">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-[16px] font-semibold text-slate-900">High Risk Customers</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            Requires Attention
          </span>
        </div>
        <div className="divide-y divide-slate-100">
          {highRiskCustomers.map(customer => (
            <div key={customer.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-[14px] text-slate-900">{customer.name}</span>
                <span className="text-[13px] text-slate-500">Reason: {customer.reason}</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  customer.risk === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {customer.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
