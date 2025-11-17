'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Eye, 
  Ban, 
  ShieldOff, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  ShoppingBag,
  Star,
  Shield,
  User as UserIcon
} from 'lucide-react';

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
      alert('দয়া করে নিষিদ্ধ করার কারণ লিখুন');
      return;
    }

    const banExpires = banDuration === 'permanent' 
      ? null 
      : Date.now() + parseInt(banDuration) * 24 * 60 * 60 * 1000;
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          banned: true,
          banReason,
          banExpires: banExpires ? Math.floor(banExpires / 1000) : null,
        }),
      });

      if (response.ok) {
        onUserUpdate(userId, {
          banned: true,
          banReason,
          banExpires: banExpires ? Math.floor(banExpires / 1000) : null,
        });
        setBanReason('');
      } else {
        alert('ব্যবহারকারী নিষিদ্ধ করতে ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      alert('ব্যবহারকারী নিষিদ্ধ করতে ত্রুটি occurred');
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
        alert('ব্যবহারকারীর নিষেধাজ্ঞা তুলতে ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      alert('ব্যবহারকারীর নিষেধাজ্ঞা তুলতে ত্রুটি occurred');
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`আপনি কি নিশ্চিত যে আপনি ব্যবহারকারী ${email} কে মুছে ফেলতে চান?`)) {
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
        alert(error.error || 'ব্যবহারকারী মুছতে ব্যর্থ হয়েছে');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('ব্যবহারকারী মুছতে ত্রুটি occurred');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isBanExpired = (banExpires: number | null) => {
    if (!banExpires) return false; // permanent ban
    return Date.now() > banExpires * 1000;
  };

  const getStatusColor = (user: User) => {
    if (user.banned && !isBanExpired(user.banExpires)) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (user.emailVerified) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusText = (user: User) => {
    if (user.banned && !isBanExpired(user.banExpires)) {
      return user.banExpires ? 'সাময়িক নিষিদ্ধ' : 'স্থায়ী নিষিদ্ধ';
    } else if (user.emailVerified) {
      return 'যাচাইকৃত';
    } else {
      return 'অযাচাইকৃত';
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-purple-100 text-purple-800 border-purple-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  return (
    <div className="overflow-hidden rounded-2xl shadow-lg border border-[#D1D8BE]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#819A91] to-[#A7C1A8]">
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#EEEFE0] uppercase tracking-wider">
                ব্যবহারকারী
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#EEEFE0] uppercase tracking-wider">
                ভূমিকা
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#EEEFE0] uppercase tracking-wider">
                কার্যক্রম
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#EEEFE0] uppercase tracking-wider">
                অবস্থা
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#EEEFE0] uppercase tracking-wider">
                যোগদান
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#EEEFE0] uppercase tracking-wider">
                কর্ম
              </th>
            </tr>
          </thead>
          <tbody className="bg-[#EEEFE0] divide-y divide-[#D1D8BE]">
            {users.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-[#D1D8BE] hover:bg-opacity-30 transition-all duration-300 group"
              >
                {/* User Info */}
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#2C4A3B] to-[#819A91] rounded-full flex items-center justify-center shadow-md">
                        <UserIcon className="h-5 w-5 text-[#EEEFE0]" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-[#2C4A3B] truncate">
                          {user.name || 'নাম নেই'}
                        </p>
                        {user.role === 'admin' && (
                          <Shield className="h-3 w-3 text-purple-600" />
                        )}
                      </div>
                      <div className="flex items-center mt-1 space-x-2 text-xs text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center mt-1 space-x-2 text-xs text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                    {user.role === 'admin' ? 'অ্যাডমিন' : 'ব্যবহারকারী'}
                  </span>
                </td>

                {/* Activities */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-[#2C4A3B]">
                      <ShoppingBag className="h-4 w-4" />
                      <span className="font-semibold">{user._count.orders}</span>
                      <span className="text-xs text-gray-600">অর্ডার</span>
                    </div>
                    <div className="flex items-center space-x-1 text-[#819A91]">
                      <Star className="h-4 w-4" />
                      <span className="font-semibold">{user._count.reviews}</span>
                      <span className="text-xs text-gray-600">রিভিউ</span>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user)}`}>
                    {getStatusText(user)}
                  </span>
                </td>

                {/* Join Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Calendar className="h-4 w-4 text-[#819A91]" />
                    <span>{formatDate(user.createdAt)}</span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {/* View Button */}
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-[#819A91] text-[#EEEFE0] hover:bg-[#2C4A3B] transition-all duration-300 group/action shadow-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    {/* Ban/Unban Button */}
                    {user.banned && !isBanExpired(user.banExpires) ? (
                      <button
                        onClick={() => handleUnbanUser(user.id)}
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all duration-300 group/action shadow-sm"
                        title="নিষেধাজ্ঞা তুলুন"
                      >
                        <ShieldOff className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const modal = document.getElementById('ban-modal') as HTMLDialogElement;
                          if (modal) {
                            modal.showModal();
                            modal.dataset.userId = user.id;
                            modal.dataset.userEmail = user.email;
                          }
                        }}
                        className="inline-flex items-center px-3 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-all duration-300 group/action shadow-sm"
                        title="নিষিদ্ধ করুন"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      className="inline-flex items-center px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-300 group/action shadow-sm"
                      title="মুছুন"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-12 bg-[#EEEFE0]">
          <div className="w-16 h-16 mx-auto bg-[#D1D8BE] rounded-full flex items-center justify-center mb-4">
            <UserIcon className="h-8 w-8 text-[#819A91]" />
          </div>
          <h3 className="text-lg font-semibold text-[#2C4A3B] mb-2">
            কোনো ব্যবহারকারী পাওয়া যায়নি
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            আপনার অনুসন্ধানের সাথে মিলছে এমন কোনো ব্যবহারকারী নেই। অনুগ্রহ করে বিভিন্ন ফিল্টার চেষ্টা করুন।
          </p>
        </div>
      )}

      {/* Ban Modal */}
      <dialog id="ban-modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-[#EEEFE0] border border-[#D1D8BE] shadow-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-[#819A91] hover:text-[#2C4A3B]">
              ✕
            </button>
          </form>
          
          <h3 className="font-bold text-lg text-[#2C4A3B] mb-2 flex items-center">
            <Ban className="h-5 w-5 mr-2 text-yellow-600" />
            ব্যবহারকারী নিষিদ্ধ করুন
          </h3>
          
          <div className="py-4 space-y-4">
            <div>
              <label className="label">
                <span className="label-text text-[#2C4A3B] font-medium">নিষিদ্ধ করার কারণ</span>
              </label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="ব্যবহারকারী নিষিদ্ধ করার কারণ লিখুন..."
                className="textarea textarea-bordered w-full bg-white border-[#D1D8BE] focus:border-[#2C4A3B] focus:ring-2 focus:ring-[#2C4A3B] focus:ring-opacity-20"
                rows={3}
              />
            </div>
            
            <div>
              <label className="label">
                <span className="label-text text-[#2C4A3B] font-medium">নিষেধাজ্ঞার সময়কাল</span>
              </label>
              <select
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                className="select select-bordered w-full bg-white border-[#D1D8BE] focus:border-[#2C4A3B] focus:ring-2 focus:ring-[#2C4A3B] focus:ring-opacity-20"
              >
                <option value="1">১ দিন</option>
                <option value="7">৭ দিন</option>
                <option value="30">৩০ দিন</option>
                <option value="90">৯০ দিন</option>
                <option value="365">১ বছর</option>
                <option value="permanent">স্থায়ী নিষেধাজ্ঞা</option>
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <div className="flex items-start space-x-2">
                <Ban className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">সতর্কতা</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    নিষিদ্ধ ব্যবহারকারী সিস্টেমে লগইন করতে বা নতুন অর্ডার দিতে পারবে না। 
                    বিদ্যমান অর্ডারগুলি প্রভাবিত হবে না।
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-action">
            <button
              className="btn btn-ghost text-[#819A91] hover:text-[#2C4A3B] hover:bg-[#D1D8BE] border-[#D1D8BE]"
              onClick={() => {
                const modal = document.getElementById('ban-modal') as HTMLDialogElement;
                modal.close();
              }}
            >
              বাতিল
            </button>
            <button
              className="btn bg-yellow-600 text-white hover:bg-yellow-700 border-yellow-600"
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
              <Ban className="h-4 w-4 mr-2" />
              নিষিদ্ধ করুন
            </button>
          </div>
        </div>
        
        {/* Backdrop */}
        <form method="dialog" className="modal-backbackdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}