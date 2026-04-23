import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, Cpu, Signal, SignalLow } from 'lucide-react';


const API_URL = 'http://localhost:3000/api';

export default function Devices() {
  const [searchTerm, setSearchTerm] = useState('');
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDevices() {
      try {
        const res = await fetch(`${API_URL}/devices`);
        const data = await res.json();
        if (data.success) setDevices(data.data);
      } catch (err) {
        console.error('Failed to fetch devices:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDevices();
  }, []);

  const filteredDevices = devices.filter((d) =>
    d.device_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[26px] font-bold text-slate-900 tracking-tight">Device Inventory</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search devices or serials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center p-12">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : filteredDevices.map((device) => (
          <div 
            key={device.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/customers/${device.customer_id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600">
                <Cpu className="w-5 h-5" />
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                device.status === 'Online' ? 'bg-emerald-50 text-emerald-700' :
                device.status === 'Offline' ? 'bg-rose-50 text-rose-700' :
                'bg-amber-50 text-amber-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  device.status === 'Online' ? 'bg-emerald-500' :
                  device.status === 'Offline' ? 'bg-rose-500' :
                  'bg-amber-500'
                }`} />
                {device.status}
              </span>
            </div>
            
            <div className="space-y-1 mb-4">
              <h3 className="font-bold text-slate-900">{device.device_name}</h3>
              <p className="text-xs font-mono text-slate-500">{device.serial_number}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs">
                <p className="text-slate-400 mb-0.5">Assigned to</p>
                <p className="font-medium text-slate-700">{device.customer_name}</p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p className="mb-0.5">Last Activity</p>
                <p>{new Date(device.last_heartbeat).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!loading && filteredDevices.length === 0) && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <p className="text-slate-500 text-sm">No devices found matching your search.</p>
        </div>
      )}
    </div>
  );
}
