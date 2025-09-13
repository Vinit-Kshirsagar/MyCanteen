// app/api/sales/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function GET(request) {
 try {
   const cookieStore = await cookies();
   const supabase = createRouteHandlerClient({ cookies: () => cookieStore });


   const { searchParams } = new URL(request.url);


   const dateFrom = searchParams.get('dateFrom');
   const dateTo = searchParams.get('dateTo');
   const category = searchParams.get('category');


   // Build query
   let query = supabase
     .from('revenues')
     .select(`
       *,
       item:inventory_items(
         id,
         name,
         category,
         unit,
         selling_price
       )
     `)
     .order('sold_at', { ascending: false });


   // Apply filters
   if (dateFrom) {
     query = query.gte('sold_at', dateFrom);
   }
   if (dateTo) {
     query = query.lte('sold_at', dateTo + 'T23:59:59');
   }


   const { data: sales, error } = await query;


   if (error) {
     console.error('Error fetching sales:', error);
     return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
   }


   // Filter by category if specified
   let filteredSales = sales || [];
   if (category) {
     filteredSales = filteredSales.filter(
       (sale) => sale.item?.category === category
     );
   }


   // Calculate stats
   const stats = filteredSales.reduce(
     (acc, sale) => {
       acc.totalSales += 1;
       acc.totalRevenue += parseFloat(sale.total || 0);
       acc.totalItems += sale.quantity;
       return acc;
     },
     {
       totalSales: 0,
       totalRevenue: 0,
       totalItems: 0,
       averageSale: 0,
     }
   );


   stats.averageSale =
     stats.totalSales > 0 ? stats.totalRevenue / stats.totalSales : 0;


   return NextResponse.json({
     sales: filteredSales,
     stats,
   });
 } catch (error) {
   console.error('Error in sales GET:', error);
   return NextResponse.json(
     { error: 'Internal server error' },
     { status: 500 }
   );
 }
}


export async function POST(request) {
 try {
   const cookieStore = await cookies();
   const supabase = createRouteHandlerClient({ cookies: () => cookieStore });


   const { item_id, quantity, unit_price } = await request.json();


   // Validate input
   if (!item_id || !quantity || !unit_price) {
     return NextResponse.json(
       { error: 'Missing required fields: item_id, quantity, unit_price' },
       { status: 400 }
     );
   }


   if (quantity <= 0 || unit_price <= 0) {
     return NextResponse.json(
       { error: 'Quantity and unit_price must be greater than 0' },
       { status: 400 }
     );
   }


   // Check if item exists and has enough stock
   const { data: item, error: itemError } = await supabase
     .from('inventory_items')
     .select('*')
     .eq('id', item_id)
     .single();


   if (itemError || !item) {
     return NextResponse.json({ error: 'Item not found' }, { status: 404 });
   }


   if (item.current_stock < quantity) {
     return NextResponse.json(
       {
         error: `Not enough stock. Available: ${item.current_stock}, Required: ${quantity}`,
       },
       { status: 400 }
     );
   }


   const total = (parseFloat(quantity) * parseFloat(unit_price)).toFixed(2);


   // Create the sale record
   const { data: sale, error: saleError } = await supabase
     .from('revenues')
     .insert({
       item_id,
       quantity: parseInt(quantity),
       unit_price: parseFloat(unit_price),
       total: parseFloat(total),
       sold_at: new Date().toISOString(),
     })
     .select()
     .single();


   if (saleError) {
     console.error('Error creating sale:', saleError);
     return NextResponse.json(
       { error: 'Failed to record sale' },
       { status: 500 }
     );
   }


   // Create inventory log entry
   const { error: logError } = await supabase.from('inventory_logs').insert({
     item_id,
     type: 'out',
     quantity: parseInt(quantity),
     total_amount: parseFloat(total),
     note: `Sale - ${item.name}`,
     logged_at: new Date().toISOString(),
   });


   if (logError) {
     console.error('Error creating inventory log:', logError);
   }


   return NextResponse.json({
     message: 'Sale recorded successfully',
     sale: {
       ...sale,
       item: {
         id: item.id,
         name: item.name,
         category: item.category,
       },
     },
   });
 } catch (error) {
   console.error('Error in sales POST:', error);
   return NextResponse.json(
     { error: 'Internal server error' },
     { status: 500 }
   );
 }
}


export async function DELETE(request) {
 try {
   const cookieStore = await cookies();
   const supabase = createRouteHandlerClient({ cookies: () => cookieStore });


   const { searchParams } = new URL(request.url);
   const saleId = searchParams.get('id');


   if (!saleId) {
     return NextResponse.json(
       { error: 'Sale ID is required' },
       { status: 400 }
     );
   }


   // Get sale details before deleting
   const { data: sale, error: fetchError } = await supabase
     .from('revenues')
     .select('*')
     .eq('id', saleId)
     .single();


   if (fetchError || !sale) {
     return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
   }


   // Delete the sale
   const { error: deleteError } = await supabase
     .from('revenues')
     .delete()
     .eq('id', saleId);


   if (deleteError) {
     console.error('Error deleting sale:', deleteError);
     return NextResponse.json(
       { error: 'Failed to delete sale' },
       { status: 500 }
     );
   }


   // Create a reverse inventory log to restore stock
   const { error: logError } = await supabase.from('inventory_logs').insert({
     item_id: sale.item_id,
     type: 'in',
     quantity: sale.quantity,
     total_amount: sale.total,
     note: `Sale reversal - Restoring stock`,
     logged_at: new Date().toISOString(),
   });


   if (logError) {
     console.error('Error creating reverse inventory log:', logError);
     return NextResponse.json(
       {
         error:
           'Sale deleted but failed to restore stock. Please check inventory manually.',
       },
       { status: 500 }
     );
   }


   return NextResponse.json({
     message: 'Sale deleted and stock restored successfully',
   });
 } catch (error) {
   console.error('Error in sales DELETE:', error);
   return NextResponse.json(
     { error: 'Internal server error' },
     { status: 500 }
   );
 }
}



