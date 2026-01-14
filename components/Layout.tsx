
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  role: 'student' | 'instructor' | null;
  onReset: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, onReset }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-user-md text-xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-lg leading-tight">NurseSim AI</h1>
            <p className="text-xs text-slate-500 font-medium">History Taking Simulator</p>
          </div>
        </div>
        
        {role && (
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${role === 'student' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {role} portal
            </span>
            <button 
              onClick={onReset}
              className="text-slate-500 hover:text-slate-800 transition-colors"
              title="Switch Role"
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        {children}
      </main>

      <footer className="py-6 text-center text-slate-400 text-sm border-t bg-white">
        © 2024 NurseSim AI Education Platform
      </footer>
    </div>
  );
};
