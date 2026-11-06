/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { QATestResult } from '../types/pizzeria';
import { api } from '../services/api';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Play,
  RotateCw,
  Clock,
  Layers,
  Database,
  Cpu,
  FileCheck,
  Activity,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QASuiteView: React.FC = () => {
  const [results, setResults] = useState<QATestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [totalDurationMs, setTotalDurationMs] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>('todas');
  const [hasRun, setHasRun] = useState(false);

  const runAllTests = async () => {
    setIsRunning(true);
    try {
      const res = await api.runQASuite();
      if (res.success && res.report) {
        setResults(res.report.results);
        setTotalDurationMs(res.report.totalDurationMs);
        setHasRun(true);

        if (res.report.passed) {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.7 },
            colors: ['#10b981', '#3b82f6', '#f59e0b'],
          });
        }
      }
    } catch (err: any) {
      console.error('Error running QA suite:', err);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const totalTests = results.length;
  const passedTests = results.filter((r) => r.passed).length;
  const failedTests = totalTests - passedTests;
  const allPassed = totalTests > 0 && failedTests === 0;

  const filteredResults = results.filter((r) => {
    if (selectedFilter === 'todas') return true;
    if (selectedFilter === 'passed') return r.passed;
    if (selectedFilter === 'failed') return !r.passed;
    return r.category === selectedFilter;
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'database':
        return <Database className="w-4 h-4 text-amber-400" />;
      case 'builder':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'quotation':
        return <Cpu className="w-4 h-4 text-blue-400" />;
      case 'promos':
        return <Award className="w-4 h-4 text-purple-400" />;
      case 'orders':
        return <Activity className="w-4 h-4 text-orange-400" />;
      case 'chatbot':
        return <FileCheck className="w-4 h-4 text-red-400" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-stone-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* QA Header Banner */}
      <div className="bg-stone-900/90 p-6 rounded-3xl border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Suite de Pruebas Automatizadas & Auditoría QA</span>
          </div>
          <h2 className="text-2xl font-sans font-black text-white">
            Verificación Integral PIZZASMART
          </h2>
          <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
            Ejecución de assertions en vivo sobre la base de datos en COP, el cálculo del constructor de pizzas, el motor de cotizaciones para eventos, la máquina de estados de órdenes y la resiliencia del chatbot Pizzaiolo Smart.
          </p>
        </div>

        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 active:scale-95 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-950/60 transition-all shrink-0"
        >
          {isRunning ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Ejecutando Pruebas...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Ejecutar Suite QA Ahora</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-center space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
            Estado General
          </span>
          <div className="flex items-center justify-center gap-2">
            {allPassed ? (
              <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                <CheckCircle2 className="w-4 h-4" /> 100% Exitoso
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm font-bold text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-800">
                <XCircle className="w-4 h-4" /> Fallos Detectados
              </span>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-center space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
            Pruebas Pasadas
          </span>
          <div className="text-2xl font-mono font-bold text-emerald-400">
            {passedTests} / {totalTests}
          </div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-center space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
            Pruebas Fallidas
          </span>
          <div className="text-2xl font-mono font-bold text-red-400">
            {failedTests}
          </div>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 text-center space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-zinc-400 tracking-wider">
            Tiempo de Ejecución
          </span>
          <div className="text-2xl font-mono font-bold text-orange-400">
            {totalDurationMs} ms
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'todas', label: 'Todas las Pruebas' },
          { id: 'database', label: 'Base de Datos (COP)' },
          { id: 'builder', label: 'Constructor Pizza' },
          { id: 'quotation', label: 'Motor Cotización' },
          { id: 'promos', label: 'Cupones & Promos' },
          { id: 'orders', label: 'Órdenes & Estados' },
          { id: 'chatbot', label: 'Chatbot Pizzaiolo AI' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors font-medium ${
              selectedFilter === tab.id
                ? 'bg-orange-600 text-white font-bold'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Test Results Detailed List */}
      <div className="space-y-3">
        {filteredResults.map((test) => (
          <div
            key={test.id}
            className={`p-4 rounded-2xl border transition-all ${
              test.passed
                ? 'bg-stone-900/80 border-stone-800 hover:border-emerald-500/40'
                : 'bg-red-950/20 border-red-800/80'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-xl border mt-0.5 ${
                    test.passed
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                      : 'bg-red-950/60 border-red-800 text-red-400'
                  }`}
                >
                  {getCategoryIcon(test.category)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-stone-500">[{test.id}]</span>
                    <h4 className="font-bold text-sm text-white">{test.name}</h4>
                  </div>
                  <p className="text-xs text-stone-400 mt-1">{test.details}</p>
                  <div className="mt-1.5 text-[11px] text-amber-300/80 font-mono">
                    <span className="text-stone-500">Assertion:</span> {test.assertion}
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-1 text-xs">
                {test.passed ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-800 text-[11px]">
                    <XCircle className="w-3.5 h-3.5" /> FAILED
                  </span>
                )}
                <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {test.durationMs}ms
                </span>
              </div>
            </div>

            {test.error && (
              <div className="mt-3 p-2.5 bg-red-950/40 border border-red-900 rounded-xl text-red-300 font-mono text-xs">
                {test.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
