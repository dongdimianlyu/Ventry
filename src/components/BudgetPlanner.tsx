import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartOptions,
  ChartData
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  color: string;
  notes?: string;
  tags?: string[];
  isFixed?: boolean;
}

interface BudgetTemplate {
  id: string;
  name: string;
  categories: BudgetCategory[];
  description: string;
}

interface BudgetScenario {
  id: string;
  name: string;
  categories: BudgetCategory[];
  description: string;
}

type TimePeriod = 'monthly' | 'quarterly' | 'annual';

interface BudgetPlannerProps {
  businessType: string;
  plan?: string;
}

// Industry-specific budget templates
const budgetTemplates: Record<string, BudgetTemplate> = {
  retail: {
    id: 'retail-template',
    name: 'Retail Business',
    description: 'Balanced budget for retail operations',
    categories: [
      { id: 'rent', name: 'Rent & Utilities', amount: 2500, color: 'rgb(239, 68, 68)', isFixed: true },
      { id: 'inventory', name: 'Inventory', amount: 5000, color: 'rgb(99, 102, 241)' },
      { id: 'staff', name: 'Staff Salaries', amount: 4000, color: 'rgb(34, 197, 94)' },
      { id: 'marketing', name: 'Marketing', amount: 1500, color: 'rgb(249, 115, 22)' },
      { id: 'ecommerce', name: 'E-commerce Platform', amount: 300, color: 'rgb(168, 85, 247)', tags: ['tech'] },
      { id: 'insurance', name: 'Insurance', amount: 500, color: 'rgb(20, 184, 166)', isFixed: true },
      { id: 'misc', name: 'Miscellaneous', amount: 1000, color: 'rgb(234, 179, 8)' }
    ]
  },
  technology: {
    id: 'tech-template',
    name: 'Technology Startup',
    description: 'Budget optimized for tech startups',
    categories: [
      { id: 'salaries', name: 'Developer Salaries', amount: 15000, color: 'rgb(99, 102, 241)' },
      { id: 'cloud', name: 'Cloud Services', amount: 2000, color: 'rgb(34, 197, 94)', tags: ['tech'] },
      { id: 'office', name: 'Office Space', amount: 3000, color: 'rgb(239, 68, 68)', isFixed: true },
      { id: 'marketing', name: 'Marketing & Growth', amount: 5000, color: 'rgb(249, 115, 22)' },
      { id: 'software', name: 'Software Licenses', amount: 1000, color: 'rgb(168, 85, 247)', tags: ['tech'] },
      { id: 'legal', name: 'Legal & Compliance', amount: 1500, color: 'rgb(20, 184, 166)', isFixed: true },
      { id: 'misc', name: 'Miscellaneous', amount: 1000, color: 'rgb(234, 179, 8)' }
    ]
  },
  service: {
    id: 'service-template',
    name: 'Service Business',
    description: 'Budget for service-based businesses',
    categories: [
      { id: 'salaries', name: 'Staff Salaries', amount: 8000, color: 'rgb(99, 102, 241)' },
      { id: 'office', name: 'Office Space', amount: 2000, color: 'rgb(239, 68, 68)', isFixed: true },
      { id: 'marketing', name: 'Marketing', amount: 2500, color: 'rgb(249, 115, 22)' },
      { id: 'equipment', name: 'Equipment', amount: 1000, color: 'rgb(34, 197, 94)' },
      { id: 'software', name: 'Software & Tools', amount: 800, color: 'rgb(168, 85, 247)', tags: ['tech'] },
      { id: 'insurance', name: 'Insurance', amount: 600, color: 'rgb(20, 184, 166)', isFixed: true },
      { id: 'training', name: 'Training & Development', amount: 1000, color: 'rgb(125, 211, 252)' },
      { id: 'misc', name: 'Miscellaneous', amount: 1000, color: 'rgb(234, 179, 8)' }
    ]
  },
  restaurant: {
    id: 'restaurant-template',
    name: 'Restaurant/Food Service',
    description: 'Budget for food service businesses',
    categories: [
      { id: 'rent', name: 'Rent & Utilities', amount: 3500, color: 'rgb(239, 68, 68)', isFixed: true },
      { id: 'food-cost', name: 'Food & Ingredients', amount: 6000, color: 'rgb(99, 102, 241)' },
      { id: 'staff', name: 'Staff Wages', amount: 8000, color: 'rgb(34, 197, 94)' },
      { id: 'marketing', name: 'Marketing', amount: 1500, color: 'rgb(249, 115, 22)' },
      { id: 'equipment', name: 'Equipment Maintenance', amount: 800, color: 'rgb(168, 85, 247)' },
      { id: 'licenses', name: 'Licenses & Permits', amount: 500, color: 'rgb(20, 184, 166)', isFixed: true },
      { id: 'delivery', name: 'Delivery Services', amount: 1200, color: 'rgb(125, 211, 252)' },
      { id: 'misc', name: 'Miscellaneous', amount: 1000, color: 'rgb(234, 179, 8)' }
    ]
  }
};

export default function BudgetPlanner({ businessType, plan }: BudgetPlannerProps) {
  // Default categories as fallback if no templates match
  const defaultCategories: BudgetCategory[] = [
    { id: 'operations', name: 'Operations', amount: 3000, color: 'rgb(99, 102, 241)' },
    { id: 'marketing', name: 'Marketing', amount: 2000, color: 'rgb(34, 197, 94)' },
    { id: 'salaries', name: 'Salaries', amount: 5000, color: 'rgb(239, 68, 68)' },
    { id: 'rent', name: 'Rent & Utilities', amount: 1500, color: 'rgb(249, 115, 22)', isFixed: true },
    { id: 'software', name: 'Software & Tools', amount: 500, color: 'rgb(168, 85, 247)', tags: ['tech'] },
    { id: 'misc', name: 'Miscellaneous', amount: 1000, color: 'rgb(20, 184, 166)' }
  ];
  
  // Find the best matching template for the business type
  const getInitialTemplate = () => {
    if (businessType.toLowerCase().includes('retail') || businessType.toLowerCase().includes('store')) {
      return budgetTemplates.retail;
    } else if (businessType.toLowerCase().includes('tech') || businessType.toLowerCase().includes('software')) {
      return budgetTemplates.technology;
    } else if (businessType.toLowerCase().includes('service')) {
      return budgetTemplates.service;
    } else if (businessType.toLowerCase().includes('restaurant') || businessType.toLowerCase().includes('food')) {
      return budgetTemplates.restaurant;
    } else {
      // Default template if no specific match
      return {
        id: 'custom',
        name: 'Custom Budget',
        description: 'Customized budget for your business',
        categories: defaultCategories
      };
    }
  };

  // State variables
  const [selectedTemplate, setSelectedTemplate] = useState<string>(getInitialTemplate().id);
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(getInitialTemplate().categories);
  const [totalBudget, setTotalBudget] = useState(
    getInitialTemplate().categories.reduce((sum, cat) => sum + cat.amount, 0)
  );
  const [newCategory, setNewCategory] = useState({ name: '', amount: 0, notes: '', tags: '' });
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');
  const [showFixedOnly, setShowFixedOnly] = useState(false);
  const [showChart, setShowChart] = useState<'pie' | 'bar'>('pie');
  const [scenarios, setScenarios] = useState<BudgetScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Add this state variable for editing categories
  const [editedCategory, setEditedCategory] = useState<BudgetCategory | null>(null);
  
  // Time period multipliers for converting between periods
  const periodMultiplier = useMemo(() => {
    return {
      monthly: 1,
      quarterly: 3,
      annual: 12
    };
  }, []);
  
  // Extract potential budget categories from the plan
  useEffect(() => {
    if (plan) {
      try {
        // Look for expense categories in the plan
        const expenseMatch = plan.match(/expenses|costs|spending|budget/gi);
        
        if (expenseMatch) {
          // This is a simple extraction - in a real app, we would use more sophisticated NLP
          const expenseSection = plan.substring(plan.indexOf(expenseMatch[0]), plan.length);
          const lines = expenseSection.split('\n').slice(0, 20); // Look at the next 20 lines
          
          const extractedCategories: { [key: string]: number } = {};
          
          // Look for dollar amounts with category labels
          lines.forEach(line => {
            // Check for patterns like "$5000 for marketing" or "Marketing: $5000"
            const amountWithCategory = line.match(/\$\s*([\d,]+(\.\d{1,2})?)\s*(for|on|to)\s*([a-z\s&]+)/i);
            const categoryWithAmount = line.match(/([a-z\s&]+):\s*\$\s*([\d,]+(\.\d{1,2})?)/i);
            
            if (amountWithCategory) {
              const amount = parseFloat(amountWithCategory[1].replace(/,/g, ''));
              const category = amountWithCategory[4].trim();
              
              if (!extractedCategories[category]) {
                extractedCategories[category] = amount;
              }
            } else if (categoryWithAmount) {
              const amount = parseFloat(categoryWithAmount[2].replace(/,/g, ''));
              const category = categoryWithAmount[1].trim();
              
              if (!extractedCategories[category]) {
                extractedCategories[category] = amount;
              }
            }
          });
          
          // If we found any categories, update our state
          if (Object.keys(extractedCategories).length > 0) {
            const colors = [
              'rgb(99, 102, 241)', 'rgb(34, 197, 94)', 'rgb(239, 68, 68)', 
              'rgb(249, 115, 22)', 'rgb(168, 85, 247)', 'rgb(20, 184, 166)',
              'rgb(234, 179, 8)', 'rgb(125, 211, 252)', 'rgb(244, 114, 182)'
            ];
            
            const extractedCategoriesArray: BudgetCategory[] = Object.entries(extractedCategories).map(
              ([name, amount], index) => ({
                id: name.toLowerCase().replace(/\s/g, '-'),
                name,
                amount,
                color: colors[index % colors.length]
              })
            );
            
            if (extractedCategoriesArray.length > 0) {
              setBudgetCategories(extractedCategoriesArray);
              setTotalBudget(extractedCategoriesArray.reduce((sum, cat) => sum + cat.amount, 0));
              // Create a scenario from the extracted categories
              const extractedScenario: BudgetScenario = {
                id: 'extracted-from-plan',
                name: 'From Business Plan',
                description: 'Budget scenario extracted from your business plan',
                categories: extractedCategoriesArray
              };
              setScenarios([extractedScenario]);
            }
          }
        }
      } catch (error) {
        console.error("Error extracting budget data from plan:", error);
      }
    }
  }, [plan]);

  // Calculate the total budget whenever categories change
  useEffect(() => {
    const total = budgetCategories.reduce((sum, category) => sum + category.amount, 0);
    setTotalBudget(total);
  }, [budgetCategories]);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    // Find the selected template
    let template: BudgetTemplate;
    if (templateId === 'custom' && scenarios.length > 0 && activeScenario) {
      // Use active scenario as template
      const scenario = scenarios.find(s => s.id === activeScenario);
      if (scenario) {
        template = {
          id: 'custom-from-scenario',
          name: `Based on ${scenario.name}`,
          description: 'Custom template based on scenario',
          categories: scenario.categories
        };
      } else {
        template = getInitialTemplate();
      }
    } else {
      // Use predefined template
      const selectedPredefinedTemplate = Object.values(budgetTemplates).find(t => t.id === templateId);
      template = selectedPredefinedTemplate || getInitialTemplate();
    }

    // Update state with the selected template
    setSelectedTemplate(templateId);
    setBudgetCategories(template.categories);
  };

  // Handle adding a new category
  const handleAddCategory = () => {
    if (newCategory.name.trim() === '' || newCategory.amount <= 0) return;
    
    const colors = [
      'rgb(99, 102, 241)', 'rgb(34, 197, 94)', 'rgb(239, 68, 68)', 
      'rgb(249, 115, 22)', 'rgb(168, 85, 247)', 'rgb(20, 184, 166)',
      'rgb(234, 179, 8)', 'rgb(125, 211, 252)', 'rgb(244, 114, 182)'
    ];
    
    const tagArray = newCategory.tags ? 
      newCategory.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '') : 
      [];
    
    const newCategoryObj: BudgetCategory = {
      id: newCategory.name.toLowerCase().replace(/\s/g, '-'),
      name: newCategory.name,
      amount: newCategory.amount,
      color: colors[budgetCategories.length % colors.length],
      notes: newCategory.notes || undefined,
      tags: tagArray.length > 0 ? tagArray : undefined
    };
    
    setBudgetCategories([...budgetCategories, newCategoryObj]);
    setNewCategory({ name: '', amount: 0, notes: '', tags: '' });
  };

  // Handle deleting a category
  const handleDeleteCategory = (id: string) => {
    setBudgetCategories(budgetCategories.filter(category => category.id !== id));
  };

  // Handle updating a category
  const handleUpdateCategory = (
    id: string, 
    fields: {amount?: number, name?: string, notes?: string, isFixed?: boolean, tags?: string[]}
  ) => {
    setBudgetCategories(
      budgetCategories.map(category => 
        category.id === id ? { ...category, ...fields } : category
      )
    );
    setEditingCategory(null);
  };

  // Handle saving current categories as a new scenario
  const handleSaveAsScenario = (name: string, description: string) => {
    const newScenario: BudgetScenario = {
      id: `scenario-${Date.now()}`,
      name,
      description,
      categories: [...budgetCategories]
    };
    
    setScenarios([...scenarios, newScenario]);
    setActiveScenario(newScenario.id);
  };

  // Handle activating a scenario
  const handleActivateScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setBudgetCategories(scenario.categories);
      setActiveScenario(scenarioId);
    }
  };

  // Handle deleting a scenario
  const handleDeleteScenario = (scenarioId: string) => {
    setScenarios(scenarios.filter(s => s.id !== scenarioId));
    if (activeScenario === scenarioId) {
      setActiveScenario(null);
    }
  };

  // Handle time period change
  const handleTimePeriodChange = (newPeriod: TimePeriod) => {
    if (newPeriod === timePeriod) return;
    
    // Convert amounts based on the multiplier
    const convertedCategories = budgetCategories.map(category => {
      const conversionFactor = periodMultiplier[newPeriod] / periodMultiplier[timePeriod];
      return {
        ...category,
        amount: Math.round(category.amount * conversionFactor)
      };
    });
    
    setBudgetCategories(convertedCategories);
    setTimePeriod(newPeriod);
  };

  // Filter categories based on search and fixed/variable filters
  const filteredCategories = useMemo(() => {
    return budgetCategories.filter(category => {
      const matchesSearch = searchTerm === '' || 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.notes && category.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.tags && category.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesFixed = !showFixedOnly || category.isFixed === true;
      
      return matchesSearch && matchesFixed;
    });
  }, [budgetCategories, searchTerm, showFixedOnly]);

  // Calculate stats for insights
  const budgetStats = useMemo(() => {
    const total = budgetCategories.reduce((sum, cat) => sum + cat.amount, 0);
    const fixedCosts = budgetCategories
      .filter(cat => cat.isFixed)
      .reduce((sum, cat) => sum + cat.amount, 0);
    const variableCosts = total - fixedCosts;
    const highestCategory = [...budgetCategories].sort((a, b) => b.amount - a.amount)[0];
    const lowestCategory = [...budgetCategories].sort((a, b) => a.amount - b.amount)[0];
    
    return {
      total,
      fixedCosts,
      variableCosts,
      fixedPercentage: (fixedCosts / total) * 100,
      variablePercentage: (variableCosts / total) * 100,
      highestCategory,
      lowestCategory
    };
  }, [budgetCategories]);

  // Prepare chart data
  const prepareChartData = () => {
    const displayCategories = showFixedOnly 
      ? budgetCategories.filter(cat => cat.isFixed)
      : budgetCategories;
    
    const filteredCategories = searchTerm 
      ? displayCategories.filter(cat => 
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cat.tags && cat.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        )
      : displayCategories;
      
    return {
      labels: filteredCategories.map(cat => cat.name),
    datasets: [
      {
          data: filteredCategories.map(cat => cat.amount * periodMultiplier[timePeriod]),
          backgroundColor: filteredCategories.map(cat => cat.color),
          borderColor: filteredCategories.map(cat => cat.color),
        borderWidth: 1,
        }
      ]
    };
  };
  
  const chartData = prepareChartData();
  
  // Fix tooltip calculations
  const chartOptions: ChartOptions<'pie' | 'doughnut' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            // Handle numeric value safely
            let value = 0;
            if (typeof context.parsed === 'number') {
              value = context.parsed;
            } else if (typeof context.raw === 'number') {
              value = context.raw;
            }
            
            // Calculate percentage safely
            const dataArray = context.dataset.data as number[];
            const total = dataArray.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value * 100) / total).toFixed(1) : '0.0';
            
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  // Bar chart specific options
  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: (value: any) => `$${value.toLocaleString()}`
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  // AI-powered budget insight generator
  const getBudgetInsight = () => {
    // Calculate budget statistics for analysis
    const fixedCosts = budgetCategories.filter(cat => cat.isFixed).reduce((sum, cat) => sum + cat.amount, 0);
    const variableCosts = totalBudget - fixedCosts;
    const fixedPercentage = (fixedCosts / totalBudget) * 100;
    const variablePercentage = 100 - fixedPercentage;
    
    // Find highest and lowest expense categories
    const sortedCategories = [...budgetCategories].sort((a, b) => b.amount - a.amount);
    const highestCategory = sortedCategories[0];
    const lowestCategory = sortedCategories[sortedCategories.length - 1];
    
    // Business type specific insights
    const businessTypeInsight = () => {
      if (businessType.toLowerCase().includes('retail') || businessType.toLowerCase().includes('store')) {
        return `As a retail business, your inventory and staffing allocations are critical. ${
          budgetCategories.find(c => c.name.toLowerCase().includes('inventory') || c.name.toLowerCase().includes('product'))
            ? `Your current inventory allocation is ${
                Math.round(
                  (budgetCategories.find(
                    c => c.name.toLowerCase().includes('inventory') || c.name.toLowerCase().includes('product')
                  )!.amount / totalBudget) * 100
                )}% of budget, ${
                  (budgetCategories.find(
                    c => c.name.toLowerCase().includes('inventory') || c.name.toLowerCase().includes('product')
                  )!.amount / totalBudget) * 100 < 30
                  ? 'which is below the retail industry benchmark of 30-40%.'
                  : 'which aligns with industry benchmarks.'
                }`
            : 'Consider adding a dedicated inventory category to track product costs more effectively.'
        }`;
      } else if (businessType.toLowerCase().includes('tech') || businessType.toLowerCase().includes('software')) {
        return `For technology companies, ${
          budgetCategories.find(c => c.name.toLowerCase().includes('development') || c.name.toLowerCase().includes('engineering'))
            ? `your ${
                budgetCategories.find(
                  c => c.name.toLowerCase().includes('development') || c.name.toLowerCase().includes('engineering')
                )!.name
              } allocation at ${
                Math.round(
                  (budgetCategories.find(
                    c => c.name.toLowerCase().includes('development') || c.name.toLowerCase().includes('engineering')
                  )!.amount / totalBudget) * 100
                )}% ${
                  (budgetCategories.find(
                    c => c.name.toLowerCase().includes('development') || c.name.toLowerCase().includes('engineering')
                  )!.amount / totalBudget) * 100 < 40
                  ? 'could be increased to match the 40-50% industry benchmark for R&D.'
                  : 'appropriately reflects the importance of technical investment.'
                }`
            : 'allocating 40-50% to development and engineering costs is industry standard.'
        }`;
      } else if (businessType.toLowerCase().includes('restaurant') || businessType.toLowerCase().includes('food')) {
        return `In the food service industry, optimal budget allocation typically follows the "30-30-30-10" rule: 30% food costs, 30% labor, 30% overhead, and 10% profit margin. ${
          budgetCategories.find(c => c.name.toLowerCase().includes('food') || c.name.toLowerCase().includes('ingredient'))
            ? `Your food costs are currently at ${
                Math.round(
                  (budgetCategories.find(
                    c => c.name.toLowerCase().includes('food') || c.name.toLowerCase().includes('ingredient')
                  )!.amount / totalBudget) * 100
                )}%, ${
                  Math.abs(
                    (budgetCategories.find(
                      c => c.name.toLowerCase().includes('food') || c.name.toLowerCase().includes('ingredient')
                    )!.amount / totalBudget) * 100 - 30
                  ) > 5
                    ? 'which deviates from the industry benchmark of 30%.'
                    : 'which aligns with industry benchmarks.'
                }`
            : 'but your budget lacks a specific food cost category.'
        }`;
      } else if (businessType.toLowerCase().includes('service')) {
        return `For service businesses, your human capital is your primary asset. ${
          budgetCategories.find(c => c.name.toLowerCase().includes('staff') || c.name.toLowerCase().includes('salaries'))
            ? `Staff costs at ${
                Math.round(
                  (budgetCategories.find(
                    c => c.name.toLowerCase().includes('staff') || c.name.toLowerCase().includes('salaries')
                  )!.amount / totalBudget) * 100
                )}% of budget ${
                  (budgetCategories.find(
                    c => c.name.toLowerCase().includes('staff') || c.name.toLowerCase().includes('salaries')
                  )!.amount / totalBudget) * 100 < 45
                    ? 'are below the 45-60% typical for service businesses.'
                    : 'reflect appropriate investment in your team.'
                }`
            : 'should typically represent 45-60% of your overall budget.'
        }`;
      }
      return `Based on your budget allocation, consider industry benchmarks for your specific business type to optimize performance.`;
    };
    
    // Fixed vs variable cost analysis
    const fixedVariableInsight = () => {
      if (fixedPercentage > 70) {
        return `With ${Math.round(fixedPercentage)}% allocated to fixed costs, your budget has limited flexibility. Consider identifying opportunities to convert fixed expenses to variable when possible to improve adaptability to market changes.`;
      } else if (fixedPercentage < 30) {
        return `Your budget shows excellent flexibility with only ${Math.round(fixedPercentage)}% in fixed costs. This provides significant adaptability to scale operations up or down based on performance.`;
      } else {
        return `Your budget demonstrates a balanced fixed-to-variable cost ratio (${Math.round(fixedPercentage)}:${Math.round(variablePercentage)}), providing both stability and flexibility.`;
      }
    };
    
    // Marketing specific insights
    const marketingInsight = () => {
      const marketingCategory = budgetCategories.find(c => 
        c.name.toLowerCase().includes('market') || 
        c.name.toLowerCase().includes('advertising') ||
        c.name.toLowerCase().includes('promotion')
      );
      
      if (marketingCategory) {
        const marketingPercentage = (marketingCategory.amount / totalBudget) * 100;
        if (marketingPercentage < 10) {
          return `Your marketing allocation (${Math.round(marketingPercentage)}%) is below recommended benchmarks. Consider increasing marketing investment to drive growth.`;
        } else if (marketingPercentage > 25) {
          return `Your substantial marketing investment (${Math.round(marketingPercentage)}%) indicates a growth-focused strategy. Ensure you're tracking ROI carefully.`;
        }
        return `Your marketing budget (${Math.round(marketingPercentage)}%) falls within typical ranges for established businesses.`;
      }
      
      return `Adding a dedicated marketing category is recommended for tracking customer acquisition costs and ROI.`;
    };
    
    // Highest expense insight
    const highestExpenseInsight = () => {
      if (highestCategory) {
        const highestPercentage = (highestCategory.amount / totalBudget) * 100;
        if (highestPercentage > 50) {
          return `Your highest expense (${highestCategory.name}) represents ${Math.round(highestPercentage)}% of your budget, creating potential risk from concentration. Consider strategies to reduce this dependency.`;
        } else if (highestPercentage > 30) {
          return `${highestCategory.name} is your largest expense category at ${Math.round(highestPercentage)}% of budget. Monitor this category closely for optimization opportunities.`;
        }
        return `Your largest expense category (${highestCategory.name}) represents ${Math.round(highestPercentage)}% of your budget, reflecting a well-distributed allocation.`;
      }
      
      return '';
    };
    
    // Combine insights
    let insight = highestExpenseInsight() + ' ' + fixedVariableInsight() + ' ';
    
    // Add industry-specific insight
    insight += businessTypeInsight() + ' ';
    
    // Add marketing insight if it exists
    insight += marketingInsight();
    
    return insight;
  };

  // Start editing a category
  const startEditing = (categoryId: string) => {
    const category = budgetCategories.find(cat => cat.id === categoryId);
    if (category) {
      setEditingCategory(categoryId);
      setEditedCategory({...category});
    }
  };

  // Save edited category
  const saveCategory = () => {
    if (editingCategory && editedCategory) {
      handleUpdateCategory(editingCategory, {
        name: editedCategory.name,
        amount: editedCategory.amount,
        notes: editedCategory.notes,
        isFixed: editedCategory.isFixed,
        tags: editedCategory.tags
      });
      setEditingCategory(null);
      setEditedCategory(null);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 rounded-xl border border-gray-700/40 shadow-2xl overflow-hidden">
      {/* Header with summary statistics */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700/40">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Strategic Budget Allocation
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {timePeriod === 'monthly' ? 'Monthly' : timePeriod === 'quarterly' ? 'Quarterly' : 'Annual'} budget: 
              <span className="text-white font-semibold ml-1">${(totalBudget * periodMultiplier[timePeriod]).toLocaleString()}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="bg-gray-800/80 rounded-lg px-4 py-2 border border-gray-700/50">
              <p className="text-xs text-gray-400">Categories</p>
              <p className="text-lg font-semibold text-white">{budgetCategories.length}</p>
            </div>
            
            <div className="bg-gray-800/80 rounded-lg px-4 py-2 border border-gray-700/50">
              <p className="text-xs text-gray-400">Fixed Costs</p>
              <p className="text-lg font-semibold text-white">
                {Math.round(budgetCategories.filter(c => c.isFixed).reduce((sum, cat) => sum + cat.amount, 0) / totalBudget * 100)}%
              </p>
            </div>
            
            <div className="bg-gray-800/80 rounded-lg px-4 py-2 border border-gray-700/50">
              <p className="text-xs text-gray-400">Scenarios</p>
              <p className="text-lg font-semibold text-white">{scenarios.length}</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white py-2 px-4 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              {showAdvancedOptions ? 'Hide Options' : 'Advanced Options'}
            </motion.button>
          </div>
        </div>
        
        {/* Advanced options section */}
        <AnimatePresence>
          {showAdvancedOptions && (
    <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Budget Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => handleTemplateChange(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.entries(budgetTemplates).map(([key, template]) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                    {scenarios.map(scenario => (
                      <option key={scenario.id} value={scenario.id}>
                        {scenario.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Time Period</label>
                  <div className="flex bg-gray-800 rounded-lg border border-gray-700 p-1">
            <button
                      onClick={() => setTimePeriod('monthly')}
                      className={`flex-1 px-3 py-1.5 text-sm rounded-md ${
                timePeriod === 'monthly' 
                          ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
                      onClick={() => setTimePeriod('quarterly')}
                      className={`flex-1 px-3 py-1.5 text-sm rounded-md ${
                timePeriod === 'quarterly' 
                          ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Quarterly
            </button>
            <button
                      onClick={() => setTimePeriod('annual')}
                      className={`flex-1 px-3 py-1.5 text-sm rounded-md ${
                timePeriod === 'annual' 
                          ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Annual
            </button>
                  </div>
          </div>
          
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Chart Type</label>
                  <div className="flex bg-gray-800 rounded-lg border border-gray-700 p-1">
            <button
              onClick={() => setShowChart('pie')}
                      className={`flex-1 px-4 py-1.5 text-sm rounded-md flex items-center justify-center ${
                showChart === 'pie' 
                          ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        <path d="M12 2V12L21.2 17.2C22.1 14.1 21.4 10.7 19.1 8.1 16.8 5.5 13.6 4.2 10.5 4.5L12 2z"/>
              </svg>
                      Pie
            </button>
            <button
              onClick={() => setShowChart('bar')}
                      className={`flex-1 px-4 py-1.5 text-sm rounded-md flex items-center justify-center ${
                showChart === 'bar' 
                          ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/>
              </svg>
                      Bar
            </button>
          </div>
        </div>
      </div>
            </motion.div>
          )}
        </AnimatePresence>
            </div>
            
      {/* Main content continues... */}
      
      {/* Main content area */}
      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart section */}
        <div className="lg:col-span-5 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            Budget Allocation Visualization
          </h3>
          
          {/* Budget Chart */}
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-6 shadow-lg border border-gray-700/40">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-white">Budget Visualization</h3>
              <div className="flex space-x-3">
                  <button
                  onClick={() => setShowChart('pie')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    showChart === 'pie' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Pie Chart
                          </button>
                          <button
                  onClick={() => setShowChart('bar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    showChart === 'bar' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Bar Chart
                          </button>
                        </div>
                      </div>
            
            <div className="h-64">
              {showChart === 'pie' ? (
                <Doughnut 
                  data={chartData} 
                  options={chartOptions} 
                />
              ) : (
                <Bar 
                  data={chartData} 
                  options={barOptions as ChartOptions<'bar'>} 
                />
                )}
              </div>
            
            <div className="mt-4 text-center text-gray-400 text-sm">
              Total Budget: <span className="text-white font-semibold">${(totalBudget * periodMultiplier[timePeriod]).toLocaleString()}</span> {timePeriod}
              </div>
            </div>
          </div>
          
        {/* Budget categories section */}
        <div className="lg:col-span-7 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-5 border border-gray-700/50 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg font-semibold flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
                  </svg>
              Budget Allocation Details
            </h3>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-800 border border-gray-700 rounded-lg py-1.5 pl-8 pr-3 text-sm text-white w-48 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button 
                onClick={() => setShowFixedOnly(!showFixedOnly)}
                className={`bg-gray-800 border ${showFixedOnly ? 'border-blue-500 text-blue-400' : 'border-gray-700 text-gray-400'} rounded-lg p-1.5 hover:bg-gray-700 transition-colors`}
                title="Show fixed costs only"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </button>
              </div>
            </div>
            
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((category) => (
                <div 
                  key={category.id} 
                  className={`bg-gray-800/50 rounded-lg border ${editingCategory === category.id ? 'border-blue-500' : 'border-gray-700/40'} overflow-hidden transition-all`}
                >
                  {editingCategory === category.id ? (
                    <div className="p-4">
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-5">
                          <label className="text-xs text-gray-400 mb-1 block">Category Name</label>
                <input
                            type="text"
                            value={editedCategory?.name || ''}
                            onChange={(e) => {
                              if (editedCategory) {
                                setEditedCategory({
                                  ...editedCategory,
                                  name: e.target.value
                                });
                              }
                            }}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                          />
            </div>
                        <div className="col-span-3">
                          <label className="text-xs text-gray-400 mb-1 block">Amount</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-400 sm:text-sm">$</span>
          </div>
                            <input
                              type="number"
                              value={editedCategory?.amount || 0}
                              onChange={(e) => {
                                if (editedCategory) {
                                  setEditedCategory({
                                    ...editedCategory,
                                    amount: Number(e.target.value)
                                  });
                                }
                              }}
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 pl-7 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                            />
          </div>
            </div>
                        <div className="col-span-2">
                          <label className="text-xs text-gray-400 mb-1 block">Color</label>
                          <input
                            type="color"
                            value={editedCategory?.color || '#ffffff'}
                            onChange={(e) => {
                              if (editedCategory) {
                                setEditedCategory({
                                  ...editedCategory,
                                  color: e.target.value
                                });
                              }
                            }}
                            className="w-full h-9 bg-gray-700 border border-gray-600 rounded-lg p-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
            </div>
                        <div className="col-span-2">
                          <label className="text-xs text-gray-400 mb-1 block">Fixed Cost</label>
                          <div className="h-9 flex items-center">
                            <input
                              type="checkbox"
                              checked={editedCategory?.isFixed || false}
                              onChange={(e) => {
                                if (editedCategory) {
                                  setEditedCategory({
                                    ...editedCategory,
                                    isFixed: e.target.checked
                                  });
                                }
                              }}
                              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-300">Fixed</span>
          </div>
        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="px-3 py-1.5 bg-gray-700 text-gray-300 text-sm rounded-lg hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveCategory()}
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center p-4">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                      <div className="flex-1">
                      <div className="flex items-center">
                          <h4 className="text-white font-medium">
                            {category.name}
                        {category.isFixed && (
                              <span className="ml-2 bg-blue-900/40 text-blue-400 text-xs px-2 py-0.5 rounded">
                            Fixed
                          </span>
                        )}
                          </h4>
                      </div>
                      {category.notes && (
                          <p className="text-xs text-gray-400 mt-1">{category.notes}</p>
                      )}
                    </div>
                      <div className="text-right">
                        <p className="text-white font-medium">${category.amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">
                          {Math.round((category.amount / totalBudget) * 100)}% of budget
                        </p>
                </div>
                      <div className="ml-4 flex space-x-1">
                        <button
                          onClick={() => startEditing(category.id)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                      </div>
                  </div>
                )}
              </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No budget categories found</p>
                <p className="text-sm mt-1">Add a category to get started</p>
              </div>
            )}
          </div>
          
          {/* Add new category form */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700/40 p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Add New Budget Category</h4>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-5">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 sm:text-sm">$</span>
                  </div>
              <input
                type="number"
                placeholder="Amount"
                value={newCategory.amount || ''}
                    onChange={(e) => setNewCategory({...newCategory, amount: Number(e.target.value)})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 pl-7 text-sm text-white focus:ring-blue-500 focus:border-blue-500"
              />
              </div>
              </div>
              <div className="col-span-4">
              <button
                onClick={handleAddCategory}
                  disabled={!newCategory.name || !newCategory.amount}
                  className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    !newCategory.name || !newCategory.amount
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  }`}
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
          </div>
          
      {/* Bottom action buttons */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-t border-gray-700/40 flex justify-between">
        <div className="flex space-x-3">
          <button
            onClick={() => {
              const name = prompt("Enter scenario name");
              const description = prompt("Enter scenario description");
              if (name && description) handleSaveAsScenario(name, description);
            }}
            className="bg-gray-700/70 text-gray-200 py-2 px-4 rounded-lg text-sm font-medium border border-gray-600/50 shadow-sm hover:bg-gray-600/70 transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
            Save as Scenario
          </button>
          <button
            onClick={() => {
              if(confirm("Reset budget to template defaults?")) handleTemplateChange(selectedTemplate);
            }}
            className="bg-gray-700/70 text-gray-200 py-2 px-4 rounded-lg text-sm font-medium border border-gray-600/50 shadow-sm hover:bg-gray-600/70 transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Budget
          </button>
          </div>
          
        <div className="flex space-x-3">
          <button
            onClick={() => {
              const csv = [
                ['Category', 'Amount', 'Percentage'],
                ...budgetCategories.map(cat => [
                  cat.name,
                  cat.amount,
                  ((cat.amount / totalBudget) * 100).toFixed(2) + '%'
                ])
              ].map(row => row.join(',')).join('\n');
              
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'budget_export.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className="bg-gray-700/70 text-gray-200 py-2 px-4 rounded-lg text-sm font-medium border border-gray-600/50 shadow-sm hover:bg-gray-600/70 transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Budget
          </button>
          <button
            onClick={() => {
              localStorage.setItem('savedBudget', JSON.stringify(budgetCategories));
              alert('Budget saved successfully!');
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-5 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Budget Plan
          </button>
          </div>
        </div>
      </div>
  );
} 