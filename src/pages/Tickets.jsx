import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Filter, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

export default function Tickets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch(`${API_URL}/tickets`);
        const data = await res.json();
        if (data.success) setTickets(data.data);
      } catch (err) {
        console.error('Failed to fetch tickets:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((t) =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'In Progress': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Closed': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Support Tickets</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets or customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
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
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Ticket ID</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Customer</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Subject</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Severity</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/customers/${ticket.customer_id}`)}
                  >
                    <td className="px-6 py-4 text-[13px] font-mono text-slate-500">#{ticket.id}</td>
                    <td className="px-6 py-4 text-[14px] font-medium text-slate-900">{ticket.customer_name}</td>
                    <td className="px-6 py-4 text-[14px] text-slate-700 max-w-xs truncate">{ticket.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        ticket.severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        ticket.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {ticket.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-[14px] text-slate-700">
                        {getStatusIcon(ticket.status)}
                        {ticket.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[13px] text-slate-500">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {(!loading && filteredTickets.length === 0) && (
            <div className="p-12 text-center">
              <p className="text-slate-500 text-sm">No tickets found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
