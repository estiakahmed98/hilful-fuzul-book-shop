'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface UserDetail {
  id: string;
  email: string;
  name: string | null;
  role: string;
  phone: string | null;
  address: any;
  banned: boolean | null;
  banReason: string | null;
  banExpires: number | null;
  note: string | null;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  orders: Array<{
    id: number;
    status: string;
    grandTotal: number;
    orderDate: Date;
  }>;
  _count: {
    orders: number;
    reviews: number;
    cart: number;
    wishlist: number;
  };
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'user',
    phone: '',
    note: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        if (response.ok) {
          const userData = await response.json();

          const normalizedUser: UserDetail = {
            ...userData,
            orders: (userData.orders ?? []).map((order: any) => ({
              id: order.id,
              status: order.status,
              grandTotal: Number(order.grand_total),
              orderDate: order.order_date,
            })),
          };

          setUser(normalizedUser);
          setFormData({
            name: userData.name || '',
            role: userData.role,
            phone: userData.phone || '',
            note: userData.note || '',
          });
        } else {
          console.error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchUser();
    }
  }, [params.id]);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        const normalizedUser: UserDetail = {
          ...updatedUser,
          orders: (updatedUser.orders ?? []).map((order: any) => ({
            id: order.id,
            status: order.status,
            grandTotal: Number(order.grand_total),
            orderDate: order.order_date,
          })),
        };

        setUser(normalizedUser);
        setEditing(false);
      } else {
        alert('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user');
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading user details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="alert alert-error">
            <span>User not found</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div>
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="btn btn-ghost mb-4"
          >
            ← Back to Users
          </button>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn btn-outline btn-sm"
                >
                  {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="input input-bordered w-full bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!editing}
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    disabled={!editing}
                    className="select select-bordered w-full"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!editing}
                    className="input input-bordered w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                    disabled={!editing}
                    className="textarea textarea-bordered w-full"
                    rows={3}
                  />
                </div>

                {editing && (
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      onClick={() => setEditing(false)}
                      className="btn btn-ghost"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
              {user.orders.length === 0 ? (
                <p className="text-gray-500">No orders found</p>
              ) : (
                <div className="space-y-3">
                  {user.orders.map((order) => (
                    <div key={order.id} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                      <div>
                        <div className="font-medium">Order #{order.id}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(order.orderDate)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${order.grandTotal}</div>
                        <span className={`badge ${
                          order.status === 'DELIVERED' ? 'badge-success' :
                          order.status === 'CANCELLED' ? 'badge-error' :
                          'badge-warning'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">User Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Orders</span>
                  <span className="font-medium">{user._count.orders}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reviews</span>
                  <span className="font-medium">{user._count.reviews}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cart Items</span>
                  <span className="font-medium">{user._count.cart}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wishlist Items</span>
                  <span className="font-medium">{user._count.wishlist}</span>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="font-semibold mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Email Verified</span>
                  <span className={user.emailVerified ? 'text-success' : 'text-warning'}>
                    {user.emailVerified ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Banned</span>
                  <span className={user.banned ? 'text-error' : 'text-success'}>
                    {user.banned ? 'Yes' : 'No'}
                  </span>
                </div>
                {user.banned && user.banReason && (
                  <div>
                    <span className="text-sm text-gray-600">Ban Reason:</span>
                    <p className="text-sm mt-1">{user.banReason}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Member Since</span>
                  <span className="text-sm">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated</span>
                  <span className="text-sm">{formatDate(user.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}