'use client';

import React from 'react';
import { useLowSpec } from '@/contexts/LowSpecContext'; // Chemin d'import ajusté
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { MonitorSmartphone, Sparkles } from 'lucide-react';

const LowSpecToggle: React.FC = () => {
  const { isLowSpec, toggleLowSpec } = useLowSpec();

  return (
    <div className="fixed bottom-5 right-5 bg-white dark:bg-slate-900 p-3 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex items-center space-x-3 transition-all hover:shadow-blue-500/30 dark:hover:shadow-blue-400/30">
      <Label htmlFor="low-spec-mode" className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-2">
        {isLowSpec ? (
            <MonitorSmartphone size={18} className="text-green-500"/>
        ) : (
            <Sparkles size={18} className="text-yellow-500" />
        )}
        <span>{isLowSpec ? 'Mode Éco' : 'Mode Holo'}</span>
      </Label>
      <Switch
        id="low-spec-mode"
        checked={!isLowSpec} // Inversé pour que "on" soit le mode Holo
        onCheckedChange={toggleLowSpec}
        aria-label="Changer de mode d'affichage"
        className="data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-green-500"
      />
    </div>
  );
};

export default LowSpecToggle;