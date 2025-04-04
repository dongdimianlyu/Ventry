import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ScenarioData {
  name: string;
  revenue: number;
  expenses: number;
  profit: number;
  roi: number;
}

interface ScenarioSimulatorProps {
  businessType: string;
  plan?: string;
}

export default function ScenarioSimulator({ businessType, plan }: ScenarioSimulatorProps) {
  const [baseScenario, setBaseScenario] = useState<ScenarioData>({
    name: 'Current',
    revenue: 20000,
    expenses: 15000,
    profit: 5000,
    roi: 33.3
  });
  
  const [scenarios, setScenarios] = useState<ScenarioData[]>([
    {
      name: 'Current',
      revenue: 20000,
      expenses: 15000,
      profit: 5000,
      roi: 33.3
    }
  ]);
  
  const [newScenario, setNewScenario] = useState({
    name: '',
    revenueChange: 0,
    expensesChange: 0,
    investmentAmount: 0
  });
  
  // Extract potential financial data from the plan
  useEffect(() => {
    if (plan) {
      try {
        // Look for financial data in the plan
        const revenueMatch = plan.match(/(?:monthly|total|expected)\s+revenue\s*(?:of|:)\s*\$\s*([\d,]+(\.\d{1,2})?)/i);
        const expensesMatch = plan.match(/(?:monthly|total|expected)\s+(?:expenses|costs)\s*(?:of|:)\s*\$\s*([\d,]+(\.\d{1,2})?)/i);
        
        let extractedRevenue = 0;
        let extractedExpenses = 0;
        
        if (revenueMatch && revenueMatch[1]) {
          extractedRevenue = parseFloat(revenueMatch[1].replace(/,/g, ''));
        }
        
        if (expensesMatch && expensesMatch[1]) {
          extractedExpenses = parseFloat(expensesMatch[1].replace(/,/g, ''));
        }
        
        // If no explicit revenue/expenses found, try to extract from week sections
        if (extractedRevenue === 0 || extractedExpenses === 0) {
          const weekSections = plan.match(/week \d+/gi);
          
          if (weekSections) {
            // Simple regex to find dollar amounts
            const dollarAmounts = plan.match(/\$\s*([\d,]+(\.\d{1,2})?)/g);
            
            if (dollarAmounts && dollarAmounts.length > 2) {
              // Use the first few dollar amounts as potential revenue/expenses
              const sortedAmounts = dollarAmounts
                .map(amount => parseFloat(amount.replace(/[\$,]/g, '')))
                .filter(amount => !isNaN(amount))
                .sort((a, b) => b - a);
              
              if (sortedAmounts.length >= 2) {
                extractedRevenue = extractedRevenue || sortedAmounts[0];
                extractedExpenses = extractedExpenses || sortedAmounts[1];
              }
            }
          }
        }
        
        // Set base values if we found any
        if (extractedRevenue > 0 || extractedExpenses > 0) {
          const newBase = {
            name: 'Current',
            revenue: extractedRevenue || 20000,
            expenses: extractedExpenses || 15000,
            profit: (extractedRevenue || 20000) - (extractedExpenses || 15000),
            roi: ((extractedRevenue || 20000) - (extractedExpenses || 15000)) / (extractedExpenses || 15000) * 100
          };
          
          setBaseScenario(newBase);
          setScenarios([newBase]);
        }
      } catch (error) {
        console.error("Error extracting financial data from plan:", error);
      }
    }
  }, [plan]);

  const handleAddScenario = () => {
    if (newScenario.name.trim() === '') {
      alert('Please give your scenario a name');
      return;
    }
    
    // Calculate new revenue and expenses based on percentage changes
    const revenue = baseScenario.revenue * (1 + newScenario.revenueChange / 100);
    const expenses = baseScenario.expenses * (1 + newScenario.expensesChange / 100) + 
                    (newScenario.investmentAmount > 0 ? newScenario.investmentAmount : 0);
    const profit = revenue - expenses;
    
    // ROI calculation: (profit / total investment) * 100
    const totalInvestment = expenses;
    const roi = totalInvestment > 0 ? (profit / totalInvestment) * 100 : 0;
    
    const scenario: ScenarioData = {
      name: newScenario.name,
      revenue: Math.round(revenue),
      expenses: Math.round(expenses),
      profit: Math.round(profit),
      roi: Math.round(roi * 10) / 10
    };
    
    setScenarios([...scenarios, scenario]);
    setNewScenario({
      name: '',
      revenueChange: 0,
      expensesChange: 0,
      investmentAmount: 0
    });
  };

  const handleDeleteScenario = (index: number) => {
    if (index === 0) return; // Don't delete the base scenario
    const newScenarios = [...scenarios];
    newScenarios.splice(index, 1);
    setScenarios(newScenarios);
  };

  const chartData = {
    labels: scenarios.map(s => s.name),
    datasets: [
      {
        label: 'Revenue',
        data: scenarios.map(s => s.revenue),
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
      },
      {
        label: 'Expenses',
        data: scenarios.map(s => s.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
      },
      {
        label: 'Profit',
        data: scenarios.map(s => s.profit),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      }
    ],
  };

  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f1f5f9',
        }
      },
      title: {
        display: true,
        text: 'Scenario Comparison',
        color: '#f1f5f9',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': $';
              label += context.parsed.y.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#cbd5e1',
        },
        grid: {
          color: 'rgba(203, 213, 225, 0.1)',
        }
      },
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
          color: '#cbd5e1',
        },
        grid: {
          color: 'rgba(203, 213, 225, 0.1)',
        }
      }
    }
  };
  
  // Update base scenario values
  const updateBaseScenario = (field: keyof ScenarioData, value: number) => {
    setBaseScenario(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate profit and ROI
      updated.profit = updated.revenue - updated.expenses;
      updated.roi = (updated.profit / updated.expenses) * 100;
      
      // Update the current scenario in the scenarios array
      const updatedScenarios = [...scenarios];
      const currentIndex = updatedScenarios.findIndex(s => s.name === 'Current');
      if (currentIndex >= 0) {
        updatedScenarios[currentIndex] = updated;
        setScenarios(updatedScenarios);
      }
      
      return updated;
    });
  };

  // Add a new scenario based on percentage changes from the base
  const addScenario = () => {
    if (!newScenario.name) return;
    
    const revenueMultiplier = 1 + (newScenario.revenueChange / 100);
    const expenseMultiplier = 1 + (newScenario.expensesChange / 100);
    
    const newRevenue = Math.round(baseScenario.revenue * revenueMultiplier);
    const newExpenses = Math.round(baseScenario.expenses * expenseMultiplier) + newScenario.investmentAmount;
    const newProfit = newRevenue - newExpenses;
    const newRoi = (newProfit / newExpenses) * 100;
    
    const scenario: ScenarioData = {
      name: newScenario.name,
      revenue: newRevenue,
      expenses: newExpenses,
      profit: newProfit,
      roi: newRoi
    };
    
    setScenarios([...scenarios, scenario]);
    
    // Reset the form
    setNewScenario({
      name: '',
      revenueChange: 0,
      expensesChange: 0,
      investmentAmount: 0
    });
  };

  // Remove a scenario by index
  const removeScenario = (index: number) => {
    const updatedScenarios = [...scenarios];
    updatedScenarios.splice(index, 1);
    setScenarios(updatedScenarios);
  };

  // Reset all scenarios back to just the base scenario
  const resetScenarios = () => {
    setScenarios([{...baseScenario}]);
  };

  // Simulate running an advanced analysis (add a few predefined scenarios)
  const runAdvancedSimulation = () => {
    // Create several predefined scenarios to demonstrate different business strategies
    const conservativeGrowth: ScenarioData = {
      name: 'Conservative Growth',
      revenue: Math.round(baseScenario.revenue * 1.1),  // 10% increase
      expenses: Math.round(baseScenario.expenses * 1.05), // 5% increase
      profit: 0, // calculated below
      roi: 0 // calculated below
    };
    conservativeGrowth.profit = conservativeGrowth.revenue - conservativeGrowth.expenses;
    conservativeGrowth.roi = (conservativeGrowth.profit / conservativeGrowth.expenses) * 100;
    
    const aggressiveGrowth: ScenarioData = {
      name: 'Aggressive Growth',
      revenue: Math.round(baseScenario.revenue * 1.3),  // 30% increase
      expenses: Math.round(baseScenario.expenses * 1.25), // 25% increase
      profit: 0, // calculated below
      roi: 0 // calculated below
    };
    aggressiveGrowth.profit = aggressiveGrowth.revenue - aggressiveGrowth.expenses;
    aggressiveGrowth.roi = (aggressiveGrowth.profit / aggressiveGrowth.expenses) * 100;
    
    const costReduction: ScenarioData = {
      name: 'Cost Optimization',
      revenue: Math.round(baseScenario.revenue * 0.95),  // 5% decrease
      expenses: Math.round(baseScenario.expenses * 0.85), // 15% decrease
      profit: 0, // calculated below
      roi: 0 // calculated below
    };
    costReduction.profit = costReduction.revenue - costReduction.expenses;
    costReduction.roi = (costReduction.profit / costReduction.expenses) * 100;
    
    const marketDownturn: ScenarioData = {
      name: 'Market Downturn',
      revenue: Math.round(baseScenario.revenue * 0.7),  // 30% decrease
      expenses: Math.round(baseScenario.expenses * 0.9), // 10% decrease
      profit: 0, // calculated below
      roi: 0 // calculated below
    };
    marketDownturn.profit = marketDownturn.revenue - marketDownturn.expenses;
    marketDownturn.roi = (marketDownturn.profit / marketDownturn.expenses) * 100;
    
    // Replace all existing scenarios except the base with these new ones
    setScenarios([
      {...baseScenario},
      conservativeGrowth,
      aggressiveGrowth,
      costReduction,
      marketDownturn
    ]);
  };

  // Export scenarios to CSV
  const exportScenarios = () => {
    const headers = ['Scenario', 'Revenue', 'Expenses', 'Profit', 'ROI (%)'];
    const rows = scenarios.map(s => [
      s.name,
      s.revenue.toString(),
      s.expenses.toString(),
      s.profit.toString(),
      s.roi.toFixed(1)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${businessType}_Scenarios_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate a report (placeholder function)
  const generateReport = () => {
    // This would typically call an API or generate a PDF
    // For now we'll just log to console
    console.log('Generating executive summary report for scenarios:', scenarios);
    alert('Executive summary is being generated. This would typically create a PDF or detailed report.');
  };

  return (
    <div className="bg-gray-900 text-gray-200 rounded-xl border border-gray-700/40 shadow-2xl overflow-hidden">
      {/* Header section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
              </svg>
              Advanced Scenario Modeling
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Simulate business outcomes with multi-variable scenarios
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-gray-800/80 rounded-lg px-4 py-2 border border-gray-700/50">
              <p className="text-xs text-gray-400">Base Profit</p>
              <p className={`text-lg font-semibold ${baseScenario.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${baseScenario.profit.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-gray-800/80 rounded-lg px-4 py-2 border border-gray-700/50">
              <p className="text-xs text-gray-400">Scenarios</p>
              <p className="text-lg font-semibold text-white">{scenarios.length}</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={runAdvancedSimulation}
              className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Run Advanced Simulation
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Base scenario configuration */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
            </svg>
            Base Scenario Configuration
          </h3>
          
          <div className="space-y-4">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">Monthly Revenue</span>
                <span className="text-green-400 font-medium">${baseScenario.revenue.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={baseScenario.revenue}
                onChange={(e) => updateBaseScenario('revenue', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-400">Monthly Expenses</span>
                <span className="text-red-400 font-medium">${baseScenario.expenses.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={baseScenario.expenses}
                onChange={(e) => updateBaseScenario('expenses', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/40">
                <span className="text-xs text-gray-400 block mb-1">Monthly Profit</span>
                <span className={`text-lg font-semibold ${baseScenario.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${baseScenario.profit.toLocaleString()}
                </span>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/40">
                <span className="text-xs text-gray-400 block mb-1">ROI</span>
                <span className={`text-lg font-semibold ${baseScenario.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {baseScenario.roi.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/40">
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Business Overview
              </h4>
              <div className="text-sm text-gray-400">
                <p>
                  This {businessType} business is currently generating a {baseScenario.profit >= 0 ? 'profit' : 'loss'} of ${Math.abs(baseScenario.profit).toLocaleString()} per month with a {baseScenario.roi.toFixed(1)}% return on investment.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart area */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Scenario Comparison
          </h3>
          
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/40 mb-4 h-[300px]">
            <Bar
              data={{
                labels: scenarios.map(s => s.name),
                datasets: [
                  {
                    label: 'Revenue',
                    data: scenarios.map(s => s.revenue),
                    backgroundColor: 'rgba(72, 187, 120, 0.6)',
                    borderColor: 'rgba(72, 187, 120, 1)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Expenses',
                    data: scenarios.map(s => s.expenses),
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Profit',
                    data: scenarios.map(s => s.profit),
                    backgroundColor: 'rgba(66, 153, 225, 0.6)',
                    borderColor: 'rgba(66, 153, 225, 1)',
                    borderWidth: 1,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)'
                    }
                  },
                  y: {
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      callback: (value: any) => `$${value}`
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: 'rgba(255, 255, 255, 0.8)',
                      font: {
                        size: 12
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleFont: {
                      size: 14
                    },
                    bodyFont: {
                      size: 13
                    },
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 1,
                    callbacks: {
                      label: function(context: any) {
                        return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
          
          <h4 className="text-white text-base font-medium mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Create New Scenario
          </h4>
          
          <div className="bg-gray-800/50 rounded-lg border border-gray-700/40 p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs text-gray-400 block mb-1">Scenario Name</label>
                <input 
                  type="text"
                  placeholder="e.g. Marketing Boost"
                  value={newScenario.name}
                  onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-400 block mb-1">Revenue Change %</label>
                <div className="relative">
                  <input 
                    type="number"
                    placeholder="+/-"
                    value={newScenario.revenueChange}
                    onChange={(e) => setNewScenario({...newScenario, revenueChange: parseFloat(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 pr-6 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                </div>
            </div>
            
            <div>
                <label className="text-xs text-gray-400 block mb-1">Expense Change %</label>
                <div className="relative">
              <input
                type="number"
                    placeholder="+/-"
                value={newScenario.expensesChange}
                    onChange={(e) => setNewScenario({...newScenario, expensesChange: parseFloat(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 pr-6 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
              />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">%</span>
                </div>
            </div>
            
            <div>
                <label className="text-xs text-gray-400 block mb-1">Investment</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 sm:text-sm">$</span>
                  </div>
              <input
                type="number"
                    placeholder="Amount"
                value={newScenario.investmentAmount}
                    onChange={(e) => setNewScenario({...newScenario, investmentAmount: parseFloat(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 pl-7 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
              />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={addScenario}
                disabled={!newScenario.name}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  !newScenario.name
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                }`}
            >
              Add Scenario
              </motion.button>
        </div>
          </div>
        </div>
      </div>
      
      {/* Scenario comparison table */}
      <div className="p-6 pt-0">
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl border border-gray-700/50 shadow-lg overflow-hidden">
          <h3 className="text-white text-lg font-semibold p-5 border-b border-gray-700/40 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd" />
            </svg>
            Detailed Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
          <thead>
                <tr className="bg-gray-800/80">
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Scenario</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Expenses</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Profit</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ROI</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Variance</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
              <tbody>
            {scenarios.map((scenario, index) => (
                  <tr 
                    key={index} 
                    className={`${index % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/10'} ${scenario.name === 'Current' ? 'border-l-4 border-blue-500' : ''}`}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{scenario.name}</div>
                      {scenario.name === 'Current' && (
                        <div className="text-xs text-blue-400">Base Scenario</div>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">${scenario.revenue.toLocaleString()}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">${scenario.expenses.toLocaleString()}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${scenario.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${scenario.profit.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${scenario.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {scenario.roi.toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      {scenario.name !== 'Current' && (
                        <div className={`text-sm font-medium ${scenario.profit - baseScenario.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {scenario.profit - baseScenario.profit >= 0 ? '+' : ''}${(scenario.profit - baseScenario.profit).toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      {scenario.name !== 'Current' && (
                    <button 
                          onClick={() => removeScenario(index)}
                          className="text-gray-400 hover:text-red-400 ml-3"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        </div>
      </div>
      
      {/* Bottom action buttons */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-t border-gray-700/40 flex justify-between">
        <button
          onClick={resetScenarios}
          className="bg-gray-700/70 text-gray-200 py-2 px-4 rounded-lg text-sm font-medium border border-gray-600/50 shadow-sm hover:bg-gray-600/70 transition-all flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset All Scenarios
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={exportScenarios}
            className="bg-gray-700/70 text-gray-200 py-2 px-4 rounded-lg text-sm font-medium border border-gray-600/50 shadow-sm hover:bg-gray-600/70 transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Analysis
          </button>
          <button
            onClick={generateReport}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generate Executive Summary
          </button>
          </div>
      </div>
    </div>
  );
} 