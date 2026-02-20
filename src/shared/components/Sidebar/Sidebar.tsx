'use client';

import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children?: SidebarItem[];
  isActive?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  onItemClick?: (id: string) => void;
}

export function Sidebar({ items, onItemClick }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    // Auto-expand parents that have an active child
    const expanded = new Set<string>();
    const findActiveParents = (items: SidebarItem[]) => {
      items.forEach((item) => {
        if (item.children?.some((child) => child.isActive)) {
          expanded.add(item.id);
        }
        if (item.children) findActiveParents(item.children);
      });
    };
    findActiveParents(items);
    return expanded;
  });

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (id: string, hasChildren?: boolean) => {
    if (hasChildren) {
      toggleExpand(id);
    }
    onItemClick?.(id);
  };

  const renderItems = (items: SidebarItem[], level: number = 0) => {
    return items.map((item) => {
      const isExpanded = expandedItems.has(item.id);
      const hasChildren = item.children && item.children.length > 0;
      const isActive = item.isActive;

      return (
        <div key={item.id}>
          <button
            onClick={() => handleItemClick(item.id, hasChildren)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors relative ${
              level === 0
                ? 'border-l-4 border-transparent hover:bg-slate-50'
                : 'ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            } ${isActive && level === 0 ? 'border-l-4 border-[#C1232B] bg-red-50 text-[#C1232B]' : ''} ${
              isActive && level > 0 ? 'text-[#e74038] font-semibold bg-red-50 border-l-2 border-[#e74038]' : ''
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {hasChildren && (
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            )}
          </button>

          {hasChildren && isExpanded && (
            <div className="bg-slate-50/50">
              {renderItems(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col w-56 bg-white border-r border-slate-200 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <h2 className="font-bold text-lg text-slate-900">PowerSphere</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {renderItems(items)}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
          <div className="flex items-start gap-2">
            <span className="text-lg">⚡</span>
            <span>La medición, el control y el monitoreo remoto es el futuro del aprovechamiento y la mejor continua gestión energética.</span>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-40 bg-[#C1232B] text-white p-3 rounded-full shadow-lg hover:bg-[#A11D26] transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
