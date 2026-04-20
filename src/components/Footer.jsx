import { motion } from 'framer-motion'
import { Cpu, Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#hero" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Kastomer</span>
            </a>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Smart Customer Management Portal with AI-Driven Insights.
              Built for HACK2HIRE 1.0 — Project 09.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Navigate</h4>
            <div className="space-y-2.5">
              {[
                { label: 'Overview', href: '#hero' },
                { label: 'Scope & Requirements', href: '#scope' },
                { label: 'Dashboard Preview', href: '#dashboard' },
                { label: 'Deliverables', href: '#deliverables' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Modules */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Modules</h4>
            <div className="space-y-2.5">
              {[
                'Synthetic Data',
                'Web Portal',
                'NL Query Interface',
                'AI Health Scoring',
                'Churn Prediction',
                'Email Agent',
              ].map((mod) => (
                <span
                  key={mod}
                  className="block text-sm text-slate-500"
                >
                  {mod}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} Kastomer. HACK2HIRE 1.0 Project
            Submission.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            Built with <Heart className="w-3 h-3 text-rose-400 mx-0.5" /> for
            innovation
          </div>
        </div>
      </div>
    </footer>
  )
}
