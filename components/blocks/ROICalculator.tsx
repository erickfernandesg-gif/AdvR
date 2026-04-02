'use client';

import { useState } from 'react';
import * as motion from "motion/react-client";
import { ROICalculatorContent } from '@/types/blocks';

export default function ROICalculator({ content }: { content: ROICalculatorContent }) {
  const [teamSize, setTeamSize] = useState(50);
  const [avgCommission, setAvgCommission] = useState(5000);
  const [errorRate, setErrorRate] = useState(3);

  // Simple ROI calculation logic
  const monthlyTotal = teamSize * avgCommission;
  const currentErrorCost = monthlyTotal * (errorRate / 100);
  const advrErrorCost = monthlyTotal * 0.001; // 0.1% error rate with AdvR
  const monthlySavings = currentErrorCost - advrErrorCost;
  const yearlySavings = monthlySavings * 12;

  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(37,99,235,0.05)_0%,transparent_50%)] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-extrabold text-foreground mb-6 tracking-tight leading-tight">
              {content.title}
            </h2>
            <p className="text-xl text-muted-foreground mb-10 font-light leading-relaxed">
              {content.subtitle}
            </p>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-foreground">Tamanho da Equipe</label>
                  <span className="text-primary font-bold">{teamSize} pessoas</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="1000" 
                  step="10"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-foreground">Comissão Média Mensal</label>
                  <span className="text-primary font-bold">R$ {avgCommission.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="50000" 
                  step="1000"
                  value={avgCommission}
                  onChange={(e) => setAvgCommission(parseInt(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between mb-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-foreground">Taxa de Erro Atual (%)</label>
                  <span className="text-primary font-bold">{errorRate}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="10" 
                  step="0.5"
                  value={errorRate}
                  onChange={(e) => setErrorRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-10 rounded-[2.5rem] border border-primary/20 bg-white/50 backdrop-blur-xl shadow-2xl relative"
          >
            <div className="absolute -top-4 -right-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
              Simulação de Impacto
            </div>
            
            <div className="space-y-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Economia Mensal Estimada</p>
                <div className="text-5xl md:text-6xl font-display font-black text-primary tracking-tighter">
                  R$ {monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Economia Anual</p>
                  <div className="text-2xl font-display font-bold text-foreground">
                    R$ {yearlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Precisão AdvR</p>
                  <div className="text-2xl font-display font-bold text-accent">
                    99.9%
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground font-light mb-8 italic">
                  *Cálculo baseado na redução de erros operacionais e retrabalho manual.
                </p>
                <button className="btn-electric w-full py-5 text-lg">
                  {content.cta_text}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
