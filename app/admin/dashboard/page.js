// app/admin/dashboard/page.js
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import SearchBar from '@/components/dashboard/SearchAndFilter';
import UserTable from '@/components/dashboard/UserTable';
import UserDetailModal from '@/components/dashboard/UserDetailModal';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Auth + Initial load
  useEffect(() => {
    const fetchInitial = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setCurrentUser(user);

      const { data, error } = await supabase.from('profiles_new').select('*');
      if (error) console.error(error.message);
      else setUsers(data);

      setLoading(false);
    };

    fetchInitial();
  }, [router, supabase]);

  // 🔍 Search query against Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      let query = supabase.from('profiles_new').select('*');

      if (searchTerm.trim()) {
        query = query.or(
          `full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;
      if (error) {
        console.error('Search error:', error.message);
      } else {
        setUsers(data);
      }

      setLoading(false);
    };

    fetchUsers();
  }, [searchTerm, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleCreateUser = () => {
    router.push('/admin/create-user');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        onCreateUser={handleCreateUser}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
      
      <StatsCards
        totalUsers={users.length}
        activeUsers={users.filter(u => u.role === 'user').length}
        newUsersToday={users.filter(u => u.role === 'admin').length}
      />

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
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
