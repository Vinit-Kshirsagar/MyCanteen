
// app/admin/dashboard/page.js - Updated with inventory navigation

'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';


import DashboardHeader from './components/DashboardHeader';
import StatsCards from './components/StatsCards';
import SearchBar from './components/SearchAndFilter';
import UserTable from './components/UserTable';
import UserDetailModal from './components/UserDetailModal';


export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [totalRevenue, setTotalRevenue] = useState(0);

  // Fetch revenue data
  async function fetchRevenueData() {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount');

      if (!error && data) {
        const revenue = data.reduce((sum, row) => sum + row.amount, 0);
        setTotalRevenue(revenue);
      }
    } catch (error) {
      console.error('Error fetching revenue:', error);
    }
  }

  // Auth + Initial load
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles_new')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin') {
          router.push('/unauthorized');
          return;
        }

        setCurrentUser(user);

        // Fetch all users
        const { data: usersData, error } = await supabase
          .from('profiles_new')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching users:', error.message);
        } else {
          setUsers(usersData || []);
        }
      } catch (error) {
        console.error('Error in initial fetch:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
    fetchRevenueData();
  }, [router, supabase]);

  // Search functionality
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) {
        // If no search term, fetch all users
        try {
          const { data, error } = await supabase
            .from('profiles_new')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            console.error('Fetch error:', error.message);
          } else {
            setUsers(data || []);
          }
        } catch (error) {
          console.error('Error fetching all users:', error);
        }
        return;
      }

      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('profiles_new')
          .select('*')
          .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Search error:', error.message);
        } else {
          setUsers(data || []);
        }
      } catch (error) {
        console.error('Error in search:', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timeoutId);

  }, [searchTerm, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };


  const handleCreateUser = () => {
    router.push('/admin/create-user');
  };

  const handleManagePolls = () => {
    router.push('/admin/polls');
  };

  const handleManageInventory = () => {
    router.push('/admin/inventory');
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        onCreateUser={handleCreateUser}

        onManagePolls={handleManagePolls}
        onManageInventory={handleManageInventory}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
     
      <StatsCards
        totalUsers={users.length}
        activeUsers={users.filter(u => u.role === 'user').length}
        adminUsers={users.filter(u => u.role === 'admin').length}
        totalRevenue={totalRevenue}
      />

      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        placeholder="Search users by name or email..."
      />
     

      <UserTable
        users={users}
        onViewUser={(user) => setSelectedUser(user)}
        loading={loading}
      />

      <UserDetailModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );

}

