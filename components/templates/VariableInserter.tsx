'use client';

import { useState } from 'react';
import { getAvailableVariables } from '@/lib/email-variables';

interface VariableInserterProps {
  onInsert: (variable: string) => void;
}

export default function VariableInserter({ onInsert }: VariableInserterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const variables = getAvailableVariables();
  
  const filteredVariables = variables.filter(
    v => 
      v.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const groupedVariables = filteredVariables.reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {} as Record<string, typeof variables>);

  const handleInsert = (key: string) => {
    onInsert(`{{${key}}}`);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Insert Variable
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search variables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
            
            <div className="overflow-y-auto max-h-80">
              {Object.entries(groupedVariables).map(([category, vars]) => (
                <div key={category} className="border-b border-gray-100 last:border-0">
                  <div className="px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {category}
                  </div>
                  <div className="divide-y divide-gray-100">
                    {vars.map((variable) => (
                      <button
                        key={variable.key}
                        type="button"
                        onClick={() => handleInsert(variable.key)}
                        className="w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                              {variable.label}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">
                                {`{{${variable.key}}}`}
                              </code>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 ml-3">
                            {variable.example}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {filteredVariables.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-gray-500">
                  No variables found matching "{searchTerm}"
                </div>
              )}
            </div>
            
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                Click a variable to insert it at cursor position. Variables use the format <code className="bg-gray-200 px-1 py-0.5 rounded">{'{{variable}}'}</code>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
