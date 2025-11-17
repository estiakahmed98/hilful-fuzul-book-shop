'use client';

import { useState } from 'react';
import Link from 'next/link';

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

interface UserTableProps {
  users: User[];
  onUserUpdate: (userId: string, updates: Partial<User>) => void;
  onUserDelete: (userId: string) => void;
}

export default function UserTable({ users, onUserUpdate, onUserDelete }: UserTableProps) {
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('7'); // days

  const handleBanUser = async (userId: string, email: string) => {
    if (!banReason) {
      alert('Please provide a ban reason');
      return;
    }

    const banExpires = Date.now() + parseInt(banDuration) * 24 * 60 * 60 * 1000;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          banned: true,
          banReason,
          banExpires: Math.floor(banExpires / 1000),
        }),
      });

      if (response.ok) {
        onUserUpdate(userId, {
          banned: true,
          banReason,
          banExpires: Math.floor(banExpires / 1000),
        });
        setBanReason('');
      } else {
        alert('Failed to ban user');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Error banning user');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          banned: false,
          banReason: null,
          banExpires: null,
        }),
      });

      if (response.ok) {
        onUserUpdate(userId, {
          banned: false,
          banReason: null,
          banExpires: null,
        });
      } else {
        alert('Failed to unban user');
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      alert('Error unbanning user');
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUserDelete(userId);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const isBanExpired = (banExpires: number | null) => {
    if (!banExpires) return true;
    return Date.now() > banExpires * 1000;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Orders
            </th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || 'No Name'}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    {user.phone && (
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user._count.orders} orders
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {user.banned && !isBanExpired(user.banExpires) ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                    Banned
                  </span>
                ) : user.emailVerified ? (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                    Unverified
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View
                </Link>
                {user.banned && !isBanExpired(user.banExpires) ? (
                  <button
                    onClick={() => handleUnbanUser(user.id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Unban
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const modal = document.getElementById('ban-modal') as HTMLDialogElement;
                      if (modal) {
                        modal.showModal();
                        // Store current user ID for the ban action
                        modal.dataset.userId = user.id;
                        modal.dataset.userEmail = user.email;
                      }
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Ban
                  </button>
                )}
                <button
                  onClick={() => handleDeleteUser(user.id, user.email)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ban Modal */}
      <dialog id="ban-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Ban User</h3>
          <div className="py-4 space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Ban Reason</span>
              </label>
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Enter ban reason..."
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Ban Duration (days)</span>
              </label>
              <select
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
          </div>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => {
                const modal = document.getElementById('ban-modal') as HTMLDialogElement;
                modal.close();
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={() => {
                const modal = document.getElementById('ban-modal') as HTMLDialogElement;
                const userId = modal.dataset.userId;
                const userEmail = modal.dataset.userEmail;
                if (userId) {
                  handleBanUser(userId, userEmail || '');
                }
                modal.close();
              }}
            >
              Ban User
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}