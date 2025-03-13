import React, { useState } from 'react';
import { Calculator, Save, Trash2 } from 'lucide-react';

interface MetricRecord {
  id: string;
  date: string;
  projectName: string;
  ctr: number;
  retentionRate: number;
  cac: number;
  aov: number;
  conversionRate: number;
  efficiency: number;
  marketEfficiency: number;
  profitEfficiency: number;
}

function App() {
  const [metrics, setMetrics] = useState({
    projectName: '',
    ctr: 0,
    retentionRate: 0,
    cac: 0,
    aov: 0,
    conversionRate: 0
  });
  
  const [records, setRecords] = useState<MetricRecord[]>([]);

  const calculateEfficiencies = () => {
    const { ctr, retentionRate, cac, aov, conversionRate } = metrics;
    
    const marketEfficiency = (ctr / 100) * (retentionRate / 100) * 100;
    const profitEfficiency = cac > 0 
      ? ((aov * (conversionRate / 100) - cac) / cac) * 100
      : 0;
    const overallEfficiency = (marketEfficiency * 0.5 + profitEfficiency * 0.5);

    return {
      marketEfficiency,
      profitEfficiency,
      overallEfficiency
    };
  };

  const handleInputChange = (field: keyof typeof metrics) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'projectName' 
      ? e.target.value 
      : Math.min(Math.max(parseFloat(e.target.value) || 0, 0), field === 'conversionRate' || field === 'ctr' || field === 'retentionRate' ? 100 : 1000000);
    setMetrics(prev => ({ ...prev, [field]: value }));
  };

  const saveRecord = () => {
    if (!metrics.projectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    
    const { marketEfficiency, profitEfficiency, overallEfficiency } = calculateEfficiencies();
    const newRecord: MetricRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...metrics,
      efficiency: overallEfficiency,
      marketEfficiency,
      profitEfficiency
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  const deleteRecord = (id: string, projectName: string) => {
    if (window.confirm(`Are you sure you want to delete the record for "${projectName}"?`)) {
      setRecords(prev => prev.filter(record => record.id !== id));
    }
  };

  const { marketEfficiency, profitEfficiency, overallEfficiency } = calculateEfficiencies();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">Market Efficiency Calculator</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Market Efficiency</h2>
                <p className="text-3xl font-bold">{marketEfficiency.toFixed(2)}%</p>
                <p className="text-sm mt-2 opacity-90">CTR × Retention Rate</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Profit Efficiency</h2>
                <p className="text-3xl font-bold">{profitEfficiency.toFixed(2)}%</p>
                <p className="text-sm mt-2 opacity-90">(AOV × Conv. Rate - CAC) / CAC</p>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg text-white">
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Overall Score</h2>
                <p className="text-3xl font-bold">{overallEfficiency.toFixed(2)}%</p>
                <p className="text-sm mt-2 opacity-90">
                  {overallEfficiency < 0 ? 'Loss' :
                   overallEfficiency < 50 ? 'Needs Improvement' :
                   overallEfficiency < 100 ? 'Good' : 'Excellent'}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              value={metrics.projectName}
              onChange={handleInputChange('projectName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter project name"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">Market Metrics</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Click-Through Rate (%)
                </label>
                <input
                  type="number"
                  value={metrics.ctr}
                  onChange={handleInputChange('ctr')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0-100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Retention Rate (%)
                </label>
                <input
                  type="number"
                  value={metrics.retentionRate}
                  onChange={handleInputChange('retentionRate')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0-100"
                />
              </div>
            </div>
            
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">Financial Metrics</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Acquisition Cost ($)
                </label>
                <input
                  type="number"
                  value={metrics.cac}
                  onChange={handleInputChange('cac')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter CAC"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Order Value ($)
                </label>
                <input
                  type="number"
                  value={metrics.aov}
                  onChange={handleInputChange('aov')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter AOV"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conversion Rate (%)
                </label>
                <input
                  type="number"
                  value={metrics.conversionRate}
                  onChange={handleInputChange('conversionRate')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0-100"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={saveRecord}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              Save Record
            </button>
          </div>
        </div>

        {records.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Historical Records</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Project</th>
                    <th className="px-4 py-3">CTR</th>
                    <th className="px-4 py-3">Retention</th>
                    <th className="px-4 py-3">CAC</th>
                    <th className="px-4 py-3">AOV</th>
                    <th className="px-4 py-3">Conv. Rate</th>
                    <th className="px-4 py-3">Market Eff.</th>
                    <th className="px-4 py-3">Profit Eff.</th>
                    <th className="px-4 py-3">Overall</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(record => (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{record.date}</td>
                      <td className="px-4 py-3">{record.projectName}</td>
                      <td className="px-4 py-3">{record.ctr}%</td>
                      <td className="px-4 py-3">{record.retentionRate}%</td>
                      <td className="px-4 py-3">${record.cac}</td>
                      <td className="px-4 py-3">${record.aov}</td>
                      <td className="px-4 py-3">{record.conversionRate}%</td>
                      <td className="px-4 py-3">{record.marketEfficiency.toFixed(2)}%</td>
                      <td className="px-4 py-3">{record.profitEfficiency.toFixed(2)}%</td>
                      <td className="px-4 py-3">{record.efficiency.toFixed(2)}%</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteRecord(record.id, record.projectName)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;