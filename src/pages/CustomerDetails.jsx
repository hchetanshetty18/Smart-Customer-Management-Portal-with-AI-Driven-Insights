import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, AlertCircle, CheckCircle2, Ticket } from 'lucide-react';

export default function CustomerDetails() {
  const { id } = useParams();
  
  // Simulated data load based on ID
  const customer = {
    id,
    name: id === '1' ? 'TechFlow Inc.' : id === '2' ? 'CloudSync' : 'OminiCorp',
    region: 'US East',
    plan: 'Enterprise',
    usage: '94%',
    health: 'Moderate',
    risk: 'High',
    since: 'Oct 2023',
    mrr: '$4,200',
    tickets: [
      { id: 'TKT-892', title: 'API rate limits exceeded unexpectedly', status: 'Open', urgency: 'High' },
      { id: 'TKT-890', title: 'Dashboard latency in APAC region', status: 'Resolved', urgency: 'Medium' }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/customers" className="p-2 hover:bg-slate-200 bg-slate-100 rounded-full text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">{customer.name}</h1>
          <p className="text-sm text-slate-500">Customer ID: {customer.id} • Since {customer.since}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-[16px] font-semibold text-slate-900">Basic Information</h3>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-1">Region</p>
                <p className="font-medium text-slate-900">{customer.region}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Plan</p>
                <p className="font-medium text-slate-900">{customer.plan}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">MRR</p>
                <p className="font-medium text-slate-900">{customer.mrr}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Usage Quota</p>
                <p className="font-medium text-slate-900">{customer.usage}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-[16px] font-semibold text-slate-900">Recent Support Tickets</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {customer.tickets.map(t => (
                <div key={t.id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <Ticket className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{t.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{t.id} • {t.urgency} Urgency</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    t.status === 'Open' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 overflow-hidden">
            <h3 className="text-[16px] font-semibold text-slate-900 mb-4">Status & Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-[14px] text-amber-900">Health</span>
                </div>
                <span className="font-bold text-amber-700">{customer.health}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-rose-50 border border-rose-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span className="font-medium text-[14px] text-rose-900">Churn Risk</span>
                </div>
                <span className="font-bold text-rose-700">{customer.risk}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm border border-indigo-100 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-24 h-24 text-indigo-600" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">AI Insight</h3>
              </div>
              <p className="text-sm text-indigo-900/80 leading-relaxed mb-4">
                This customer is exhibiting usage patterns consistent with a high churn risk. Specifically, <strong>unresolved support tickets</strong> combined with a <strong>15% drop in weekly logins</strong> triggered this alert.
              </p>
              <button className="text-sm font-semibold text-indigo-700 hover:text-indigo-800 transition-colors flex items-center gap-1">
                View Remediation Steps &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
