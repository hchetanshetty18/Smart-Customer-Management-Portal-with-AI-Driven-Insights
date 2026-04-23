import React from 'react';

export default function WelcomeIllustration({ className = '' }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 240 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background blobs / decorations */}
      <circle cx="200" cy="40" r="60" fill="#4f46e5" fillOpacity="0.05" />
      <circle cx="40" cy="120" r="80" fill="#06b6d4" fillOpacity="0.05" />
      
      {/* Main abstract window / dashboard representation */}
      <rect x="40" y="30" width="160" height="100" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="2" />
      
      {/* Header of the abstract window */}
      <path d="M40 42C40 35.3726 45.3726 30 52 30H188C194.627 30 200 35.3726 200 42V50H40V42Z" fill="#f8fafc" borderBottom="1px solid #e2e8f0" />
      <circle cx="56" cy="40" r="3" fill="#cbd5e1" />
      <circle cx="68" cy="40" r="3" fill="#cbd5e1" />
      <circle cx="80" cy="40" r="3" fill="#cbd5e1" />

      {/* Content lines / blocks inside window */}
      <rect x="56" y="65" width="40" height="8" rx="4" fill="#e2e8f0" />
      <rect x="56" y="85" width="80" height="6" rx="3" fill="#f1f5f9" />
      <rect x="56" y="100" width="60" height="6" rx="3" fill="#f1f5f9" />

      {/* Abstract chart inside window */}
      <path d="M120 110L140 85L155 95L180 60" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Data points */}
      <circle cx="140" cy="85" r="4" fill="white" stroke="#4f46e5" strokeWidth="2" />
      <circle cx="155" cy="95" r="4" fill="white" stroke="#4f46e5" strokeWidth="2" />
      <circle cx="180" cy="60" r="4" fill="white" stroke="#4f46e5" strokeWidth="2" />

      {/* Floating element / accent */}
      <rect x="150" y="15" width="50" height="40" rx="8" fill="white" stroke="#e2e8f0" strokeWidth="2" shadow="sm" />
      <path d="M165 35L175 45L185 25" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
