import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowRightLeft,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuditPage: React.FC = () => {
  const { auditLogs, exportAuditCsv } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedDecision, setSelectedDecision] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesModule = selectedModule === 'ALL' || log.module === selectedModule;
    const matchesDecision = selectedDecision === 'ALL' || log.decision === selectedDecision;
    const matchesSearch =
      searchQuery === '' ||
      log.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesModule && matchesDecision && matchesSearch;
  });

  const getDecisionBadge = (d: string) => {
    switch (d) {
      case 'ALLOWED':
        return 'bg-[#064E3B] text-[#34D399] border-[#10B981]/30';
      case 'NETTED':
        return 'bg-sky-950/70 text-[#38BDF8] border-[#38BDF8]/30';
      case 'BLOCKED':
        return 'bg-red-950/70 text-[#EF4444] border-[#EF4444]/40';
      case 'WARNING':
        return 'bg-amber-950/70 text-amber-400 border-amber-500/40';
      case 'EXECUTED':
        return 'bg-purple-950/70 text-purple-300 border-purple-500/40';
      case 'CONFIG_CHANGE':
        return 'bg-blue-950/70 text-sky-300 border-sky-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950/70 text-[#34D399] border border-emerald-500/30">
              AUDIT
            </span>
            <h1 className="text-xl font-extrabold text-[#F8FAFC] tracking-tight">
              Institutional Compliance & Algorithmic Audit Trail
            </h1>
          </div>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Immutable log of all pre-trade evaluations, contra-order crossing decisions, Bayesian liquidity alerts, and parameter edits.
          </p>
        </div>

        {/* Working CSV Export Button */}
        <button
          onClick={exportAuditCsv}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#10B981] hover:bg-[#10B981]/90 text-[#080C14] text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail by ticker, reason, actor, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0F1A] border border-[#1E293B] rounded-lg py-2 pl-9 pr-3 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        {/* Module Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-[#64748B]" />
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg py-2 px-2.5 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="ALL">All Modules</option>
            <option value="M1_NETTING">M1: Netting Gate</option>
            <option value="M2_ALLOCATION">M2: Capital Allocator</option>
            <option value="M3_REBALANCING">M3: Rebalancing</option>
            <option value="M4_LIQUIDITY">M4: Liquidity Sizer</option>
            <option value="M5_SEQUENCER">M5: Execution Sequencer</option>
            <option value="SYSTEM">System & Config</option>
          </select>

          {/* Decision Filter */}
          <select
            value={selectedDecision}
            onChange={(e) => setSelectedDecision(e.target.value)}
            className="bg-[#0A0F1A] border border-[#1E293B] rounded-lg py-2 px-2.5 text-xs font-mono text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="ALL">All Decisions</option>
            <option value="ALLOWED">Allowed</option>
            <option value="BLOCKED">Blocked</option>
            <option value="NETTED">Netted</option>
            <option value="EXECUTED">Executed</option>
            <option value="WARNING">Warning</option>
            <option value="CONFIG_CHANGE">Config Change</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0E1626] border border-[#1E293B] rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
            Filtered Audit Records ({filteredLogs.length} Entries)
          </h2>
          <span className="text-[10px] font-mono text-[#64748B]">
            SEBI REGULATORY AUDIT READY
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1E293B] text-[10px] uppercase tracking-wider text-[#64748B] bg-[#0A0F1A]/80 font-sans">
                <th className="py-2.5 px-3 font-semibold">AUDIT ID</th>
                <th className="py-2.5 px-2 font-semibold">TIME</th>
                <th className="py-2.5 px-2 font-semibold">MODULE</th>
                <th className="py-2.5 px-2 font-semibold">EVENT TYPE</th>
                <th className="py-2.5 px-2 font-semibold text-center">DECISION</th>
                <th className="py-2.5 px-3 font-semibold">ACTOR / AGENT</th>
                <th className="py-2.5 px-4 font-semibold">HEADLINE & REGULATORY DETAILS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/40 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#0A0F1A] transition-colors">
                  <td className="py-2.5 px-3 text-[#38BDF8] font-bold">
                    {log.id}
                  </td>
                  <td className="py-2.5 px-2 text-[#64748B]">
                    {log.timestamp}
                  </td>
                  <td className="py-2.5 px-2 font-sans font-medium text-slate-300">
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#0A0F1A] border border-[#1E293B]">
                      {log.module.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 font-sans text-slate-400">
                    {log.eventType}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold font-sans tracking-wider uppercase ${getDecisionBadge(
                        log.decision
                      )}`}
                    >
                      {log.decision}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-[#F8FAFC]">
                    {log.actor}
                  </td>
                  <td className="py-2.5 px-4 font-sans">
                    <div className="font-semibold text-[#F8FAFC]">{log.headline}</div>
                    <div className="text-[11px] text-[#94A3B8] mt-0.5 leading-relaxed">{log.details}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
