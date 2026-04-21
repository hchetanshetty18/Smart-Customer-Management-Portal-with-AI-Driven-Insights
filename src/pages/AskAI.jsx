import React, { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function AskAI() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm Kastomer AI. You can ask me anything about your customer data, churn risks, or overall portfolio health." }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { role: 'user', text: query }];
    setMessages(newMessages);
    setQuery('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { role: 'assistant', text: "Analyzing your request... Based on the CRM data, I've identified that we have 3 High Risk customers in the Enterprise tier this month." }
      ]);
    }, 1000);
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

      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#F9FAFB]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-sm' 
                : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-slate-600" />
              </div>
            )}
          </div>
        ))}
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
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
