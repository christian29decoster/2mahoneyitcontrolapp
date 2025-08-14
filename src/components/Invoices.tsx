import React, { useState } from 'react';
import { CreditCard, FileText, DollarSign, Calendar, Download } from 'lucide-react';

const Invoices: React.FC = () => {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);

  const invoices = [
    {
      id: '1',
      number: 'INV-2024-001',
      client: 'TechCorp Solutions',
      amount: 4500.00,
      status: 'paid',
      dueDate: '2024-01-15',
      issueDate: '2024-01-01',
    },
    {
      id: '2',
      number: 'INV-2024-002',
      client: 'Global Industries',
      amount: 2850.00,
      status: 'pending',
      dueDate: '2024-02-15',
      issueDate: '2024-02-01',
    },
    {
      id: '3',
      number: 'INV-2024-003',
      client: 'StartupXYZ',
      amount: 1500.00,
      status: 'overdue',
      dueDate: '2024-01-31',
      issueDate: '2024-01-15',
    },
    {
      id: '4',
      number: 'INV-2024-004',
      client: 'Enterprise Corp',
      amount: 6720.00,
      status: 'paid',
      dueDate: '2024-02-01',
      issueDate: '2024-01-15',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-mahoney-success';
      case 'pending':
        return 'text-mahoney-warning';
      case 'overdue':
        return 'text-mahoney-danger';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10';
      case 'pending':
        return 'bg-yellow-500/10';
      case 'overdue':
        return 'bg-red-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Unknown';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard size={24} className="text-mahoney-accent" />
        <h2 className="text-xl font-semibold">Invoices & Payments</h2>
      </div>

      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(invoice.status)} ${getStatusColor(invoice.status)}`}>
                    {getStatusText(invoice.status)}
                  </span>
                  <span className="text-sm text-gray-400">{invoice.number}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">{invoice.client}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-gray-500">Due:</span>
                    <span>{invoice.dueDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={14} className="text-gray-500" />
                    <span className="text-gray-500">Issued:</span>
                    <span>{invoice.issueDate}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-mahoney-accent">{formatCurrency(invoice.amount)}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setSelectedInvoice(invoice.id)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FileText size={16} />
                  <span>View</span>
                </button>
                <button className="btn-secondary flex items-center space-x-2">
                  <Download size={16} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Payment Options */}
            {invoice.status !== 'paid' && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-sm font-medium text-gray-400 mb-3">Payment Options</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex items-center justify-center space-x-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <CreditCard size={16} />
                    <span className="text-sm">💳 Card</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <span className="text-sm">🅿 PayPal</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-2 bg-gray-800/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <span className="text-sm">🏦 Transfer</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* PDF Viewer Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-mahoney-card rounded-lg w-full max-w-4xl h-96 relative">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h3 className="font-semibold">Invoice Document</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
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
                  In production, this would show the actual invoice PDF
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices; 