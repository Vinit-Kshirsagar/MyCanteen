// app/inventory/components/SalesTable.js
'use client';
import { useEffect, useState, useCallback } from 'react';
import {
 ShoppingCart, Calendar, Tag, Trash2, Filter, TrendingUp, Search,
 Download, Plus, Eye, Loader, AlertCircle, DollarSign, Package,
 BarChart3, RefreshCw, X
} from 'lucide-react';


export default function SalesTable({ onAdd, refreshTrigger }) {
 const [sales, setSales] = useState([]);
 const [filteredSales, setFilteredSales] = useState([]);
 const [loading, setLoading] = useState(true);
 const [stats, setStats] = useState({
   totalSales: 0,
   totalRevenue: 0,
   totalItems: 0,
   averageSale: 0
 });


 const [filters, setFilters] = useState({
   dateFrom: '',
   dateTo: '',
   category: '',
   search: ''
 });
  const [showFilters, setShowFilters] = useState(false);
 const [categories, setCategories] = useState([]);
 const [message, setMessage] = useState({ type: '', text: '' });


 // ✅ useCallback to stabilize reference
 const fetchSales = useCallback(async () => {
   setLoading(true);
   try {
     const params = new URLSearchParams();
     if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
     if (filters.dateTo) params.append('dateTo', filters.dateTo);
     if (filters.category) params.append('category', filters.category);


     const response = await fetch(`/api/sales?${params}`);
     if (response.ok) {
       const data = await response.json();
       setSales(data.sales || []);
       setStats(data.stats || { totalSales: 0, totalRevenue: 0, totalItems: 0, averageSale: 0 });
      
       // Extract unique categories
       const uniqueCategories = [...new Set(data.sales?.map(sale => sale.item?.category).filter(Boolean) || [])];
       setCategories(uniqueCategories);
     } else {
       console.error('Failed to fetch sales');
       setMessage({ type: 'error', text: 'Failed to load sales data' });
     }
   } catch (error) {
     console.error('Error fetching sales:', error);
     setMessage({ type: 'error', text: 'Network error occurred' });
   } finally {
     setLoading(false);
   }
 }, [filters]);


 // ✅ useCallback for filtering
 const applyFilters = useCallback(() => {
   let filtered = sales;


   if (filters.search) {
     const searchTerm = filters.search.toLowerCase();
     filtered = filtered.filter(sale =>
       sale.item?.name?.toLowerCase().includes(searchTerm) ||
       sale.item?.category?.toLowerCase().includes(searchTerm)
     );
   }


   setFilteredSales(filtered);
  
   const filteredStats = filtered.reduce((acc, sale) => {
     acc.totalSales += 1;
     acc.totalRevenue += parseFloat(sale.total || 0);
     acc.totalItems += sale.quantity;
     return acc;
   }, { totalSales: 0, totalRevenue: 0, totalItems: 0 });
  
   filteredStats.averageSale = filteredStats.totalSales > 0
     ? filteredStats.totalRevenue / filteredStats.totalSales
     : 0;


   if (filters.search || filters.category) {
     setStats(filteredStats);
   }
 }, [sales, filters]);


 // ✅ Effects now reference stable callbacks
 useEffect(() => {
   fetchSales();
 }, [fetchSales, refreshTrigger]);


 useEffect(() => {
   applyFilters();
 }, [applyFilters]);


 const handleFilterChange = (key, value) => {
   setFilters(prev => ({ ...prev, [key]: value }));
 };


 const clearFilters = () => {
   setFilters({
     dateFrom: '',
     dateTo: '',
     category: '',
     search: ''
   });
   fetchSales();
 };


 const deleteSale = async (saleId) => {
   if (!confirm('Are you sure you want to delete this sale? This will restore the stock.')) {
     return;
   }


   try {
     const response = await fetch(`/api/sales?id=${saleId}`, {
       method: 'DELETE'
     });


     if (response.ok) {
       setMessage({ type: 'success', text: 'Sale deleted and stock restored' });
       fetchSales();
     } else {
       const error = await response.json();
       setMessage({ type: 'error', text: error.error || 'Failed to delete sale' });
     }
   } catch (error) {
     setMessage({ type: 'error', text: 'Network error occurred' });
   }
 };


 const exportToCSV = () => {
   const csvData = filteredSales.map(sale => ({
     'Date': new Date(sale.sold_at).toLocaleDateString(),
     'Time': new Date(sale.sold_at).toLocaleTimeString(),
     'Item': sale.item?.name || 'Unknown',
     'Category': sale.item?.category || 'N/A',
     'Quantity': sale.quantity,
     'Unit Price': `₹${sale.unit_price}`,
     'Total': `₹${sale.total}`
   }));


   const headers = Object.keys(csvData[0] || {});
   const csvContent = [
     headers.join(','),
     ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
   ].join('\n');


   const blob = new Blob([csvContent], { type: 'text/csv' });
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement('a');
   a.href = url;
   a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
   a.click();
   window.URL.revokeObjectURL(url);
 };


 const formatCurrency = (amount) => {
   return new Intl.NumberFormat('en-IN', {
     style: 'currency',
     currency: 'INR'
   }).format(amount);
 };


 return (
   <div className="bg-white rounded-xl shadow-sm border border-gray-100">
     {/* Header */}
     <div className="p-6 border-b border-gray-100">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div className="flex items-center gap-3">
           <div className="p-2 bg-green-100 rounded-lg">
             <ShoppingCart className="w-6 h-6 text-green-600" />
           </div>
           <div>
             <h2 className="text-xl font-semibold text-gray-800">Sales Management</h2>
             <p className="text-sm text-gray-500">Track and manage product sales</p>
           </div>
         </div>
        
         <div className="flex items-center gap-2">
           <button
             onClick={() => setShowFilters(!showFilters)}
             className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
           >
             <Filter className="w-4 h-4" />
             Filters
           </button>
           <button
             onClick={fetchSales}
             disabled={loading}
             className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
           >
             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             Refresh
           </button>
           <button
             onClick={exportToCSV}
             disabled={filteredSales.length === 0}
             className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
           >
             <Download className="w-4 h-4" />
             Export CSV
           </button>
           <button
             onClick={onAdd}
             className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
           >
             <Plus className="w-4 h-4" />
             New Sale
           </button>
         </div>
       </div>


       {/* Message Display */}
       {message.text && (
         <div className={`mt-4 p-3 rounded-lg border flex items-center gap-2 ${
           message.type === 'success'
             ? 'bg-green-50 border-green-200 text-green-700'
             : 'bg-red-50 border-red-200 text-red-700'
         }`}>
           <AlertCircle className="w-4 h-4" />
           <span className="text-sm">{message.text}</span>
           <button
             onClick={() => setMessage({ type: '', text: '' })}
             className="ml-auto text-gray-400 hover:text-gray-600"
           >
             <X className="w-4 h-4" />
           </button>
         </div>
       )}
     </div>


     {/* Stats Cards */}
     <div className="p-6 bg-gray-50 border-b border-gray-100">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-lg border border-gray-200">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm text-gray-600">Total Sales</p>
               <p className="text-2xl font-semibold text-gray-800">{stats.totalSales}</p>
             </div>
             <ShoppingCart className="w-8 h-8 text-blue-500" />
           </div>
         </div>


         <div className="bg-white p-4 rounded-lg border border-gray-200">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm text-gray-600">Total Revenue</p>
               <p className="text-2xl font-semibold text-gray-800">{formatCurrency(stats.totalRevenue)}</p>
             </div>
             <DollarSign className="w-8 h-8 text-green-500" />
           </div>
         </div>


         <div className="bg-white p-4 rounded-lg border border-gray-200">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm text-gray-600">Items Sold</p>
               <p className="text-2xl font-semibold text-gray-800">{stats.totalItems}</p>
             </div>
             <Package className="w-8 h-8 text-orange-500" />
           </div>
         </div>


         <div className="bg-white p-4 rounded-lg border border-gray-200">
           <div className="flex items-center justify-between">
             <div>
               <p className="text-sm text-gray-600">Avg Sale Value</p>
               <p className="text-2xl font-semibold text-gray-800">{formatCurrency(stats.averageSale)}</p>
             </div>
             <BarChart3 className="w-8 h-8 text-purple-500" />
           </div>
         </div>
       </div>
     </div>


     {/* Filters */}
     {showFilters && (
       <div className="p-6 bg-gray-50 border-b border-gray-100">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
             <input
               type="date"
               value={filters.dateFrom}
               onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
               className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
             <input
               type="date"
               value={filters.dateTo}
               onChange={(e) => handleFilterChange('dateTo', e.target.value)}
               className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
             <select
               value={filters.category}
               onChange={(e) => handleFilterChange('category', e.target.value)}
               className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
             >
               <option value="">All Categories</option>
               {categories.map(category => (
                 <option key={category} value={category}>{category}</option>
               ))}
             </select>
           </div>
           <div className="flex items-end gap-2">
             <button
               onClick={fetchSales}
               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
             >
               Apply Filters
             </button>
             <button
               onClick={clearFilters}
               className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
             >
               Clear
             </button>
           </div>
         </div>
       </div>
     )}


     {/* Search */}
     <div className="p-6 border-b border-gray-100">
       <div className="relative max-w-md">
         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
         <input
           type="text"
           placeholder="Search sales by item or category..."
           value={filters.search}
           onChange={(e) => handleFilterChange('search', e.target.value)}
           className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
         />
       </div>
     </div>


     {/* Table */}
     <div className="overflow-x-auto">
       {loading ? (
         <div className="flex justify-center items-center py-12">
           <div className="flex items-center gap-3 text-gray-500">
             <Loader className="w-5 h-5 animate-spin" />
             Loading sales data...
           </div>
         </div>
       ) : filteredSales.length === 0 ? (
         <div className="text-center py-12">
           <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <h3 className="text-lg font-medium text-gray-700 mb-1">No Sales Found</h3>
           <p className="text-gray-500 mb-4">No sales match your current filters</p>
           <button
             onClick={onAdd}
             className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
           >
             <Plus className="w-4 h-4" />
             Record First Sale
           </button>
         </div>
       ) : (
         <table className="w-full">
           <thead className="bg-gray-50">
             <tr>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Sale Details
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Item & Category
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Quantity
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Unit Price
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Total
               </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 Actions
               </th>
             </tr>
           </thead>
           <tbody className="bg-white divide-y divide-gray-200">
             {filteredSales.map((sale) => (
               <tr key={sale.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div>
                     <div className="text-sm font-medium text-gray-800">
                       {new Date(sale.sold_at).toLocaleDateString()}
                     </div>
                     <div className="text-xs text-gray-500">
                       {new Date(sale.sold_at).toLocaleTimeString()}
                     </div>
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div>
                     <div className="text-sm font-medium text-gray-800">
                       {sale.item?.name || 'Unknown Item'}
                     </div>
                     <div className="text-xs text-gray-500">
                       {sale.item?.category || 'No Category'}
                     </div>
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-800">{sale.quantity}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm text-gray-800">{formatCurrency(sale.unit_price)}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-medium text-gray-800">{formatCurrency(sale.total)}</div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => deleteSale(sale.id)}
                       className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                       title="Delete Sale"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       )}
     </div>
   </div>
 );
}



