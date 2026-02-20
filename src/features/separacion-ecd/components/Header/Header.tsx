'use client';

import React from 'react';

interface HeaderProps {
  title: string;
  breadcrumb: { label: string; path?: string }[];
}

export function Header({ title, breadcrumb }: HeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      <nav className="flex items-center gap-2 text-sm text-slate-600">
        {breadcrumb.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {idx > 0 && <span className="text-slate-400">/</span>}
            {item.path ? (
              <a href={item.path} className="hover:text-slate-900 transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-[#e74038] font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
