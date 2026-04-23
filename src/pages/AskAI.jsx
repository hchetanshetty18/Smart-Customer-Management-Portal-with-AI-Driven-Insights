import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Lightbulb, AlertTriangle, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

function renderResponse(data) {
  if (!data) return 'Processing your request...';
  
  if (data.intent === 'reasons_analysis') {
    let text = data.answer || '';
    if (data.top_reasons && data.top_reasons.length > 0) {
      text += '\n\n📊 Top Factors:';
      data.top_reasons.forEach((r, i) => {
        text += `\n${i + 1}. ${r.factor}: ${r.count} customers (${r.percentage}%)`;
      });
    }
    return text;
  }
  
  if (data.intent === 'recommended_actions') {
    let text = data.answer || 'Recommended actions:\n';
    if (data.actions && data.actions.length > 0) {
      data.actions.forEach((a, i) => {
        const icon = a.priority === 'high' ? '🔴' : a.priority === 'medium' ? '🟡' : '🟢';
        text += `\n${icon} ${a.action}`;
      });
    }
    return text;
  }
  
  if (data.intent === 'summary_insights') {
    let text = `📊 ${data.summary}\n\n`;
    if (data.insights) {
      text += `• Health Score: ${data.insights.avg_health_score}/100\n`;
      text += `• Churn Rate: ${data.insights.churn_rate}%\n`;
      text += `• Avg NPS: ${data.insights.avg_nps}\n\n`;
      text += `Risk Distribution:\n`;
      text += `  🟢 Healthy: ${data.insights.risk_distribution?.healthy || 0}\n`;
      text += `  🟡 Moderate: ${data.insights.risk_distribution?.moderate || 0}\n`;
      text += `  🔴 High: ${data.insights.risk_distribution?.high || 0}`;
    }
    return text;
  }
  
  if (data.intent === 'fallback' || data.intent === 'error_fallback') {
    let text = data.summary || '';
    if (data.suggestions && data.suggestions.length > 0) {
      text += '\n\n💡 Try asking:';
      data.suggestions.slice(0, 3).forEach(s => {
        text += `\n• "${s}"`;
      });
    }
    if (data.default_data?.overview) {
      const ov = data.default_data.overview;
      text += `\n\n📈 Quick Stats: ${ov.total} customers, ${ov.high_risk} high-risk (${ov.churn_rate}% churn)`;
    }
    return text;
  }
  
  let text = data.summary || `Found ${data.count || 0} customers`;
  
  if (data.risk_breakdown) {
    const rb = data.risk_breakdown;
    text += `\n\nRisk: 🔴 ${rb.High || 0} | 🟡 ${rb.Moderate || 0} | 🟢 ${rb.Healthy || 0}`;
  }
  
  if (data.reasoning) {
    text += `\n\n💡 ${data.reasoning}`;
  }
  
  if (data.merged_from_context) {
    text += `\n\n(Using previously applied filters)`;
  }
  
  return text;
}

export default function AskAI() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm Kastomer AI. Ask me about your customers, churn risks, or revenue. Try the quick suggestions below or type your own query." }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch(`${API_URL}/ask-ai/suggestions`)
      .then(r => r.json())
      .then(data => { if (data.success) setSuggestions(data.data); })
      .catch(console.error);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSuggestionClick = (suggestedQuery) => {
    if (loading) return;
    setQuery(suggestedQuery);
    handleSend({ preventDefault: () => {} }, suggestedQuery);
  };

  const handleSend = async (e, overrideQuery = null) => {
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim() || loading) return;
    
    setMessages(prev => [...prev, { role: 'user', text: finalQuery }]);
    if (!overrideQuery) setQuery('');
    setLoading(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const res = await fetch(`${API_URL}/ask-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: finalQuery }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success && data.data) {
        const responseText = renderResponse(data.data);
        setMessages(prev => [...prev, { role: 'assistant', text: responseText, rawData: data.data }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: data.message || 'Sorry, I had trouble processing that request.' }]);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Request timed out. Please try again.' }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Kastomer AI Assistant</h2>
          <p className="text-xs text-slate-500">Query your CRM data using natural language</p>
        </div>
      </div>

      <div className="p-3 border-b border-slate-100 bg-indigo-50/50 flex gap-2 overflow-x-auto">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSuggestionClick(s.query)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-xs font-medium text-indigo-700 hover:bg-indigo-50 whitespace-nowrap transition-colors"
          >
            <Lightbulb className="w-3 h-3" />
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[#F9FAFB]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-sm' 
                : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-sm'
            }`}>
              {msg.text}
              {msg.rawData?.results && msg.rawData.results.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-xs font-medium text-slate-500 mb-2">
                    Showing {msg.rawData.results.length} of {msg.rawData.count} customers
                  </div>
                  <div className="space-y-2">
                    {msg.rawData.results.slice(0, 5).map((c, j) => (
                      <div key={j} className="flex items-center justify-between text-xs bg-slate-50 rounded px-2 py-1.5">
                        <span className="font-medium text-slate-700">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            c.churn_risk === 'High' ? 'bg-rose-100 text-rose-700' :
                            c.churn_risk === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {c.churn_risk}
                          </span>
                          <span className="text-slate-400">{c.usage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about customers, churn, or revenue..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button 
            type="submit"
            disabled={!query.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-lg transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}