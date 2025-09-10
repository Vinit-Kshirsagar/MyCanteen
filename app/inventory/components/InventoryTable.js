// components/InventoryTable.js
'use client';

import { useEffect, useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Box,
  DollarSign,
  Eye,
  Loader,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';

export default function InventoryTable({ onEdit, onDelete }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, out, in-stock

  // Fetch inventory items from API
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory-items');
      if (!res.ok) throw new Error('Failed to fetch inventory items');
      const data = await res.json();
      console.log("Fetched inventory:", data);
      setItems(data);
      setFilteredItems(data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter inventory based on search, category, and stock status
  useEffect(() => {
    let filtered = items;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Stock status filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(item => {
        const stock = item.current_stock || 0;
        const minStock = item.min_stock || 10;
        
        switch (stockFilter) {
          case 'out':
            return stock === 0;
          case 'low':
            return stock > 0 && stock <= minStock;
          case 'in-stock':
            return stock > minStock;
          default:
            return true;
        }
      });
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, selectedCategory, stockFilter]);

  // Calculate totals and stats
  const totalItems = filteredItems.length;
  const totalValue = filteredItems.reduce((sum, item) => 
    sum + (item.current_stock || 0) * (item.unit_price || 0), 0
  );
  const lowStockCount = filteredItems.filter(item => {
    const stock = item.current_stock || 0;
    const minStock = item.min_stock || 10;
    return stock > 0 && stock <= minStock;
  }).length;
  const outOfStockCount = filteredItems.filter(item => 
    (item.current_stock || 0) === 0
  ).length;

  const categories = [...new Set(items.map(item => item.category))].filter(Boolean);

  // Get stock status
  const getStockStatus = (currentStock, minStock = 10) => {
    if (currentStock === 0) {
      return { 
        status: 'Out of Stock', 
        color: 'text-red-700', 
        bg: 'bg-red-100', 
        border: 'border-red-200',
        icon: XCircle 
      };
    } else if (currentStock <= minStock) {
      return { 
        status: 'Low Stock', 
        color: 'text-yellow-700', 
        bg: 'bg-yellow-100', 
        border: 'border-yellow-200',
        icon: AlertTriangle 
      };
    } else {
      return { 
        status: 'In Stock', 
        color: 'text-green-700', 
        bg: 'bg-green-100', 
        border: 'border-green-200',
        icon: CheckCircle 
      };
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'food': 'bg-green-100 text-green-800 border-green-200',
      'beverages': 'bg-blue-100 text-blue-800 border-blue-200',
      'supplies': 'bg-purple-100 text-purple-800 border-purple-200',
      'equipment': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'cleaning': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'office': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    const categoryLower = (category || '').toLowerCase();
    return colors[categoryLower] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Handle delete item
  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this inventory item?')) return;
    
    try {
      const res = await fetch(`/api/inventory-items/${itemId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchItems(); // Refresh the list
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <Loader className="h-8 w-8 text-blue-500 animate-spin mr-3" />
          <div>
            <p className="text-gray-600 text-lg font-medium">Loading inventory...</p>
            <p className="text-gray-400 text-sm">Fetching items from database</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
        <div className="flex items-center justify-center text-red-600">
          <AlertCircle className="h-8 w-8 mr-3" />
          <div>
            <p className="text-lg font-medium">Error loading inventory</p>
            <p className="text-sm text-red-500">{error}</p>
            <button 
              onClick={fetchItems}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Value</p>
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Items</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <Box className="h-8 w-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Low Stock</p>
              <p className="text-2xl font-bold">{lowStockCount}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Out of Stock</p>
              <p className="text-2xl font-bold">{outOfStockCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search items, SKU, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Stock Status Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Search: &quot;{searchTerm}&quot;
              <button 
                onClick={() => setSearchTerm('')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Category: {selectedCategory}
              <button 
                onClick={() => setSelectedCategory('all')}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {stockFilter !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Stock: {stockFilter.replace('-', ' ')}
              <button 
                onClick={() => setStockFilter('all')}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or add new inventory items.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const stock = item.current_stock || 0;
                  const minStock = item.min_stock || 10;
                  const unitPrice = item.unit_price || 0;
                  const sellingPrice = item.selling_price || 0;
                  const totalValue = stock * unitPrice;

                  const stockStatus = getStockStatus(stock, minStock);
                  const StatusIcon = stockStatus.icon;

                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Package className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              SKU: {item.sku || 'N/A'}
                            </div>
                            {item.supplier && (
                              <div className="text-xs text-gray-400">
                                Supplier: {item.supplier}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(item.category)}`}>
                          {item.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {stock} {item.unit || 'pcs'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Min: {minStock} {item.unit || 'pcs'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(unitPrice)}
                        </div>
                        {sellingPrice > 0 && (
                          <div className="text-xs text-green-600">
                            Sell: {formatCurrency(sellingPrice)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {formatCurrency(totalValue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${stockStatus.bg} ${stockStatus.color} ${stockStatus.border}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                              title="Edit item"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Summary */}
      {filteredItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Items:</span>
              <span className="font-semibold text-gray-900 ml-2">{filteredItems.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Total Value:</span>
              <span className="font-semibold text-gray-900 ml-2">{formatCurrency(totalValue)}</span>
            </div>
            <div>
              <span className="text-gray-600">Low Stock:</span>
              <span className="font-semibold text-yellow-600 ml-2">{lowStockCount}</span>
            </div>
            <div>
              <span className="text-gray-600">Out of Stock:</span>
              <span className="font-semibold text-red-600 ml-2">{outOfStockCount}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}