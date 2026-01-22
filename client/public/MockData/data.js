export const mockUsers = [
  { id: 'u1', name: 'Sarah Johnson', email: 'sarah@ecta.com', role: 'sales' },
  { id: 'u2', name: 'Mike Chen', email: 'mike@ecta.com', role: 'logistics' },
  { id: 'u3', name: 'Rita Patel', email: 'rita@ecta.com', role: 'finance' },
  { id: 'u4', name: 'David Martinez', email: 'david@ecta.com', role: 'management' },
];

export const mockCustomers = [
  {
    id: 'c1',
    name: 'Djibouti Trading Co.',
    country: 'Djibouti',
    email: 'procurement@djiboutitrading.dj',
    phone: '+253 21 35 XX XX',
    paymentTerms: 'Net 30',
    creditLimit: 500000
  },
  {
    id: 'c2',
    name: 'East Africa Imports Ltd',
    country: 'Kenya',
    email: 'orders@eaimports.ke',
    phone: '+254 20 XXX XXXX',
    paymentTerms: 'Net 45',
    creditLimit: 750000
  },
  {
    id: 'c3',
    name: 'Red Sea Logistics',
    country: 'Eritrea',
    email: 'info@redsealogistics.er',
    phone: '+291 1 12 XX XX',
    paymentTerms: 'Net 60',
    creditLimit: 300000
  },
  {
    id: 'c4',
    name: 'Horn Trading Partners',
    country: 'Somalia',
    email: 'trade@hornpartners.so',
    phone: '+252 61 XXX XXXX',
    paymentTerms: 'LC at Sight',
    creditLimit: 600000
  },
  {
    id: 'c5',
    name: 'Gulf Distribution LLC',
    country: 'UAE',
    email: 'purchases@gulfdist.ae',
    phone: '+971 4 XXX XXXX',
    paymentTerms: 'Net 30',
    creditLimit: 1000000
  }
];

export const mockProducts = [
  {
    id: 'p1',
    code: 'RICE-TH-001',
    name: 'Thai Jasmine Rice',
    description: '25% broken, Grade A',
    unitCost: 450,
    unit: 'MT',
    category: 'Grains',
    hsCode: '1006.30'
  },
  {
    id: 'p2',
    code: 'SUGAR-BR-001',
    name: 'Brazilian White Sugar',
    description: 'ICUMSA 45',
    unitCost: 380,
    unit: 'MT',
    category: 'Sugar',
    hsCode: '1701.99'
  },
  {
    id: 'p3',
    code: 'OIL-VEG-001',
    name: 'Vegetable Cooking Oil',
    description: 'Refined Palm Oil, 20L Jerry Cans',
    unitCost: 850,
    unit: 'MT',
    category: 'Oils',
    hsCode: '1511.90'
  },
  {
    id: 'p4',
    code: 'WHEAT-US-001',
    name: 'US Wheat Flour',
    description: 'All-purpose, 50kg bags',
    unitCost: 320,
    unit: 'MT',
    category: 'Grains',
    hsCode: '1101.00'
  },
  {
    id: 'p5',
    code: 'MILK-NZ-001',
    name: 'New Zealand Milk Powder',
    description: 'Full Cream, 25kg bags',
    unitCost: 3200,
    unit: 'MT',
    category: 'Dairy',
    hsCode: '0402.21'
  }
];

export const mockQuotes = [
  {
    id: 'q1',
    quoteNumber: 'QT-2026-001',
    customerId: 'c1',
    date: '2026-01-15',
    expiryDate: '2026-02-15',
    status: 'sent',
    incoterm: 'CIF',
    destination: 'Djibouti Port',
    lineItems: [
      {
        id: 'ql1',
        productId: 'p1',
        quantity: 100,
        unitPrice: 650,
        totalPrice: 65000
      }
    ],
    subtotal: 45000, // Cost
    estimatedFreight: 8000,
    estimatedDuty: 2250,
    estimatedInsurance: 500,
    estimatedOtherCosts: 1250,
    totalCost: 57000,
    marginPercentage: 14,
    sellingPrice: 65000,
    salesPersonId: 'u1',
    notes: 'Customer requested delivery before end of Q1'
  },
  {
    id: 'q2',
    quoteNumber: 'QT-2026-002',
    customerId: 'c2',
    date: '2026-01-18',
    expiryDate: '2026-02-18',
    status: 'approved',
    incoterm: 'FOB',
    destination: 'Mombasa Port',
    lineItems: [
      {
        id: 'ql2',
        productId: 'p2',
        quantity: 200,
        unitPrice: 520,
        totalPrice: 104000
      }
    ],
    subtotal: 76000,
    estimatedFreight: 12000,
    estimatedDuty: 3800,
    estimatedInsurance: 800,
    estimatedOtherCosts: 2400,
    totalCost: 95000,
    marginPercentage: 9.5,
    sellingPrice: 104000,
    salesPersonId: 'u1',
    notes: ''
  },
  {
    id: 'q3',
    quoteNumber: 'QT-2026-003',
    customerId: 'c5',
    date: '2026-01-20',
    expiryDate: '2026-02-20',
    status: 'draft',
    incoterm: 'CIF',
    destination: 'Jebel Ali Port',
    lineItems: [
      {
        id: 'ql3',
        productId: 'p5',
        quantity: 50,
        unitPrice: 4200,
        totalPrice: 210000
      }
    ],
    subtotal: 160000,
    estimatedFreight: 15000,
    estimatedDuty: 8000,
    estimatedInsurance: 2000,
    estimatedOtherCosts: 5000,
    totalCost: 190000,
    marginPercentage: 10.5,
    sellingPrice: 210000,
    salesPersonId: 'u1',
    notes: 'Premium dairy product - handle with care'
  }
];

export const mockSalesOrders = [
  {
    id: 'so1',
    orderNumber: 'SO-2026-001',
    quoteId: 'q2',
    customerId: 'c2',
    date: '2026-01-19',
    status: 'ready_to_ship',
    incoterm: 'FOB',
    destination: 'Mombasa Port',
    totalValue: 104000,
    expectedDeliveryDate: '2026-02-28',
    paymentStatus: 'partial',
    notes: 'Advance payment received - 50%'
  },
  {
    id: 'so2',
    orderNumber: 'SO-2026-002',
    quoteId: 'q1',
    customerId: 'c1',
    date: '2026-01-16',
    status: 'in_production',
    incoterm: 'CIF',
    destination: 'Djibouti Port',
    totalValue: 65000,
    expectedDeliveryDate: '2026-03-15',
    paymentStatus: 'pending',
    notes: 'LC opened'
  }
];

const estimatedCosts1 = {
  freight: 12000,
  duty: 3800,
  insurance: 800,
  localTransport: 1500,
  handling: 600,
  other: 300,
  total: 19000
};

const actualCosts1 = {
  freight: 13200,
  duty: 4100,
  insurance: 850,
  localTransport: 1650,
  handling: 700,
  other: 450,
  total: 20950
};

export const mockShipments = [
  {
    id: 'sh1',
    shipmentNumber: 'SH-2026-001',
    salesOrderId: 'so1',
    customerId: 'c2',
    status: 'in_transit',
    mode: 'sea',
    origin: 'Shanghai Port',
    destination: 'Mombasa Port',
    containerNumber: 'MSCU1234567',
    billOfLadingNumber: 'BL-2026-SH-001',
    bookingDate: '2026-01-20',
    estimatedDepartureDate: '2026-01-25',
    actualDepartureDate: '2026-01-26',
    estimatedArrivalDate: '2026-02-20',
    estimatedCosts: estimatedCosts1,
    actualCosts: actualCosts1,
    hasCommercialInvoice: true,
    hasPackingList: true,
    hasBillOfLading: true,
    notes: 'Container slightly delayed due to port congestion'
  },
  {
    id: 'sh2',
    shipmentNumber: 'SH-2026-002',
    salesOrderId: 'so2',
    customerId: 'c1',
    status: 'pending',
    mode: 'sea',
    origin: 'Bangkok Port',
    destination: 'Djibouti Port',
    bookingDate: '2026-01-22',
    estimatedDepartureDate: '2026-02-05',
    estimatedArrivalDate: '2026-03-05',
    estimatedCosts: {
      freight: 8000,
      duty: 2250,
      insurance: 500,
      localTransport: 800,
      handling: 400,
      other: 200,
      total: 12150
    },
    hasCommercialInvoice: false,
    hasPackingList: false,
    hasBillOfLading: false,
    notes: ''
  },
  {
    id: 'sh3',
    shipmentNumber: 'SH-2025-098',
    salesOrderId: 'so1',
    customerId: 'c4',
    status: 'delivered',
    mode: 'air',
    origin: 'Dubai Airport',
    destination: 'Mogadishu Airport',
    containerNumber: 'AIR-AWB-998877',
    billOfLadingNumber: 'AWB-998877',
    bookingDate: '2025-12-10',
    estimatedDepartureDate: '2025-12-15',
    actualDepartureDate: '2025-12-15',
    estimatedArrivalDate: '2025-12-16',
    actualArrivalDate: '2025-12-16',
    deliveryDate: '2025-12-18',
    estimatedCosts: {
      freight: 25000,
      duty: 5000,
      insurance: 1200,
      localTransport: 2000,
      handling: 800,
      other: 500,
      total: 34500
    },
    actualCosts: {
      freight: 24500,
      duty: 5200,
      insurance: 1200,
      localTransport: 2100,
      handling: 850,
      other: 600,
      total: 34450
    },
    hasCommercialInvoice: true,
    hasPackingList: true,
    hasBillOfLading: true,
    notes: 'Express delivery completed successfully'
  },
  {
    id: 'sh4',
    shipmentNumber: 'SH-2026-003',
    salesOrderId: 'so1',
    customerId: 'c3',
    status: 'delayed',
    mode: 'sea',
    origin: 'Singapore Port',
    destination: 'Massawa Port',
    containerNumber: 'CMAU9876543',
    billOfLadingNumber: 'BL-2026-SH-003',
    bookingDate: '2026-01-10',
    estimatedDepartureDate: '2026-01-15',
    actualDepartureDate: '2026-01-18',
    estimatedArrivalDate: '2026-02-10',
    estimatedCosts: {
      freight: 15000,
      duty: 4500,
      insurance: 1000,
      localTransport: 2500,
      handling: 900,
      other: 600,
      total: 24500
    },
    hasCommercialInvoice: true,
    hasPackingList: true,
    hasBillOfLading: true,
    notes: 'Delayed due to weather conditions in Red Sea'
  }
];

export const mockShipmentCosts = [
  {
    id: 'sc1',
    shipmentId: 'sh1',
    costType: 'freight',
    description: 'Ocean freight - Shanghai to Mombasa',
    estimatedAmount: 12000,
    actualAmount: 13200,
    invoiceNumber: 'INV-FREIGHT-001',
    invoiceDate: '2026-01-26',
    paidDate: '2026-01-28',
    status: 'paid'
  },
  {
    id: 'sc2',
    shipmentId: 'sh1',
    costType: 'duty',
    description: 'Import duty and taxes',
    estimatedAmount: 3800,
    actualAmount: 4100,
    invoiceNumber: 'CUSTOMS-001',
    invoiceDate: '2026-02-18',
    status: 'invoiced'
  },
  {
    id: 'sc3',
    shipmentId: 'sh1',
    costType: 'insurance',
    description: 'Marine cargo insurance',
    estimatedAmount: 800,
    actualAmount: 850,
    invoiceNumber: 'INS-2026-001',
    invoiceDate: '2026-01-25',
    paidDate: '2026-01-25',
    status: 'paid'
  }
];

export const mockInventoryTransactions = [
  {
    id: 'it1',
    productId: 'p2',
    quantity: 200,
    status: 'in_transit',
    referenceType: 'shipment',
    referenceId: 'sh1',
    date: '2026-01-26',
    location: 'Shanghai Port → Mombasa Port',
    notes: 'Container MSCU1234567'
  },
  {
    id: 'it2',
    productId: 'p1',
    quantity: 100,
    status: 'on_order',
    referenceType: 'sales_order',
    referenceId: 'so2',
    date: '2026-01-16',
    location: 'Supplier - Thailand',
    notes: 'Expected production completion: Feb 1'
  },
  {
    id: 'it3',
    productId: 'p3',
    quantity: 150,
    status: 'at_warehouse',
    referenceType: 'shipment',
    referenceId: 'sh3',
    date: '2025-12-18',
    location: 'Warehouse A - Dubai',
    notes: 'Available for allocation'
  }
];
