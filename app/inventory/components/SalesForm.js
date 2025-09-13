// app/inventory/components/SalesForm.js - Clean Professional Design
'use client'
import { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Package, DollarSign, Hash, AlertCircle, CheckCircle } from 'lucide-react';


export default function SalesForm({ onAdded }) {
 const [formData, setFormData] = useState({
   item_id: '',
   quantity: 1,
   unit_price: ''
 });
 const [loading, setLoading] = useState(false);
 const [items, setItems] = useState([]);
 const [selectedItem, setSelectedItem] = useState(null);
 const [loadingItems, setLoadingItems] = useState(true);
 const [message, setMessage] = useState({ type: '', text: '' });
  // Quick sale presets for common items
 const [quickSales, setQuickSales] = useState([]);


 useEffect(() => {
   fetchItems();
 }, []);


 const fetchItems = async () => {
   try {
     const response = await fetch('/api/inventory-items');
     if (response.ok) {
       const data = await response.json();
       const availableItems = data.filter(item => item.current_stock > 0);
       setItems(availableItems);
      
       // Create quick sale options for items with selling price
       const quickSaleItems = availableItems
         .filter(item => item.selling_price && item.current_stock > 0)
         .slice(0, 6); // Limit to 6 quick sale buttons
       setQuickSales(quickSaleItems);
     }
   } catch (error) {
     console.error('Error fetching items:', error);
   } finally {
     setLoadingItems(false);
   }
 };


 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({ ...prev, [name]: value }));
  
   // Auto-fill price when item is selected
   if (name === 'item_id') {
     const item = items.find(i => i.id === value);
     setSelectedItem(item);
     if (item) {
       setFormData(prev => ({
         ...prev,
         unit_price: item.selling_price || item.unit_price || ''
       }));
     }
   }
 };


 const quickSale = async (item) => {
   setLoading(true);
   setMessage({ type: '', text: '' });
  
   try {
     const saleData = {
       item_id: item.id,
       quantity: 1,
       unit_price: item.selling_price || item.unit_price
     };
    
     const response = await fetch('/api/sales', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(saleData)
     });


     const result = await response.json();


     if (response.ok) {
       setMessage({
         type: 'success',
         text: `Quick sale: ${item.name} - ₹${saleData.unit_price}`
       });
       fetchItems(); // Refresh items to update stock
       if (onAdded) onAdded();
     } else {
       setMessage({ type: 'error', text: result.error || 'Failed to record sale' });
     }
   } catch (error) {
     setMessage({ type: 'error', text: 'Network error occurred' });
   } finally {
     setLoading(false);
   }
 };


 const handleSubmit = async (e) => {
   e.preventDefault();
  
   if (!formData.item_id || !formData.quantity || !formData.unit_price) {
     setMessage({ type: 'error', text: 'Please fill all required fields' });
     return;
   }


   if (selectedItem && formData.quantity > selectedItem.current_stock) {
     setMessage({
       type: 'error',
       text: `Not enough stock! Available: ${selectedItem.current_stock}`
     });
     return;
   }


   setLoading(true);
   setMessage({ type: '', text: '' });


   try {
     const response = await fetch('/api/sales', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData)
     });


     const result = await response.json();


     if (response.ok) {
       setMessage({ type: 'success', text: 'Sale recorded successfully!' });
       setFormData({ item_id: '', quantity: 1, unit_price: '' });
       setSelectedItem(null);
       fetchItems(); // Refresh items to update stock
       if (onAdded) onAdded();
     } else {
       setMessage({ type: 'error', text: result.error || 'Failed to record sale' });
     }
   } catch (error) {
     setMessage({ type: 'error', text: 'Network error occurred' });
   } finally {
     setLoading(false);
   }
 };


 const totalAmount = formData.quantity && formData.unit_price
   ? (parseFloat(formData.quantity) * parseFloat(formData.unit_price)).toFixed(2)
   : '0.00';


 // Group items by category for better organization
 const groupedItems = items.reduce((acc, item) => {
   const category = item.category || 'Other';
   if (!acc[category]) acc[category] = [];
   acc[category].push(item);
   return acc;
 }, {});


 return (
   <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
     <div className="flex items-center gap-3 mb-6">
       <div className="p-2 bg-green-100 rounded-lg">
         <ShoppingCart className="w-6 h-6 text-green-600" />
       </div>
       <div>
         <h2 className="text-xl font-semibold text-gray-800">Record Sale</h2>
         <p className="text-sm text-gray-500">Track product sales and update inventory</p>
       </div>
     </div>


     {/* Quick Sale Buttons */}
     {quickSales.length > 0 && (
       <div className="mb-6">
         <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Sales</h3>
         <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
           {quickSales.map(item => (
             <button
               key={item.id}
               onClick={() => quickSale(item)}
               disabled={loading || item.current_stock === 0}
               className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <div className="text-sm font-medium text-gray-800">{item.name}</div>
               <div className="text-xs text-gray-500">₹{item.selling_price} • Stock: {item.current_stock}</div>
             </button>
           ))}
         </div>
       </div>
     )}


     {/* Message Display */}
     {message.text && (
       <div className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${
         message.type === 'success'
           ? 'bg-green-50 border-green-200 text-green-700'
           : 'bg-red-50 border-red-200 text-red-700'
       }`}>
         {message.type === 'success' ? (
           <CheckCircle className="w-4 h-4" />
         ) : (
           <AlertCircle className="w-4 h-4" />
         )}
         <span className="text-sm">{message.text}</span>
       </div>
     )}


     <form onSubmit={handleSubmit} className="space-y-4">
       {/* Item Selection */}
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           <Package className="w-4 h-4 inline mr-1" />
           Select Item
         </label>
         {loadingItems ? (
           <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
             <div className="text-sm text-gray-500">Loading items...</div>
           </div>
         ) : (
           <select
             name="item_id"
             value={formData.item_id}
             onChange={handleInputChange}
             required
             className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
           >
             <option value="">Choose an item to sell</option>
             {Object.entries(groupedItems).map(([category, categoryItems]) => (
               <optgroup key={category} label={category}>
                 {categoryItems.map(item => (
                   <option key={item.id} value={item.id}>
                     {item.name} - ₹{item.selling_price || item.unit_price} (Stock: {item.current_stock})
                   </option>
                 ))}
               </optgroup>
             ))}
           </select>
         )}
         {selectedItem && (
           <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
             Current Stock: {selectedItem.current_stock} {selectedItem.unit}
           </div>
         )}
       </div>


       {/* Quantity and Price Row */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             <Hash className="w-4 h-4 inline mr-1" />
             Quantity
           </label>
           <input
             type="number"
             name="quantity"
             value={formData.quantity}
             onChange={handleInputChange}
             min="1"
             max={selectedItem?.current_stock || 999}
             required
             className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
           />
         </div>


         <div>
           <label className="block text-sm font-medium text-gray-700 mb-2">
             <DollarSign className="w-4 h-4 inline mr-1" />
             Unit Price (₹)
           </label>
           <input
             type="number"
             name="unit_price"
             value={formData.unit_price}
             onChange={handleInputChange}
             min="0"
             step="0.01"
             required
             className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
           />
         </div>
       </div>


       {/* Total Amount Display */}
       <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
         <div className="text-sm text-gray-600">Total Amount</div>
         <div className="text-xl font-semibold text-gray-800">₹{totalAmount}</div>
       </div>


       {/* Submit Button */}
       <button
         type="submit"
         disabled={loading || loadingItems || !formData.item_id}
         className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
       >
         {loading ? (
           <>
             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
             Recording Sale...
           </>
         ) : (
           <>
             <Plus className="w-4 h-4" />
             Record Sale
           </>
         )}
       </button>
     </form>
   </div>
 );
}

