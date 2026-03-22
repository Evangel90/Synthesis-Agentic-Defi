import React from 'react';

interface AssetRowProps {
  icon: string;
  name: string;
  full: string;
  amount: string;
  value: string;
  iconColor?: string;
}

const AssetRow: React.FC<AssetRowProps> = ({ icon, name, full, amount, value, iconColor = "text-primary" }) => (
  <div className="bg-surface-container-lowest p-5 rounded-xl flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer border border-outline-variant/10">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
      </div>
      <div>
        <p className="font-bold text-on-surface">{name}</p>
        <p className="text-xs text-on-surface-variant">{full}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-bold text-on-surface">{amount}</p>
      <p className="text-xs text-on-surface-variant">{value}</p>
    </div>
  </div>
);

export const MainContent: React.FC = () => {
  return (
    <section className="w-[60%] h-full bg-surface p-10 overflow-y-auto custom-scrollbar">
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-highest">
            <img className="w-full h-full object-cover" src="https://ui-avatars.com/api/?name=Alex+Rivera&background=004ac6&color=fff" alt="Avatar" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant/60">Welcome back</p>
            <h2 className="font-headline font-bold text-lg">Alex Rivera</h2>
          </div>
        </div>
        <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/20 hover:bg-surface-container transition-colors cursor-pointer group">
          <span className="text-xs font-mono text-on-surface-variant mr-3">0x8F4...a1B2</span>
          <span className="material-symbols-outlined text-sm text-primary group-hover:scale-110 transition-transform">content_copy</span>
        </div>
      </header>

      <div className="mb-16">
        <span className="text-sm font-medium text-on-surface-variant/60 mb-2 block">Total Portfolio Value</span>
        <h1 className="font-headline text-[3.5rem] font-extrabold text-on-surface tracking-tight leading-none">$12,450.00</h1>
        <div className="mt-4 flex items-center text-tertiary font-semibold text-sm">
          <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
          <span>+4.2% ($512.10) today</span>
        </div>
      </div>

      <div className="flex space-x-6 mb-16">
        {['north_east', 'swap_horiz', 'show_chart'].map((icon) => (
          <button key={icon} className="group flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-6">Your Assets</h3>
        <AssetRow icon="monetization_on" name="USDC" full="USD Coin" amount="8,420.00 USDC" value="$8,420.00" />
        <AssetRow icon="currency_exchange" name="ETH" full="Ethereum" amount="1.45 ETH" value="$3,230.15" />
        <AssetRow icon="layers" name="SOL" full="Solana" amount="5.20 SOL" value="$799.85" iconColor="text-[#8247e5]" />
      </div>
    </section>
  );
};