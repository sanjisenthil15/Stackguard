/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewOrderPage } from './pages/NewOrderPage';
import { ExposurePage } from './pages/ExposurePage';
import { AllocationPage } from './pages/AllocationPage';
import { RebalancingPage } from './pages/RebalancingPage';
import { LiquidityPage } from './pages/LiquidityPage';
import { ExecutionPage } from './pages/ExecutionPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditPage } from './pages/AuditPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public login route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Application Routes inside AppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/orders/new" element={<NewOrderPage />} />
            <Route path="/exposure" element={<ExposurePage />} />
            <Route path="/allocation" element={<AllocationPage />} />
            <Route path="/rebalancing" element={<RebalancingPage />} />
            <Route path="/liquidity" element={<LiquidityPage />} />
            <Route path="/execution" element={<ExecutionPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
