"use client";
import { useState } from 'react';
import { getAllShipmentsWithDetails } from '../data/mockData';
import { 
  Ship, 
  MapPin, 
  Calendar, 
  FileText, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package
} from 'lucide-react';

export default function Shipments() {
  const [shipments] = useState(getAllShipmentsWithDetails());
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredShipments = filterStatus === 'all' 
    ? shipments 
    : shipments.filter(s => s.status === filterStatus);

  const statusCounts = {
    all: shipments.length,
    pending: shipments.filter(s => s.status === 'pending').length,
    in_transit: shipments.filter(s => s.status === 'in_transit').length,
    at_port: shipments.filter(s => s.status === 'at_port').length,
    customs_clearance: shipments.filter(s => s.status === 'customs_clearance').length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    delayed: shipments.filter(s => s.status === 'delayed').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Shipments</h1>
        <p className="text-gray-600 mt-1">Track and manage all shipments</p>
      </div>

      {/* Status Filters */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
        <FilterButton
          label="All"
          count={statusCounts.all}
          active={filterStatus === 'all'}
          onClick={() => setFilterStatus('all')}
        />
        <FilterButton
          label="Pending"
          count={statusCounts.pending}
          active={filterStatus === 'pending'}
          onClick={() => setFilterStatus('pending')}
          color="gray"
        />
        <FilterButton
          label="In Transit"
          count={statusCounts.in_transit}
          active={filterStatus === 'in_transit'}
          onClick={() => setFilterStatus('in_transit')}
          color="blue"
        />
        <FilterButton
          label="At Port"
          count={statusCounts.at_port}
          active={filterStatus === 'at_port'}
          onClick={() => setFilterStatus('at_port')}
          color="indigo"
        />
        <FilterButton
          label="Customs"
          count={statusCounts.customs_clearance}
          active={filterStatus === 'customs_clearance'}
          onClick={() => setFilterStatus('customs_clearance')}
          color="purple"
        />
        <FilterButton
          label="Delivered"
          count={statusCounts.delivered}
          active={filterStatus === 'delivered'}
          onClick={() => setFilterStatus('delivered')}
          color="green"
        />
        <FilterButton
          label="Delayed"
          count={statusCounts.delayed}
          active={filterStatus === 'delayed'}
          onClick={() => setFilterStatus('delayed')}
          color="red"
        />
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Shipment
              </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Customer
              </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Route
              </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Mode
              </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                ETA
              </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Status
              </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredShipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{shipment.shipmentNumber}</div>
                  {shipment.containerNumber && (
                    <div className="text-sm text-gray-500">{shipment.containerNumber}</div>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <div className="text-gray-900">{shipment.customer?.name}</div>
                  <div className="text-sm text-gray-500">{shipment.customer?.country}</div>
                </td>
                <td className="px-4 sm:px-6 py-3">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-gray-900">{shipment.origin}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="mr-1">→</span>
                    <span>{shipment.destination}</span>
                  </div>
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <ShipmentModeBadge mode={shipment.mode} />
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                  {new Date(shipment.estimatedArrivalDate).toLocaleDateString()}
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                  <ShipmentStatusBadge status={shipment.status} />
                </td>
                <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedShipment(shipment)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>

      {/* Shipment Details Modal */}
      {selectedShipment && (
        <ShipmentDetailsModal
          shipment={selectedShipment}
          onClose={() => setSelectedShipment(null)}
        />
      )}
    </div>
  );
}

function FilterButton({ 
  label, 
  count, 
  active, 
  onClick, 
  color = 'blue' 
}) {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-50 text-blue-700',
    gray: 'border-gray-500 bg-gray-50 text-gray-700',
    indigo: 'border-indigo-500 bg-indigo-50 text-indigo-700',
    purple: 'border-purple-500 bg-purple-50 text-purple-700',
    green: 'border-green-500 bg-green-50 text-green-700',
    red: 'border-red-500 bg-red-50 text-red-700',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border-2 transition-all whitespace-nowrap ${
        active
          ? colorClasses[color]
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
      }`}
    >
      {label} <span className="font-semibold">({count})</span>
    </button>
  );
}

function ShipmentStatusBadge({ status }) {
  const configs = {
    pending: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Pending' },
    in_transit: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Transit' },
    at_port: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'At Port' },
    customs_clearance: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Customs' },
    cleared: { bg: 'bg-teal-100', text: 'text-teal-800', label: 'Cleared' },
    out_for_delivery: { bg: 'bg-green-100', text: 'text-green-800', label: 'Out for Delivery' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', label: 'Delivered' },
    delayed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Delayed' }
  };

  const config = configs[status] || configs.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}

function ShipmentModeBadge({ mode }) {
  const icons = {
    sea: <Ship className="h-4 w-4" />,
    air: <Package className="h-4 w-4" />,
    land: <Package className="h-4 w-4" />
  };

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
      {icons[mode]}
      <span className="ml-1">{mode}</span>
    </span>
  );
}

function ShipmentDetailsModal({ 
  shipment, 
  onClose 
}) {
  const [activeTab, setActiveTab] = useState('overview');

  const generateDocument = (type) => {
    alert(`Generating ${type}... (Demo - would download PDF in production)`);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{shipment.shipmentNumber}</h2>
              <p className="text-gray-600 mt-1">{shipment.customer?.name}</p>
            </div>
            <ShipmentStatusBadge status={shipment.status} />
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex px-6">
            <TabButton label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <TabButton label="Timeline" active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} />
            <TabButton label="Costs" active={activeTab === 'costs'} onClick={() => setActiveTab('costs')} />
            <TabButton label="Documents" active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} />
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Route Information */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  Route Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Origin:</span>
                      <div className="font-medium">{shipment.origin}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Destination:</span>
                      <div className="font-medium">{shipment.destination}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Mode:</span>
                      <div className="font-medium capitalize">{shipment.mode}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Container/AWB:</span>
                      <div className="font-medium">{shipment.containerNumber || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales Order Info */}
              {shipment.salesOrder && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Sales Order</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Order Number:</span>
                        <div className="font-medium">{shipment.salesOrder.orderNumber}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Order Value:</span>
                        <div className="font-medium">${shipment.salesOrder.totalValue.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Incoterm:</span>
                        <div className="font-medium">{shipment.salesOrder.incoterm}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Payment Status:</span>
                        <div className="font-medium capitalize">{shipment.salesOrder.paymentStatus}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  Key Dates
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Booking Date:</span>
                      <div className="font-medium">{new Date(shipment.bookingDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Est. Departure:</span>
                      <div className="font-medium">{new Date(shipment.estimatedDepartureDate).toLocaleDateString()}</div>
                    </div>
                    {shipment.actualDepartureDate && (
                      <div>
                        <span className="text-gray-600">Actual Departure:</span>
                        <div className="font-medium">{new Date(shipment.actualDepartureDate).toLocaleDateString()}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Est. Arrival:</span>
                      <div className="font-medium">{new Date(shipment.estimatedArrivalDate).toLocaleDateString()}</div>
                    </div>
                    {shipment.actualArrivalDate && (
                      <div>
                        <span className="text-gray-600">Actual Arrival:</span>
                        <div className="font-medium">{new Date(shipment.actualArrivalDate).toLocaleDateString()}</div>
                      </div>
                    )}
                    {shipment.deliveryDate && (
                      <div>
                        <span className="text-gray-600">Delivery Date:</span>
                        <div className="font-medium text-green-600">{new Date(shipment.deliveryDate).toLocaleDateString()}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {shipment.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">{shipment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <TimelineEvent
                date={shipment.bookingDate}
                title="Shipment Booked"
                description="Shipment created and booked with carrier"
                status="completed"
              />
              {shipment.actualDepartureDate && (
                <TimelineEvent
                  date={shipment.actualDepartureDate}
                  title="Departed from Origin"
                  description={`Left ${shipment.origin}`}
                  status="completed"
                />
              )}
              {shipment.status === 'in_transit' && (
                <TimelineEvent
                  date={new Date().toISOString()}
                  title="In Transit"
                  description="Shipment is currently in transit"
                  status="current"
                />
              )}
              {shipment.status === 'at_port' && (
                <TimelineEvent
                  date={new Date().toISOString()}
                  title="Arrived at Port"
                  description={`At ${shipment.destination}`}
                  status="current"
                />
              )}
              {shipment.actualArrivalDate && (
                <TimelineEvent
                  date={shipment.actualArrivalDate}
                  title="Arrived at Destination"
                  description={`Reached ${shipment.destination}`}
                  status="completed"
                />
              )}
              {shipment.deliveryDate ? (
                <TimelineEvent
                  date={shipment.deliveryDate}
                  title="Delivered"
                  description="Shipment delivered to customer"
                  status="completed"
                />
              ) : (
                <TimelineEvent
                  date={shipment.estimatedArrivalDate}
                  title="Expected Delivery"
                  description="Estimated delivery date"
                  status="upcoming"
                />
              )}
            </div>
          )}

          {activeTab === 'costs' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Cost Breakdown</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className='border border-1 border-gray-300 p-3'>
                    <h4 className="text-sm font-medium text-gray-700 text-center mb-3">Estimated Costs</h4>
                    <div className="space-y-2 text-sm">
                      <CostRow label="Freight" amount={shipment.estimatedCosts.freight} />
                      <CostRow label="Duty" amount={shipment.estimatedCosts.duty} />
                      <CostRow label="Insurance" amount={shipment.estimatedCosts.insurance} />
                      <CostRow label="Local Transport" amount={shipment.estimatedCosts.localTransport} />
                      <CostRow label="Handling" amount={shipment.estimatedCosts.handling} />
                      <CostRow label="Other" amount={shipment.estimatedCosts.other} />
                      <div className="border-t pt-2">
                        <CostRow label="Total" amount={shipment.estimatedCosts.total} bold />
                      </div>
                    </div>
                  </div>

                  {shipment.actualCosts && (
                    <div className='border border-1 border-gray-300 p-3'>
                      <h4 className="text-sm font-medium text-gray-700 text-center mb-3">Actual Costs</h4>
                      <div className="space-y-2 text-sm">
                        <CostRow label="Freight" amount={shipment.actualCosts.freight} variance={shipment.actualCosts.freight - shipment.estimatedCosts.freight} />
                        <CostRow label="Duty" amount={shipment.actualCosts.duty} variance={shipment.actualCosts.duty - shipment.estimatedCosts.duty} />
                        <CostRow label="Insurance" amount={shipment.actualCosts.insurance} variance={shipment.actualCosts.insurance - shipment.estimatedCosts.insurance} />
                        <CostRow label="Local Transport" amount={shipment.actualCosts.localTransport} variance={shipment.actualCosts.localTransport - shipment.estimatedCosts.localTransport} />
                        <CostRow label="Handling" amount={shipment.actualCosts.handling} variance={shipment.actualCosts.handling - shipment.estimatedCosts.handling} />
                        <CostRow label="Other" amount={shipment.actualCosts.other} variance={shipment.actualCosts.other - shipment.estimatedCosts.other} />
                        <div className="border-t pt-2">
                          <CostRow label="Total" amount={shipment.actualCosts.total} variance={shipment.actualCosts.total - shipment.estimatedCosts.total} bold />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {shipment.salesOrder && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Profitability Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Selling Price:</span>
                      <span className="font-semibold text-gray-900">${shipment.salesOrder.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Costs:</span>
                      <span className="font-semibold text-gray-900">
                        ${(shipment.actualCosts?.total || shipment.estimatedCosts.total).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Net Profit:</span>
                      <span className="font-bold text-green-600">
                        ${(shipment.salesOrder.totalValue - (shipment.actualCosts?.total || shipment.estimatedCosts.total)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit Margin:</span>
                      <span className="font-semibold text-blue-600">
                        {((shipment.salesOrder.totalValue - (shipment.actualCosts?.total || shipment.estimatedCosts.total)) / shipment.salesOrder.totalValue * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <DocumentCard
                title="Commercial Invoice"
                description="Invoice for customs clearance"
                available={shipment.hasCommercialInvoice}
                onGenerate={() => generateDocument('Commercial Invoice')}
              />
              <DocumentCard
                title="Packing List"
                description="Detailed list of packed items"
                available={shipment.hasPackingList}
                onGenerate={() => generateDocument('Packing List')}
              />
              <DocumentCard
                title="Bill of Lading"
                description="Carrier's receipt and contract"
                available={shipment.hasBillOfLading}
                onGenerate={() => generateDocument('Bill of Lading')}
                blNumber={shipment.billOfLadingNumber}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
          {shipment.status !== 'delivered' && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  );
}

function TimelineEvent({ 
  date, 
  title, 
  description, 
  status 
}) {
  const iconClasses = {
    completed: 'bg-green-500 text-white',
    current: 'bg-blue-500 text-white',
    upcoming: 'bg-gray-300 text-gray-600'
  };

  const Icon = status === 'completed' ? CheckCircle : status === 'current' ? Clock : Calendar;

  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconClasses[status]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <span className="text-sm text-gray-500">{new Date(date).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

function CostRow({ 
  label, 
  amount, 
  variance, 
  bold = false 
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-gray-600 ${bold ? 'font-semibold' : ''}`}>{label}:</span>
      <div className="flex items-center">
        <span className={`${bold ? 'font-semibold' : ''} text-gray-900`}>
          ${amount.toLocaleString()}
        </span>
        {variance !== undefined && variance !== 0 && (
          <span className={`ml-2 text-xs ${variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            ({variance > 0 ? '+' : ''}{variance.toLocaleString()})
          </span>
        )}
      </div>
    </div>
  );
}

function DocumentCard({ 
  title, 
  description, 
  available, 
  onGenerate,
  blNumber 
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
          {blNumber && (
            <p className="text-xs text-gray-500 mt-1">BL#: {blNumber}</p>
          )}
        </div>
      </div>
      <div>
        {available ? (
          <button
            onClick={onGenerate}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
        ) : (
          <button
            onClick={onGenerate}
            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate
          </button>
        )}
      </div>
    </div>
  );
}
