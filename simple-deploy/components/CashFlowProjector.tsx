import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Market trend models by industry
const INDUSTRY_MODELS = {
  retail: {
    baseRevenueMultiplier: 1.0,
    baseExpenseMultiplier: 0.95,
    seasonalityFactors: [1.0, 1.05, 1.1, 1.2], // Higher in weeks 3-4
    marketTrendFactor: 0.02, // 2% weekly growth
    volatility: 0.1,
  },
  technology: {
    baseRevenueMultiplier: 1.2,
    baseExpenseMultiplier: 1.1,
    seasonalityFactors: [1.0, 1.0, 1.05, 1.05], // Slight increase in later weeks
    marketTrendFactor: 0.04, // 4% weekly growth
    volatility: 0.15,
  },
  foodService: {
    baseRevenueMultiplier: 0.9,
    baseExpenseMultiplier: 0.85,
    seasonalityFactors: [1.1, 1.0, 1.2, 1.1], // Weekend peaks
    marketTrendFactor: 0.015, // 1.5% weekly growth
    volatility: 0.12,
  },
  healthcare: {
    baseRevenueMultiplier: 1.15,
    baseExpenseMultiplier: 1.1,
    seasonalityFactors: [1.0, 1.0, 1.0, 1.0], // Consistent
    marketTrendFactor: 0.01, // 1% weekly growth
    volatility: 0.05,
  },
  manufacturing: {
    baseRevenueMultiplier: 1.05,
    baseExpenseMultiplier: 1.0,
    seasonalityFactors: [0.9, 1.0, 1.1, 1.0], // Production cycles
    marketTrendFactor: 0.015, // 1.5% weekly growth
    volatility: 0.08,
  },
  default: {
    baseRevenueMultiplier: 1.0,
    baseExpenseMultiplier: 1.0,
    seasonalityFactors: [1.0, 1.0, 1.0, 1.0],
    marketTrendFactor: 0.02,
    volatility: 0.1,
  }
};

// Recession and boom scenario modifiers
const ECONOMIC_SCENARIOS = {
  recession: {
    revenueMultiplier: 0.7,
    expenseMultiplier: 0.9,
    volatilityMultiplier: 1.5
  },
  normal: {
    revenueMultiplier: 1.0,
    expenseMultiplier: 1.0,
    volatilityMultiplier: 1.0
  },
  boom: {
    revenueMultiplier: 1.3,
    expenseMultiplier: 1.1,
    volatilityMultiplier: 1.2
  }
};

// Business lifecycle phase modifiers
const BUSINESS_LIFECYCLE = {
  startup: {
    revenueGrowthModifier: 0.1, // +10% growth
    expenseGrowthModifier: 0.15, // +15% expense growth
    volatilityModifier: 1.3 // 30% more volatility
  },
  growth: {
    revenueGrowthModifier: 0.05, // +5% growth
    expenseGrowthModifier: 0.03, // +3% expense growth
    volatilityModifier: 1.1 // 10% more volatility
  },
  mature: {
    revenueGrowthModifier: 0.01, // +1% growth
    expenseGrowthModifier: 0.0, // stable expenses
    volatilityModifier: 0.8 // 20% less volatility
  },
  declining: {
    revenueGrowthModifier: -0.03, // -3% growth
    expenseGrowthModifier: -0.01, // -1% expense reduction
    volatilityModifier: 1.2 // 20% more volatility
  }
};

interface CashFlowData {
  initialBalance: number;
  revenue: number[];
  expenses: number[];
  balance: number[];
  weeks: string[];
  cumulativeRevenue: number;
  cumulativeExpenses: number;
  netProfit: number;
  profitMargin: number;
  breakEvenPoint: number | null;
  burnRate: number;
}

interface CashFlowProjectorProps {
  businessType: string;
  plan?: string;
}

export default function CashFlowProjector({ businessType, plan }: CashFlowProjectorProps) {
  const [cashFlowData, setCashFlowData] = useState<CashFlowData>({
    initialBalance: 10000,
    revenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expenses: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    balance: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
    weeks: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
    cumulativeRevenue: 0,
    cumulativeExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    breakEvenPoint: null,
    burnRate: 0
  });
  
  const [inputs, setInputs] = useState({
    initialBalance: 10000,
    weeklyRevenueBase: 5000,
    weeklyRevenueGrowth: 10, // percentage
    weeklyExpensesBase: 3500,
    weeklyExpensesGrowth: 5, // percentage
    revenueSpikeWeek: 0,
    revenueSpikeAmount: 0,
    expenseSpikeWeek: 0,
    expenseSpikeAmount: 0,
    economicScenario: 'normal',
    businessLifecycle: 'growth',
    seasonalityImpact: 'medium',
    marketCompetition: 'medium',
    initialMarketingBoost: false,
    taxRate: 25, // percentage
    employeeCount: 5,
    hasPhysicalLocation: true,
    forecastWeeks: 12,
    includeRandomEvents: true
  });

  // Extract potential revenue and expense data from the plan
  useEffect(() => {
    if (plan) {
      try {
        // Advanced NLP-like extraction from plan text
        const weekSections = plan.match(/### Week \d+[^\n]*\n([\s\S]*?)(?=### Week \d+|## |$)/g) || [];
        
        const extractedRevenue = Array(12).fill(0);
        const extractedExpenses = Array(12).fill(0);
        
        // Extract general business parameters
        const employeeMatch = plan.match(/(\d+)\s*(employee|staff|team member)/i);
        const hasPhysicalLocation = Boolean(plan.match(/(physical location|retail space|office|store)/i));
        
        // Business lifecycle detection
        let detectedLifecycle = 'growth';
        if (plan.match(/(startup|beginning|starting|launch|new business)/i)) {
          detectedLifecycle = 'startup';
        } else if (plan.match(/(mature|established|stable)/i)) {
          detectedLifecycle = 'mature';
        } else if (plan.match(/(decline|shrink|downsize|reduce)/i)) {
          detectedLifecycle = 'declining';
        }

        weekSections.forEach((weekSection, weekIndex) => {
          if (weekIndex < 12) {
            // Look for financial numbers in the text with more pattern recognition
            const revenues = weekSection.match(/\$\s*([\d,]+(\.\d{1,2})?)\s*(revenue|sales|income|earnings|profit)/gi);
            const expenses = weekSection.match(/\$\s*([\d,]+(\.\d{1,2})?)\s*(expenses|costs|spending|investment|budget)/gi);
            
            if (revenues && revenues.length > 0) {
              // Extract the first revenue number
              const revenueMatch = revenues[0].match(/\$\s*([\d,]+(\.\d{1,2})?)/);
              if (revenueMatch) {
                extractedRevenue[weekIndex] = parseFloat(revenueMatch[1].replace(/,/g, ''));
              }
            }
            
            if (expenses && expenses.length > 0) {
              // Extract the first expense number
              const expenseMatch = expenses[0].match(/\$\s*([\d,]+(\.\d{1,2})?)/);
              if (expenseMatch) {
                extractedExpenses[weekIndex] = parseFloat(expenseMatch[1].replace(/,/g, ''));
              }
            }
          }
        });
        
        // If any data was successfully extracted, use it
        const hasExtractedData = extractedRevenue.some(val => val > 0) || extractedExpenses.some(val => val > 0);
        
        if (hasExtractedData) {
          // Calculate base rates from extracted data, avoiding division by zero
          const avgRevenue = extractedRevenue.filter(val => val > 0).reduce((sum, val) => sum + val, 0) / 
                             Math.max(1, extractedRevenue.filter(val => val > 0).length);
          
          const avgExpenses = extractedExpenses.filter(val => val > 0).reduce((sum, val) => sum + val, 0) / 
                              Math.max(1, extractedExpenses.filter(val => val > 0).length);
          
          setInputs(prev => ({
            ...prev,
            weeklyRevenueBase: avgRevenue > 0 ? avgRevenue : prev.weeklyRevenueBase,
            weeklyExpensesBase: avgExpenses > 0 ? avgExpenses : prev.weeklyExpensesBase,
            employeeCount: employeeMatch ? parseInt(employeeMatch[1], 10) : prev.employeeCount,
            hasPhysicalLocation,
            businessLifecycle: detectedLifecycle
          }));
        }
      } catch (error) {
        console.error("Error extracting financial data from plan:", error);
      }
    }
  }, [plan]);

  // Calculate cash flow when inputs change
  useEffect(() => {
    calculateCashFlow();
  }, [inputs, businessType]);

  // Enhanced cash flow calculation with industry models and advanced factors
  const calculateCashFlow = () => {
    const {
      initialBalance,
      weeklyRevenueBase,
      weeklyRevenueGrowth,
      weeklyExpensesBase,
      weeklyExpensesGrowth,
      revenueSpikeWeek,
      revenueSpikeAmount,
      expenseSpikeWeek,
      expenseSpikeAmount,
      economicScenario,
      businessLifecycle,
      seasonalityImpact,
      marketCompetition,
      initialMarketingBoost,
      taxRate,
      employeeCount,
      hasPhysicalLocation,
      forecastWeeks,
      includeRandomEvents
    } = inputs;

    // Get appropriate industry model
    const industryType = businessType?.toLowerCase() || 'default';
    const industryModel = INDUSTRY_MODELS[industryType as keyof typeof INDUSTRY_MODELS] || INDUSTRY_MODELS.default;
    
    // Apply economic scenario modifiers
    const economicModel = ECONOMIC_SCENARIOS[economicScenario as keyof typeof ECONOMIC_SCENARIOS] || ECONOMIC_SCENARIOS.normal;
    
    // Apply business lifecycle modifiers
    const lifecycleModel = BUSINESS_LIFECYCLE[businessLifecycle as keyof typeof BUSINESS_LIFECYCLE] || BUSINESS_LIFECYCLE.growth;

    // Seasonality impact strength
    const seasonalityStrength = 
      seasonalityImpact === 'high' ? 1.5 : 
      seasonalityImpact === 'low' ? 0.5 : 
      1.0; // medium

    // Competition impact on revenue
    const competitionFactor = 
      marketCompetition === 'high' ? 0.85 : 
      marketCompetition === 'low' ? 1.15 : 
      1.0; // medium

    // Initial marketing boost effect
    const marketingBoostFactor = initialMarketingBoost ? [1.2, 1.15, 1.1, 1.05] : [1, 1, 1, 1];
    
    // Employee cost calculation
    const employeeCostBase = employeeCount * 1000; // $1000 per employee as base cost
    
    // Physical location cost
    const locationCost = hasPhysicalLocation ? 2000 : 0;

    // Calculate base revenue with advanced modifiers
    const baseRevenueWithModifiers = weeklyRevenueBase * 
                                      industryModel.baseRevenueMultiplier * 
                                      economicModel.revenueMultiplier *
                                      competitionFactor;

    // Calculate base expenses with advanced modifiers
    const baseExpensesWithModifiers = weeklyExpensesBase * 
                                      industryModel.baseExpenseMultiplier * 
                                      economicModel.expenseMultiplier +
                                      employeeCostBase +
                                      locationCost;

    // Extended seasonality factors for 12 weeks
    const extendedSeasonalityFactors = Array(forecastWeeks).fill(0).map((_, i) => {
      // Create a repeating pattern from the industry's seasonality factors
      const baseFactors = industryModel.seasonalityFactors;
      const factor = baseFactors[i % baseFactors.length];
      return 1 + ((factor - 1) * seasonalityStrength);
    });

    const weeks = Array.from({ length: forecastWeeks }, (_, i) => `Week ${i + 1}`);
    const revenue = Array(forecastWeeks).fill(0);
    const expenses = Array(forecastWeeks).fill(0);
    const balance = [initialBalance];

    for (let i = 0; i < forecastWeeks; i++) {
      // Compound growth with lifecycle adjustment
      const growthMultiplier = Math.pow(
        1 + ((weeklyRevenueGrowth / 100) + lifecycleModel.revenueGrowthModifier), 
        i
      );
      
      // Apply market trend factor
      const marketTrendMultiplier = Math.pow(1 + industryModel.marketTrendFactor, i);
      
      // Base revenue calculation
      let weeklyRevenue = baseRevenueWithModifiers * 
                          growthMultiplier * 
                          marketTrendMultiplier * 
                          extendedSeasonalityFactors[i] *
                          (i < 4 ? marketingBoostFactor[i] : 1);
      
      // Add revenue spike
      if (i + 1 === revenueSpikeWeek) {
        weeklyRevenue += revenueSpikeAmount;
      }
      
      // Add random variation based on industry volatility
      if (includeRandomEvents) {
        const volatilityFactor = industryModel.volatility * 
                                  economicModel.volatilityMultiplier * 
                                  lifecycleModel.volatilityModifier;
        const randomVariation = 1 + (Math.random() * 2 - 1) * volatilityFactor;
        weeklyRevenue *= randomVariation;
      }
      
      // Expense calculation with lifecycle adjustment
      const expenseGrowthMultiplier = Math.pow(
        1 + ((weeklyExpensesGrowth / 100) + lifecycleModel.expenseGrowthModifier), 
        i
      );
      
      // Base expenses calculation
      let weeklyExpense = baseExpensesWithModifiers * expenseGrowthMultiplier;
      
      // Add expense spike
      if (i + 1 === expenseSpikeWeek) {
        weeklyExpense += expenseSpikeAmount;
      }
      
      // Add random expense variation
      if (includeRandomEvents) {
        const expenseVolatility = industryModel.volatility * 0.7 * economicModel.volatilityMultiplier;
        const randomExpenseVariation = 1 + (Math.random() * 2 - 1) * expenseVolatility;
        weeklyExpense *= randomExpenseVariation;
      }
      
      // Apply taxes on positive profit
      const weeklyProfit = weeklyRevenue - weeklyExpense;
      const taxAmount = weeklyProfit > 0 ? weeklyProfit * (taxRate / 100) : 0;
      weeklyExpense += taxAmount;
      
      revenue[i] = Math.round(weeklyRevenue);
      expenses[i] = Math.round(weeklyExpense);
      balance.push(Math.round(balance[i] + revenue[i] - expenses[i]));
    }
    
    // Remove initial value so array lengths match
    balance.shift();
    
    // Calculate key performance indicators
    const cumulativeRevenue = revenue.reduce((sum, val) => sum + val, 0);
    const cumulativeExpenses = expenses.reduce((sum, val) => sum + val, 0);
    const netProfit = cumulativeRevenue - cumulativeExpenses;
    const profitMargin = cumulativeRevenue > 0 ? (netProfit / cumulativeRevenue) * 100 : 0;
    
    // Calculate break-even point
    let breakEvenPoint = null;
    let cumulativeR = 0;
    let cumulativeE = 0;
    
    for (let i = 0; i < forecastWeeks; i++) {
      cumulativeR += revenue[i];
      cumulativeE += expenses[i];
      
      if (cumulativeR >= initialBalance + cumulativeE && breakEvenPoint === null) {
        breakEvenPoint = i + 1;
      }
    }
    
    // Burn rate calculation (average weekly expense when revenue < expenses)
    const negativeWeeks = weeks.filter((_, i) => revenue[i] < expenses[i]).length;
    const burnAmount = negativeWeeks > 0 
      ? weeks.reduce((sum, _, i) => sum + Math.max(0, expenses[i] - revenue[i]), 0) / negativeWeeks
      : 0;
    
    setCashFlowData({
      initialBalance,
      revenue,
      expenses,
      balance,
      weeks,
      cumulativeRevenue,
      cumulativeExpenses,
      netProfit,
      profitMargin,
      breakEvenPoint,
      burnRate: Math.round(burnAmount)
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue;
    
    // Handle different input types appropriately
    if (type === 'checkbox') {
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      processedValue = parseFloat(value) || 0;
    } else {
      processedValue = value;
    }
    
    setInputs(prevState => ({
      ...prevState,
      [name]: processedValue
    }));
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cash Flow Projection',
        color: '#334155',
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            if (label) {
              return `${label}: $${context.parsed.y.toLocaleString()}`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
          color: '#64748b'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#64748b'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };
  
  const chartData = {
    labels: cashFlowData.weeks,
    datasets: [
      {
        label: 'Revenue',
        data: cashFlowData.revenue,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.3,
        pointRadius: 3,
      },
      {
        label: 'Expenses',
        data: cashFlowData.expenses,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
        pointRadius: 3,
      },
      {
        label: 'Balance',
        data: cashFlowData.balance,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
        pointRadius: 3,
        borderWidth: 2,
      }
    ]
  };

  // Calculate KPI indicators
  const calculateTotals = () => {
    const totalRevenue = cashFlowData.revenue.reduce((sum, val) => sum + val, 0);
    const totalExpenses = cashFlowData.expenses.reduce((sum, val) => sum + val, 0);
    const netProfit = totalRevenue - totalExpenses;
    return { totalRevenue, totalExpenses, netProfit };
  };

  const { totalRevenue, totalExpenses, netProfit } = calculateTotals();

  // AI Insight Generator based on financial data and business parameters
  const getAIInsight = () => {
    const { netProfit, profitMargin, breakEvenPoint, burnRate } = cashFlowData;
    const { economicScenario, businessLifecycle, marketCompetition, seasonalityImpact } = inputs;
    
    let insight = '';
    
    // Overall financial health assessment
    if (netProfit > 0 && profitMargin > 15) {
      insight += 'Your projected financial model demonstrates strong cash flow fundamentals with above-industry-average profit margins. ';
    } else if (netProfit > 0) {
      insight += 'Your cash flow projections indicate a positive financial trajectory, though there are opportunities to improve profit margins. ';
    } else {
      insight += 'Current projections show cash flow challenges that require attention to expense management and revenue growth strategies. ';
    }
    
    // Break-even analysis
    if (breakEvenPoint) {
      if (breakEvenPoint <= 4) {
        insight += `With a break-even point in Week ${breakEvenPoint}, you're positioned for rapid profitability. `;
      } else if (breakEvenPoint <= 8) {
        insight += `Your model achieves break-even in Week ${breakEvenPoint}, which aligns with typical ${businessType} industry timelines. `;
      } else {
        insight += `The projected break-even in Week ${breakEvenPoint} suggests a longer runway to profitability than industry benchmarks. Consider reviewing capital allocation. `;
      }
    } else {
      insight += "The projection doesn't show a break-even point within the forecast period. Consider recalibrating revenue drivers or investigating cost-cutting measures. ";
    }
    
    // Business lifecycle specific insights
    if (businessLifecycle === 'startup') {
      insight += 'As a startup, your initial burn rate of $' + Math.round(burnRate).toLocaleString() + ' requires careful monitoring of runway metrics. ';
      
      if (inputs.initialMarketingBoost) {
        insight += 'The front-loaded marketing investment shows positive ROI in the projections, supporting customer acquisition targets. ';
      }
    } else if (businessLifecycle === 'growth') {
      insight += 'Your growth-stage financial model demonstrates scalable unit economics with manageable marginal costs. ';
      
      if (profitMargin < 10) {
        insight += 'Consider implementing strategic pricing adjustments to improve margins during this high-growth phase. ';
      }
    } else if (businessLifecycle === 'mature') {
      insight += 'The mature business model shows stable predictable cash flows with limited volatility. ';
      
      if (inputs.weeklyRevenueGrowth < 3) {
        insight += 'Consider exploring adjacent market opportunities or product diversification to reinvigorate growth metrics. ';
      }
    } else {
      insight += 'In a declining market position, cash preservation and strategic pivoting are essential. Focus on optimizing high-margin business segments. ';
    }
    
    // Economic scenario considerations
    if (economicScenario === 'recession') {
      insight += 'Your recession-adjusted model demonstrates appropriate sensitivity to market conditions. ';
      
      if (netProfit > 0) {
        insight += 'The ability to maintain positive cash flow during economic contraction positions you well for recovery-phase expansion. ';
      }
    } else if (economicScenario === 'boom') {
      insight += 'Your model capitalizes effectively on favorable market conditions. Consider building cash reserves for future market normalization. ';
    }
    
    // Seasonality factors
    if (seasonalityImpact === 'high') {
      insight += 'High seasonality impacts require strategic working capital management through peak and valley cycles. ';
    }
    
    // Competition impact
    if (marketCompetition === 'high' && profitMargin > 12) {
      insight += 'Despite high competitive pressure, your margin resilience indicates strong market positioning and differentiation. ';
    } else if (marketCompetition === 'high') {
      insight += 'Consider developing stronger competitive moats to protect margins in your high-competition market segment. ';
    }
    
    // Final strategic recommendation
    if (netProfit > 0 && inputs.weeklyRevenueGrowth > inputs.weeklyExpensesGrowth) {
      insight += 'Strategic recommendation: Continue current trajectory with focused investments in highest-ROI customer acquisition channels.';
    } else if (netProfit > 0) {
      insight += 'Strategic recommendation: Implement margin enhancement initiatives while maintaining current growth investments.';
    } else {
      insight += 'Strategic recommendation: Prioritize operational efficiency and revenue acceleration to address cash flow challenges.';
    }
    
    return insight;
  };

  return (
    <div className="bg-gray-900 text-gray-200 rounded-xl border border-gray-700/40 shadow-2xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left panel - Inputs */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Forecast Parameters
            </h3>
            
            <div className="space-y-6">
              {/* Core Parameters */}
              <div className="rounded-lg bg-gray-800/50 border border-gray-700/50 p-4">
                <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Core Financials
                </h4>
                <div className="space-y-4">
            <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm text-gray-300">Starting Balance</label>
              <div className="relative">
                <input
                  type="number"
                  name="initialBalance"
                  value={inputs.initialBalance}
                  onChange={handleInputChange}
                          className="w-32 bg-gray-700 border border-gray-600 rounded-lg py-1 px-2 pl-6 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                />
                        <span className="absolute left-2 top-1 text-sm text-gray-400">$</span>
              </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={inputs.initialBalance}
                      onChange={handleInputChange}
                      name="initialBalance"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
            </div>
            
            <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm text-gray-300">
                        <span>Weekly Revenue</span>
                        <span className="ml-1 text-xs text-gray-500">(Base)</span>
                      </label>
              <div className="relative">
                <input
                  type="number"
                  name="weeklyRevenueBase"
                  value={inputs.weeklyRevenueBase}
                  onChange={handleInputChange}
                          className="w-32 bg-gray-700 border border-gray-600 rounded-lg py-1 px-2 pl-6 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                />
                        <span className="absolute left-2 top-1 text-sm text-gray-400">$</span>
              </div>
            </div>
              <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={inputs.weeklyRevenueBase}
                onChange={handleInputChange}
                      name="weeklyRevenueBase"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
            
            <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm text-gray-300">
                        <span>Weekly Expenses</span>
                        <span className="ml-1 text-xs text-gray-500">(Base)</span>
                      </label>
              <div className="relative">
                <input
                  type="number"
                  name="weeklyExpensesBase"
                  value={inputs.weeklyExpensesBase}
                  onChange={handleInputChange}
                          className="w-32 bg-gray-700 border border-gray-600 rounded-lg py-1 px-2 pl-6 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="absolute left-2 top-1 text-sm text-gray-400">$</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40000"
                      step="500"
                      value={inputs.weeklyExpensesBase}
                      onChange={handleInputChange}
                      name="weeklyExpensesBase"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                  </div>
              </div>
            </div>
            
              {/* Growth & Projections */}
              <div className="rounded-lg bg-gray-800/50 border border-gray-700/50 p-4">
                <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Growth & Projections
                </h4>
                
                <div className="space-y-4">
            <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm text-gray-300">Revenue Growth (%)</label>
                      <span className="text-green-400 font-medium text-sm">{inputs.weeklyRevenueGrowth}%</span>
                    </div>
              <input
                      type="range"
                      min="-10"
                      max="30"
                      step="0.5"
                      value={inputs.weeklyRevenueGrowth}
                      onChange={handleInputChange}
                      name="weeklyRevenueGrowth"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm text-gray-300">Expense Growth (%)</label>
                      <span className="text-red-400 font-medium text-sm">{inputs.weeklyExpensesGrowth}%</span>
                    </div>
                    <input
                      type="range"
                      min="-10"
                      max="30"
                      step="0.5"
                value={inputs.weeklyExpensesGrowth}
                onChange={handleInputChange}
                      name="weeklyExpensesGrowth"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>
            
            <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm text-gray-300">Forecast Period (Weeks)</label>
                      <span className="text-blue-400 font-medium text-sm">{inputs.forecastWeeks} weeks</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="104"
                      step="4"
                      value={inputs.forecastWeeks}
                onChange={handleInputChange}
                      name="forecastWeeks"
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              {/* Market & Business Conditions */}
              <div className="rounded-lg bg-gray-800/50 border border-gray-700/50 p-4">
                <h4 className="text-sm font-medium text-blue-400 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Market Conditions
                </h4>
                
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm text-gray-300 block mb-1">
                      Economic Scenario
                    </label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-700">
                      <button 
                        className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                          inputs.economicScenario === 'recession' 
                            ? 'bg-red-900/50 text-red-300' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                        onClick={() => setInputs({...inputs, economicScenario: 'recession'})}
                      >
                        Recession
                      </button>
                      <button 
                        className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                          inputs.economicScenario === 'normal' 
                            ? 'bg-blue-900/50 text-blue-300' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                        onClick={() => setInputs({...inputs, economicScenario: 'normal'})}
                      >
                        Stable
                      </button>
                      <button 
                        className={`flex-1 py-1.5 text-xs font-medium transition-colors ${
                          inputs.economicScenario === 'boom' 
                            ? 'bg-green-900/50 text-green-300' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                        onClick={() => setInputs({...inputs, economicScenario: 'boom'})}
                      >
                        Boom
                      </button>
                    </div>
            </div>
            
            <div>
                    <label className="text-sm text-gray-300 block mb-1">
                      Business Lifecycle
                    </label>
              <select
                name="businessLifecycle"
                value={inputs.businessLifecycle}
                onChange={handleInputChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="startup">Startup</option>
                <option value="growth">Growth</option>
                <option value="mature">Mature</option>
                <option value="declining">Declining</option>
              </select>
            </div>
            
                  <div className="grid grid-cols-2 gap-3">
            <div>
                      <label className="text-sm text-gray-300 block mb-1">
                        Competition
                      </label>
              <select
                        name="marketCompetition"
                        value={inputs.marketCompetition}
                onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
                      <label className="text-sm text-gray-300 block mb-1">
                        Seasonality
                      </label>
              <select
                        name="seasonalityImpact"
                        value={inputs.seasonalityImpact}
                onChange={handleInputChange}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
                    </div>
            </div>
            
                  <div className="flex space-x-3">
                    <div className="flex items-center bg-gray-800 rounded-lg p-2 flex-1 border border-gray-700">
              <input
                type="checkbox"
                        id="initialMarketingBoost"
                name="initialMarketingBoost"
                checked={inputs.initialMarketingBoost}
                onChange={handleInputChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
                      <label htmlFor="initialMarketingBoost" className="ml-2 text-sm text-gray-300">Marketing Boost</label>
            </div>
            
                    <div className="flex items-center bg-gray-800 rounded-lg p-2 flex-1 border border-gray-700">
              <input
                type="checkbox"
                        id="includeRandomEvents"
                name="includeRandomEvents"
                checked={inputs.includeRandomEvents}
                onChange={handleInputChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
                      <label htmlFor="includeRandomEvents" className="ml-2 text-sm text-gray-300">Market Volatility</label>
            </div>
            </div>
            
                  <div className="flex items-center bg-gray-800 rounded-lg p-2 border border-gray-700">
              <input
                type="checkbox"
                      id="hasPhysicalLocation"
                name="hasPhysicalLocation"
                checked={inputs.hasPhysicalLocation}
                onChange={handleInputChange}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
                    <label htmlFor="hasPhysicalLocation" className="ml-2 text-sm text-gray-300">Has Physical Location</label>
            </div>
            </div>
            </div>
            
              <div className="pt-2">
                <button 
                  onClick={calculateCashFlow}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Generate Cash Flow Forecast
                </button>
              </div>
            </div>
              </div>
            </div>
            
        {/* Center panel - Charts */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Cash Flow Projection
          </h3>
          
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700/40 mb-4 h-[300px]">
            <Line
              data={{
                labels: cashFlowData.weeks,
                datasets: [
                  {
                    label: 'Revenue',
                    data: cashFlowData.revenue,
                    borderColor: 'rgba(72, 187, 120, 0.8)',
                    backgroundColor: 'rgba(72, 187, 120, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: 'rgba(72, 187, 120, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(72, 187, 120, 1)',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                  },
                  {
                    label: 'Expenses',
                    data: cashFlowData.expenses,
                    borderColor: 'rgba(239, 68, 68, 0.8)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: 'rgba(239, 68, 68, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(239, 68, 68, 1)',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                  },
                  {
                    label: 'Balance',
                    data: cashFlowData.balance,
                    borderColor: 'rgba(66, 153, 225, 0.8)',
                    backgroundColor: 'rgba(66, 153, 225, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3,
                    pointBackgroundColor: 'rgba(66, 153, 225, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(66, 153, 225, 1)',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2,
                    yAxisID: 'y1'
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
                    position: 'left',
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.7)',
                      callback: (value: any) => `$${value}`
                    }
                  },
                  y1: {
                    position: 'right',
                    grid: {
                      drawOnChartArea: false
                    },
                    ticks: {
                      color: 'rgba(66, 153, 225, 0.8)',
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
                        return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
                      }
                    }
                  }
                }
              }}
            />
              </div>
          
          {/* Analysis Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200 shadow-sm"
          >
            <h3 className="font-medium text-gray-800 text-lg mb-3">Projection Analysis</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                {cashFlowData.netProfit >= 0 
                  ? `This projection shows a profitable business with a ${cashFlowData.profitMargin.toFixed(1)}% margin over ${inputs.forecastWeeks} weeks.` 
                  : `This projection shows a loss of $${Math.abs(cashFlowData.netProfit).toLocaleString()} over ${inputs.forecastWeeks} weeks.`}
              </p>
              
              <p>
                {cashFlowData.breakEvenPoint 
                  ? `Break-even point is estimated at week ${cashFlowData.breakEvenPoint}.` 
                  : `The business does not reach break-even within the ${inputs.forecastWeeks}-week forecast period.`}
              </p>
              
              <p>
                {cashFlowData.balance[cashFlowData.balance.length - 1] >= inputs.initialBalance 
                  ? `The final cash balance is ${((cashFlowData.balance[cashFlowData.balance.length - 1] / inputs.initialBalance) * 100 - 100).toFixed(0)}% higher than the initial investment.` 
                  : `The final cash balance is ${((inputs.initialBalance / cashFlowData.balance[cashFlowData.balance.length - 1]) * 100 - 100).toFixed(0)}% lower than the initial investment.`}
              </p>
              
              <p>
                {cashFlowData.burnRate > 0
                  ? `When expenses exceed revenue, the average burn rate is $${cashFlowData.burnRate.toLocaleString()} per week.`
                  : `There is no burn rate as revenue consistently exceeds expenses.`}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 