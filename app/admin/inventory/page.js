// app/admin/inventory/page.js
'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
 Package, DollarSign, TrendingUp, ShoppingCart, ArrowLeft, Plus,
 AlertTriangle, Loader, BarChart3, Store, Receipt, Coins, Target
} from 'lucide-react';


// Import your components
import ExpenseForm from '../../inventory/components/ExpenseForm';
import ExpenseTable from '../../inventory/components/ExpenseTable';
import InventoryItemForm from '../../inventory/components/InventoryItemForm';
import InventoryTable from '../../inventory/components/InventoryTable';
import SalesForm from '../../inventory/components/SalesForm';
import SalesTable from '../../inventory/components/SalesTable';
import StockUpdateModal from '../../inventory/components/StockUpdateModal';


export default function AdminInventoryPage() {
 const router = useRouter();
 const [activeTab, setActiveTab] = useState('overview');
 const [showExpenseForm, setShowExpenseForm] = useState(false);
 const [showInventoryForm, setShowInventoryForm] = useState(false);
 const [showSalesForm, setShowSalesForm] = useState(false);
 const [showStockModal, setShowStockModal] = useState(false);
 const [selectedItem, setSelectedItem] = useState(null);
 const [refreshTrigger, setRefreshTrigger] = useState(0);


 // Overview stats
 const [overviewStats, setOverviewStats] = useState({
   totalExpenses: 0,
   totalRevenue: 0,
   netProfit: 0,
   totalItems: 0,
   lowStockItems: 0,
   todaySales: 0,
   thisMonthSales: 0,
   loading: true
 });


 useEffect(() => {
   fetchOverviewStats();
 }, [refreshTrigger]);


 const fetchOverviewStats = async () => {
   try {
     const today = new Date().toISOString().split('T')[0];
     const thisMonth = new Date().toISOString().substring(0, 7); // YYYY-MM format


     // Fetch expenses
     const expensesResponse = await fetch('/api/expenses');
     const expensesData = await expensesResponse.json();
     const totalExpenses = expensesData.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);


     // Fetch revenues/sales
     const salesResponse = await fetch('/api/sales');
     const salesData = await salesResponse.json();
     const totalRevenue = salesData.stats?.totalRevenue || 0;
    
     // Today's sales
     const todaysSales = salesData.sales?.filter(sale =>
       sale.sold_at.startsWith(today)
     ).reduce((sum, sale) => sum + parseFloat(sale.total), 0) || 0;


     // This month's sales
     const thisMonthsSales = salesData.sales?.filter(sale =>
       sale.sold_at.startsWith(thisMonth)
     ).reduce((sum, sale) => sum + parseFloat(sale.total), 0) || 0;


     // Fetch inventory items
     const inventoryResponse = await fetch('/api/inventory-items');
     const inventoryData = await inventoryResponse.json();
     const totalItems = inventoryData.length;
     const lowStockItems = inventoryData.filter(item => item.current_stock < 10).length;


     setOverviewStats({
       totalExpenses,
       totalRevenue,
       netProfit: totalRevenue - totalExpenses,
       totalItems,
       lowStockItems,
       todaySales: todaysSales,
       thisMonthSales: thisMonthsSales,
       loading: false
     });


   } catch (error) {
     console.error('Error fetching overview stats:', error);
     setOverviewStats(prev => ({ ...prev, loading: false }));
   }
 };


 const triggerRefresh = () => {
   setRefreshTrigger(prev => prev + 1);
 };


 const handleStockUpdate = (item) => {
   setSelectedItem(item);
   setShowStockModal(true);
 };


 const formatCurrency = (amount) => {
   return new Intl.NumberFormat('en-IN', {
     style: 'currency',
     currency: 'INR'
   }).format(amount || 0);
 };


 const tabs = [
   { id: 'overview', label: 'Overview', icon: BarChart3 },
   { id: 'sales', label: 'Sales', icon: ShoppingCart },
   { id: 'inventory', label: 'Inventory', icon: Package },
   { id: 'expenses', label: 'Expenses', icon: DollarSign }
 ];


 return (
   <div className="min-h-screen bg-gray-50">
     {/* Header */}
     <div className="bg-white border-b border-gray-200">
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex items-center justify-between py-6">
           <div className="flex items-center gap-4">
             <button
               onClick={() => router.back()}
               className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
             >
               <ArrowLeft className="w-5 h-5" />
             </button>
             <div>
               <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
               <p className="text-sm text-gray-600">Manage sales, inventory, and expenses</p>
             </div>
           </div>
          
           <div className="flex items-center gap-3">
             {activeTab === 'sales' && (
               <button
                 onClick={() => setShowSalesForm(true)}
                 className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
               >
                 <Plus className="w-4 h-4" />
                 Record Sale
               </button>
             )}
             {activeTab === 'inventory' && (
               <button
                 onClick={() => setShowInventoryForm(true)}
                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
               >
                 <Plus className="w-4 h-4" />
                 Add Item
               </button>
             )}
             {activeTab === 'expenses' && (
               <button
                 onClick={() => setShowExpenseForm(true)}
                 className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
               >
                 <Plus className="w-4 h-4" />
                 Add Expense
               </button>
             )}
           </div>
         </div>


         {/* Tab Navigation */}
         <div className="flex space-x-8">
           {tabs.map((tab) => {
             const Icon = tab.icon;
             return (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                   activeTab === tab.id
                     ? 'border-blue-500 text-blue-600'
                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                 }`}
               >
                 <Icon className="w-4 h-4" />
                 {tab.label}
               </button>
             );
           })}
         </div>
       </div>
     </div>


     {/* Content */}
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       {activeTab === 'overview' && (
         <div className="space-y-6">
           {/* Key Metrics */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                   <p className="text-2xl font-bold text-green-600">
                     {overviewStats.loading ? (
                       <Loader className="w-6 h-6 animate-spin" />
                     ) : (
                       formatCurrency(overviewStats.totalRevenue)
                     )}
                   </p>
                 </div>
                 <div className="p-3 bg-green-100 rounded-lg">
                   <TrendingUp className="w-6 h-6 text-green-600" />
                 </div>
               </div>
             </div>


             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                   <p className="text-2xl font-bold text-orange-600">
                     {overviewStats.loading ? (
                       <Loader className="w-6 h-6 animate-spin" />
                     ) : (
                       formatCurrency(overviewStats.totalExpenses)
                     )}
                   </p>
                 </div>
                 <div className="p-3 bg-orange-100 rounded-lg">
                   <DollarSign className="w-6 h-6 text-orange-600" />
                 </div>
               </div>
             </div>


             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-600">Net Profit</p>
                   <p className={`text-2xl font-bold ${
                     overviewStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                   }`}>
                     {overviewStats.loading ? (
                       <Loader className="w-6 h-6 animate-spin" />
                     ) : (
                       formatCurrency(overviewStats.netProfit)
                     )}
                   </p>
                 </div>
                 <div className={`p-3 rounded-lg ${
                   overviewStats.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
                 }`}>
                   <Target className={`w-6 h-6 ${
                     overviewStats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                   }`} />
                 </div>
               </div>
             </div>


             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm font-medium text-gray-600">Total Items</p>
                   <p className="text-2xl font-bold text-blue-600">
                     {overviewStats.loading ? (
                       <Loader className="w-6 h-6 animate-spin" />
                     ) : (
                       overviewStats.totalItems
                     )}
                   </p>
                   <p className="text-xs text-red-500 mt-1">
                     {overviewStats.lowStockItems} low stock
                   </p>
                 </div>
                 <div className="p-3 bg-blue-100 rounded-lg">
                   <Package className="w-6 h-6 text-blue-600" />
                 </div>
               </div>
             </div>
           </div>


           {/* Daily & Monthly Performance */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-800">Today&apos;s Sales</h3>
                 <Receipt className="w-5 h-5 text-gray-400" />
               </div>
               <p className="text-3xl font-bold text-green-600">
                 {overviewStats.loading ? (
                   <Loader className="w-6 h-6 animate-spin" />
                 ) : (
                   formatCurrency(overviewStats.todaySales)
                 )}
               </p>
               <p className="text-sm text-gray-500 mt-1">Revenue generated today</p>
             </div>


             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-800">This Month&apos;s Sales</h3>
                 <Coins className="w-5 h-5 text-gray-400" />
               </div>
               <p className="text-3xl font-bold text-blue-600">
                 {overviewStats.loading ? (
                   <Loader className="w-6 h-6 animate-spin" />
                 ) : (
                   formatCurrency(overviewStats.thisMonthSales)
                 )}
               </p>
               <p className="text-sm text-gray-500 mt-1">Revenue this month</p>
             </div>
           </div>


           {/* Alerts */}
           {overviewStats.lowStockItems > 0 && (
             <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
               <div className="flex items-center gap-3">
                 <AlertTriangle className="w-5 h-5 text-yellow-600" />
                 <div>
                   <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
                   <p className="text-sm text-yellow-700 mt-1">
                     {overviewStats.lowStockItems} items are running low on stock.
                     <button
                       onClick={() => setActiveTab('inventory')}
                       className="ml-2 font-medium text-yellow-800 underline hover:no-underline"
                     >
                       View Inventory
                     </button>
                   </p>
                 </div>
               </div>
             </div>
           )}


           {/* Quick Actions */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <button
               onClick={() => setShowSalesForm(true)}
               className="p-6 bg-white border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-colors text-left"
             >
               <ShoppingCart className="w-8 h-8 text-green-600 mb-3" />
               <h3 className="font-semibold text-gray-800 mb-2">Record New Sale</h3>
               <p className="text-sm text-gray-600">Sell items and update inventory automatically</p>
             </button>


             <button
               onClick={() => setShowInventoryForm(true)}
               className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
             >
               <Package className="w-8 h-8 text-blue-600 mb-3" />
               <h3 className="font-semibold text-gray-800 mb-2">Add Inventory Item</h3>
               <p className="text-sm text-gray-600">Add new products to your inventory</p>
             </button>


             <button
               onClick={() => setShowExpenseForm(true)}
               className="p-6 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-colors text-left"
             >
               <DollarSign className="w-8 h-8 text-orange-600 mb-3" />
               <h3 className="font-semibold text-gray-800 mb-2">Record Expense</h3>
               <p className="text-sm text-gray-600">Track business expenses and costs</p>
             </button>
           </div>
         </div>
       )}


       {activeTab === 'sales' && (
         <div className="space-y-6">
           {showSalesForm && (
             <SalesForm
               onAdded={() => {
                 setShowSalesForm(false);
                 triggerRefresh();
               }}
             />
           )}
           <SalesTable
             onAdd={() => setShowSalesForm(true)}
             refreshTrigger={refreshTrigger}
           />
         </div>
       )}


       {activeTab === 'inventory' && (
         <div className="space-y-6">
           {showInventoryForm && (
             <InventoryItemForm
               onAdded={() => {
                 setShowInventoryForm(false);
                 triggerRefresh();
               }}
             />
           )}
           <InventoryTable
             onAdd={() => setShowInventoryForm(true)}
             onStockUpdate={handleStockUpdate}
             refreshTrigger={refreshTrigger}
           />
         </div>
       )}


       {activeTab === 'expenses' && (
         <div className="space-y-6">
           {showExpenseForm && (
             <ExpenseForm
               onAdded={() => {
                 setShowExpenseForm(false);
                 triggerRefresh();
               }}
             />
           )}
           <ExpenseTable
             onAdd={() => setShowExpenseForm(true)}
             refreshTrigger={refreshTrigger}
           />
         </div>
       )}
     </div>


     {/* Modals */}
     {showStockModal && selectedItem && (
       <StockUpdateModal
         item={selectedItem}
         onClose={() => {
           setShowStockModal(false);
           setSelectedItem(null);
         }}
         onUpdate={() => {
           setShowStockModal(false);
           setSelectedItem(null);
           triggerRefresh();
         }}
       />
     )}
   </div>
 );
}

