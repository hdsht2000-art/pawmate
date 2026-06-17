import React, { useState } from 'react';
import { LayoutDashboard, PawPrint, ClipboardList, ArrowLeft } from 'lucide-react';
import DashboardView from './DashboardView';
import PetsView from './PetsView';
import ApplicationsView from './ApplicationsView';

type View = 'dashboard' | 'pets' | 'applications';

const navItems: { key: View; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: '数据概览', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'pets', label: '宠物管理', icon: <PawPrint className="w-5 h-5" /> },
  { key: 'applications', label: '申请管理', icon: <ClipboardList className="w-5 h-5" /> },
];

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 h-screen bg-white border-r border-gray-200 transition-all duration-200 flex flex-col ${
          sidebarOpen ? 'w-60' : 'w-16'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-gray-100 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <PawPrint className="w-5 h-5 text-white fill-current" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="text-base font-bold text-gray-900 whitespace-nowrap">PawMate</h1>
              <p className="text-[10px] text-gray-400 -mt-0.5">管理后台</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                view === item.key
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Toggle */}
        <div className="p-2 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 text-xs cursor-pointer transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
            {sidebarOpen && <span>收起菜单</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden mr-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-gray-800">
            {navItems.find((n) => n.key === view)?.label}
          </h2>
          <a
            href="/"
            className="ml-auto text-xs text-gray-400 hover:text-emerald-600 transition-colors"
          >
            返回前台
          </a>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          {view === 'dashboard' && <DashboardView />}
          {view === 'pets' && <PetsView />}
          {view === 'applications' && <ApplicationsView />}
        </main>
      </div>
    </div>
  );
}
