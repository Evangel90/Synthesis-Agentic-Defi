import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity" 
          onClick={onClose}
        />
      )}

      <aside className={`
        flex flex-col h-full py-8 bg-surface-container-low w-64 
        fixed left-0 top-0 z-40 md:z-20 
        transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="px-8 mb-8 md:mb-10 flex justify-between items-center">
          <div>
            <h1 className="font-headline font-bold text-on-surface text-xl">Vault.AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60 font-bold mt-1">Institutional Grade</p>
          </div>
          <button className="md:hidden text-on-surface-variant hover:text-on-surface p-1" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          <Link to="/" className="flex items-center bg-surface-container-lowest text-primary rounded-l-xl ml-4 shadow-sm px-6 py-3 transition-all duration-200" onClick={onClose}>
            <span className="material-symbols-outlined mr-3">grid_view</span>
            <span className="font-medium text-sm">Overview</span>
          </Link>
          <Link to="/agent-permissions" className="flex items-center text-on-surface/70 px-6 py-3 hover:bg-surface-container-lowest/50 rounded-l-xl ml-4 transition-all duration-200" onClick={onClose}>
            <span className="material-symbols-outlined mr-3">smart_toy</span>
            <span className="font-medium text-sm">Agent Permissions</span>
          </Link>
          <a className="flex items-center text-on-surface/70 px-6 py-3 hover:bg-surface-container-lowest/50 rounded-l-xl ml-4 transition-all duration-200" href="#">
            <span className="material-symbols-outlined mr-3">shield</span>
            <span className="font-medium text-sm">Wallet Security</span>
          </a>
          <a className="flex items-center text-on-surface/70 px-6 py-3 hover:bg-surface-container-lowest/50 rounded-l-xl ml-4 transition-all duration-200" href="#">
            <span className="material-symbols-outlined mr-3">history</span>
            <span className="font-medium text-sm">Transaction History</span>
          </a>
          <a className="flex items-center text-on-surface/70 px-6 py-3 hover:bg-surface-container-lowest/50 rounded-l-xl ml-4 transition-all duration-200" href="#">
            <span className="material-symbols-outlined mr-3">fingerprint</span>
            <span className="font-medium text-sm">Identity</span>
          </a>
        </nav>

        <div className="px-6 mt-auto pt-6 border-t border-outline-variant/10">
          <a className="flex items-center text-on-surface/70 py-3 px-2 hover:text-primary transition-colors rounded-lg" href="#">
            <span className="material-symbols-outlined mr-3 text-lg">help</span>
            <span className="text-sm font-medium">Support</span>
          </a>
          <a className="flex items-center text-on-surface/70 py-3 px-2 hover:text-error transition-colors rounded-lg" href="#">
            <span className="material-symbols-outlined mr-3 text-lg">logout</span>
            <span className="text-sm font-medium">Sign Out</span>
          </a>
        </div>
      </aside>
    </>
  );
}