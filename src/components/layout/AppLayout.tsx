import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { TickerRibbon } from '../TickerRibbon';
import { useApp } from '../../context/AppContext';

export const AppLayout: React.FC = () => {
  const { tickers } = useApp();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#080C14] text-[#F8FAFC]">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader />

        {/* Live Ticker Strip */}
        <TickerRibbon tickers={tickers} />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#080C14]">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
