"use client";
import { useState } from 'react';
import { mockQuotes, mockProducts, mockCustomers } from '../data/mockData';
import { Plus, FileText, Send, Check, X, Edit, Eye } from 'lucide-react';

export default function Quotes() {
  const [quotes] = useState(mockQuotes);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Quotes</h1>
          <p className="text-gray-600 mt-1">Create and manage customer quotations</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Quote
        </button>
      </div>

      {/* Quotes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quote #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Incoterm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margin
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotes.map((quote) => {
              const customer = mockCustomers.find(c => c.id === quote.customerId);
              return (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{quote.quoteNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-900">{customer?.name}</div>
                    <div className="text-sm text-gray-500">{customer?.country}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {new Date(quote.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                      {quote.incoterm}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                    ${quote.sellingPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${
                      quote.marginPercentage >= 15 ? 'text-green-600' :
                      quote.marginPercentage >= 10 ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {quote.marginPercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <QuoteStatusBadge status={quote.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedQuote(quote)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {quote.status === 'draft' && (
                      <button
                        className="text-green-600 hover:text-green-800"
                        title="Send to Customer"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create Quote Modal */}
      {showCreateModal && (
        <CreateQuoteModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Quote Details Modal */}
      {selectedQuote && (
        <QuoteDetailsModal 
          quote={selectedQuote} 
          onClose={() => setSelectedQuote(null)} 
        />
      )}
    </div>
  );
}

function QuoteStatusBadge({ status }) {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    sent: 'bg-blue-100 text-blue-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-600'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${colors[status]}`}>
      {status}
    </span>
  );
}

function CreateQuoteModal({ onClose }) {
  const [formData, setFormData] = useState({
    customerId: '',
    incoterm: 'CIF',
    destination: '',
    marginPercentage: 12
  });

  const [lineItems, setLineItems] = useState([{ productId: '', quantity: 0 }]);

  const calculateQuote = () => {
    let subtotal = 0;
    let estimatedFreight = 0;
    
    lineItems.forEach(item => {
      const product = mockProducts.find(p => p.id === item.productId);
      if (product) {
        subtotal += product.unitCost * item.quantity;
        estimatedFreight += 80 * item.quantity; // $80 per MT freight estimate
      }
    });

    const estimatedDuty = subtotal * 0.05; // 5% duty
    const estimatedInsurance = subtotal * 0.01; // 1% insurance
    const estimatedOtherCosts = subtotal * 0.02; // 2% other costs
    const totalCost = subtotal + estimatedFreight + estimatedDuty + estimatedInsurance + estimatedOtherCosts;
    const sellingPrice = totalCost * (1 + formData.marginPercentage / 100);

    return {
      subtotal,
      estimatedFreight,
      estimatedDuty,
      estimatedInsurance,
      estimatedOtherCosts,
      totalCost,
      sellingPrice
    };
  };

  const quote = calculateQuote();

  const addLineItem = () => {
    setLineItems([...lineItems, { productId: '', quantity: 0 }]);
  };

  const removeLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index, field, value) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Create New Quote</h2>
          <p className="text-gray-600 mt-1">Enter customer details and products</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select customer...</option>
                {mockCustomers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Incoterm
              </label>
              <select
                value={formData.incoterm}
                onChange={(e) => setFormData({ ...formData, incoterm: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="FOB">FOB - Free On Board</option>
                <option value="CIF">CIF - Cost, Insurance & Freight</option>
                <option value="EXW">EXW - Ex Works</option>
                <option value="DDP">DDP - Delivered Duty Paid</option>
                <option value="CFR">CFR - Cost & Freight</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                placeholder="e.g., Djibouti Port"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Margin (%)
              </label>
              <input
                type="number"
                value={formData.marginPercentage}
                onChange={(e) => setFormData({ ...formData, marginPercentage: parseFloat(e.target.value) })}
                min="0"
                max="100"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Products
              </label>
              <button
                onClick={addLineItem}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Product
              </button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select
                    value={item.productId}
                    onChange={(e) => updateLineItem(index, 'productId', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select product...</option>
                    {mockProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.unitCost}/{product.unit}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    placeholder="Quantity"
                    min="0"
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {lineItems.length > 1 && (
                    <button
                      onClick={() => removeLineItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product Cost:</span>
                <span className="font-medium">${quote.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Freight:</span>
                <span className="font-medium">${quote.estimatedFreight.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Duty:</span>
                <span className="font-medium">${quote.estimatedDuty.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Insurance:</span>
                <span className="font-medium">${quote.estimatedInsurance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Costs:</span>
                <span className="font-medium">${quote.estimatedOtherCosts.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total Cost:</span>
                <span className="font-semibold">${quote.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span className="font-semibold">Margin ({formData.marginPercentage}%):</span>
                <span className="font-semibold">
                  ${(quote.sellingPrice - quote.totalCost).toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Selling Price:</span>
                <span className="text-lg font-bold text-green-600">
                  ${quote.sellingPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Save as Draft
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Quote
          </button>
        </div>
      </div>
    </div>
  );
}

function QuoteDetailsModal({ quote, onClose }) {
  const customer = mockCustomers.find(c => c.id === quote.customerId);
  
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{quote.quoteNumber}</h2>
              <p className="text-gray-600 mt-1">{customer?.name}</p>
            </div>
            <QuoteStatusBadge status={quote.status} />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quote Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Date:</span>
              <div className="font-medium">{new Date(quote.date).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Expiry Date:</span>
              <div className="font-medium">{new Date(quote.expiryDate).toLocaleDateString()}</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Incoterm:</span>
              <div className="font-medium">{quote.incoterm}</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Destination:</span>
              <div className="font-medium">{quote.destination}</div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Products</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Unit Price</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quote.lineItems.map(item => {
                    const product = mockProducts.find(p => p.id === item.productId);
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-2 text-sm">{product?.name}</td>
                        <td className="px-4 py-2 text-sm text-right">{item.quantity} {product?.unit}</td>
                        <td className="px-4 py-2 text-sm text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-2 text-sm text-right font-medium">${item.totalPrice.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Financial Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal (Product Cost):</span>
                <span className="font-medium">${quote.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Freight:</span>
                <span className="font-medium">${quote.estimatedFreight.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Duty:</span>
                <span className="font-medium">${quote.estimatedDuty.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Insurance:</span>
                <span className="font-medium">${quote.estimatedInsurance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Other Costs:</span>
                <span className="font-medium">${quote.estimatedOtherCosts.toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-semibold text-gray-900">Total Cost:</span>
                <span className="font-semibold">${quote.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-blue-600">
                <span className="font-semibold">Profit Margin ({quote.marginPercentage}%):</span>
                <span className="font-semibold">${(quote.sellingPrice - quote.totalCost).toLocaleString()}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Selling Price:</span>
                <span className="text-lg font-bold text-green-600">${quote.sellingPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {quote.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
              <p className="text-gray-600 text-sm">{quote.notes}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          {quote.status === 'approved' && (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Check className="h-4 w-4 mr-2" />
              Convert to Sales Order
            </button>
          )}
          {quote.status === 'draft' && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Send to Customer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
