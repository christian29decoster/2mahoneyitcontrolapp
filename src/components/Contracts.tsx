import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle, Eye } from 'lucide-react';

const Contracts: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);

  const contracts = [
    {
      id: '1',
      name: 'Managed IT Services Agreement',
      client: 'TechCorp Solutions',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      value: '$45,000/year',
    },
    {
      id: '2',
      name: 'Network Security Contract',
      client: 'Global Industries',
      status: 'active',
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      value: '$28,500/year',
    },
    {
      id: '3',
      name: 'Cloud Migration Project',
      client: 'StartupXYZ',
      status: 'expiring',
      startDate: '2023-06-01',
      endDate: '2024-12-31',
      value: '$15,000',
    },
    {
      id: '4',
      name: '24/7 Support Agreement',
      client: 'Enterprise Corp',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2025-02-01',
      value: '$67,200/year',
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'active') {
      return <CheckCircle size={16} className="text-mahoney-success" />;
    }
    return <AlertCircle size={16} className="text-mahoney-warning" />;
  };

  const getStatusText = (status: string) => {
    if (status === 'active') {
      return 'Active';
    }
    return 'Expiring Soon';
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') {
      return 'text-mahoney-success';
    }
    return 'text-mahoney-warning';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <FileText size={24} className="text-mahoney-accent" />
        <h2 className="text-xl font-semibold">Contracts</h2>
      </div>

      <div className="space-y-4">
        {contracts.map((contract) => (
          <div key={contract.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(contract.status)}
                  <span className={`text-sm font-medium ${getStatusColor(contract.status)}`}>
                    {getStatusText(contract.status)}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{contract.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{contract.client}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Start:</span>
                    <span className="ml-2">{contract.startDate}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">End:</span>
                    <span className="ml-2">{contract.endDate}</span>
                  </div>
                </div>
                <p className="text-mahoney-accent font-semibold mt-2">{contract.value}</p>
              </div>
              <button
                onClick={() => setSelectedContract(contract.id)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Eye size={16} />
                <span>View</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Viewer Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-mahoney-card rounded-lg w-full max-w-4xl h-96 relative">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="font-semibold">Contract Document</h3>
              <button
                onClick={() => setSelectedContract(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 h-full flex items-center justify-center">
              <div className="text-center">
                <FileText size={48} className="text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">PDF Viewer would be embedded here</p>
                <p className="text-sm text-gray-500 mt-2">
                  In production, this would show the actual contract PDF
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts; 