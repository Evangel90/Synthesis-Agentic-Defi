import React from 'react';

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active = false }) => (
  <a 
    href="#" 
    className={`flex items-center ${active ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface/70 hover:bg-white/50'} rounded-l-xl ml-4 px-6 py-3 transition-all duration-200`}
  >
    <span className="material-symbols-outlined mr-3">{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </a>
);

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col h-full py-8 bg-surface-container-low w-64 fixed left-0 top-0 z-20">
      <div className="px-8 mb-10">
        <h1 className="font-headline font-bold text-on-surface text-xl">Vault.AI</h1>
        <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 font-bold mt-1">Institutional Grade</p>
      </div>
      <nav className="flex-1 space-y-1">
        <NavItem icon="grid_view" label="Overview" active />
        <NavItem icon="smart_toy" label="Agent Permissions" />
        <NavItem icon="shield" label="Wallet Security" />
        <NavItem icon="history" label="Transaction History" />
        <NavItem icon="fingerprint" label="Identity" />
      </nav>
      <div className="px-6 mt-auto pt-6 border-t border-outline-variant/10">
        <button className="w-full flex items-center text-on-surface/70 py-3 hover:text-primary transition-colors">
          <span className="material-symbols-outlined mr-3">help</span>
          <span className="text-sm font-medium">Support</span>
        </button>
        <button className="w-full flex items-center text-on-surface/70 py-3 hover:text-error transition-colors">
          <span className="material-symbols-outlined mr-3">logout</span>
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};