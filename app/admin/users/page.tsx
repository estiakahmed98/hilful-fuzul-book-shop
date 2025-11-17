'use client';

import { useState, useEffect } from 'react';
import UserTable from '@/components/admin/users/UserTable';
import UserFilters from '@/components/admin/users/UserFilters';
import Pagination from '@/components/admin/users/Pagination';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  phone: string | null;
  banned: boolean | null;
  banReason: string | null;
  banExpires: number | null;
  note: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    orders: number;
    reviews: number;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.role && { role: filters.role }),
      });

      const response = await fetch(`/api/users?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError('Error fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, filters]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRoleChange = (role: string) => {
    setFilters(prev => ({ ...prev, role }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ search: '', role: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleUserUpdate = (userId: string, updates: Partial<User>) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      )
    );
  };

  const handleUserDelete = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your users, view their activities, and moderate accounts.
          </p>
        </div>

        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
            <button onClick={() => setError('')} className="btn btn-sm btn-ghost">
              ×
            </button>
          </div>
        )}

        <UserFilters
          search={filters.search}
          role={filters.role}
          onSearchChange={handleSearchChange}
          onRoleChange={handleRoleChange}
          onReset={handleResetFilters}
        />

        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Users ({pagination.total})
              </h2>
              <div className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </div>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-500">No users found</div>
            </div>
          ) : (
            <>
              <UserTable
                users={users}
                onUserUpdate={handleUserUpdate}
                onUserDelete={handleUserDelete}
              />
              
              {pagination.totalPages > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}