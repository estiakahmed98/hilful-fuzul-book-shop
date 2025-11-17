"use client";

import { useState, useEffect } from "react";
import UserTable from "@/components/admin/users/UserTable";
import UserFilters from "@/components/admin/users/UserFilters";
import Pagination from "@/components/admin/users/Pagination";
import { Users, Loader2, AlertCircle, RefreshCw } from "lucide-react";

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
    search: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.role && { role: filters.role }),
      });

      const response = await fetch(`/api/users?${params}`);

      if (!response.ok) {
        throw new Error("ব্যবহারকারী ডেটা লোড করতে ব্যর্থ হয়েছে");
      }

      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "ব্যবহারকারী ডেটা লোড করতে ত্রুটি হয়েছে"
      );
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, filters]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRoleChange = (role: string) => {
    setFilters((prev) => ({ ...prev, role }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ search: "", role: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRefresh = () => {
    fetchUsers(true);
  };

  const handleUserUpdate = (userId: string, updates: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, ...updates } : user))
    );
  };

  const handleUserDelete = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEEFE0] to-[#F5F6E9] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#2C4A3B] to-[#819A91] rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-[#EEEFE0]" />
              </div>
              <div className="absolute -inset-2 bg-[#819A91] rounded-2xl opacity-20 animate-pulse"></div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-xl font-semibold text-[#2C4A3B]">
                ব্যবহারকারী লোড হচ্ছে...
              </div>
              <div className="text-[#819A91] text-sm">
                অনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন
              </div>
            </div>
            <Loader2 className="h-6 w-6 text-[#819A91] animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfdfd] to-[#eeffe8] p-4 sm:p-6">
      <div>
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#2C4A3B] to-[#819A91] rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="h-6 w-6 text-[#EEEFE0]" />
                </div>
                <div className="absolute -inset-1 bg-[#819A91] rounded-xl opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4A3B]">
                  ব্যবহারকারী ব্যবস্থাপনা
                </h1>
                <p className="text-[#819A91] mt-1">
                  আপনার ব্যবহারকারীদের পরিচালনা করুন, তাদের কার্যকলাপ দেখুন এবং
                  অ্যাকাউন্ট মডারেট করুন
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-[#D1D8BE] text-[#819A91] hover:bg-[#819A91] hover:text-[#EEEFE0] hover:border-[#819A91] transition-all duration-300 shadow-sm font-medium self-start sm:self-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>{refreshing ? "রিফ্রেশ হচ্ছে..." : "রিফ্রেশ"}</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-600 hover:text-red-800 transition-colors duration-200 p-1 rounded-lg hover:bg-red-100"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <UserFilters
          search={filters.search}
          role={filters.role}
          onSearchChange={handleSearchChange}
          onRoleChange={handleRoleChange}
          onReset={handleResetFilters}
        />

        {/* Stats Footer */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-xl border border-[#D1D8BE] shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-[#819A91]">মোট ব্যবহারকারী</p>
                <p className="text-lg font-semibold text-[#2C4A3B]">
                  {pagination.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D1D8BE] shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-[#819A91]">সক্রিয় ব্যবহারকারী</p>
                <p className="text-lg font-semibold text-[#2C4A3B]">
                  {
                    users.filter(
                      (u) =>
                        !u.banned ||
                        (u.banExpires && Date.now() > u.banExpires * 1000)
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#D1D8BE] shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-[#819A91]">অ্যাডমিন ব্যবহারকারী</p>
                <p className="text-lg font-semibold text-[#2C4A3B]">
                  {users.filter((u) => u.role === "admin").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#D1D8BE] overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-[#D1D8BE] bg-gradient-to-r from-[#EEEFE0] to-[#F5F6E9]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[#2C4A3B] flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>ব্যবহারকারী তালিকা</span>
                </h2>
                <p className="text-[#819A91] text-sm mt-1">
                  মোট {pagination.total} জন ব্যবহারকারী পাওয়া গেছে
                </p>
              </div>

              <div className="flex items-center space-x-4 text-sm">
                <div className="bg-white px-3 py-2 rounded-lg border border-[#D1D8BE] shadow-sm">
                  <span className="text-[#2C4A3B] font-medium">পৃষ্ঠা </span>
                  <span className="text-[#819A91]">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                </div>

                {/* Results per page */}
                <select
                  value={pagination.limit}
                  onChange={(e) =>
                    setPagination((prev) => ({
                      ...prev,
                      limit: parseInt(e.target.value),
                      page: 1,
                    }))
                  }
                  className="px-3 py-2 rounded-lg border border-[#D1D8BE] bg-white text-[#2C4A3B] focus:outline-none focus:ring-2 focus:ring-[#2C4A3B] focus:border-transparent text-sm"
                >
                  <option value="10">১০ প্রতি পৃষ্ঠা</option>
                  <option value="25">২৫ প্রতি পৃষ্ঠা</option>
                  <option value="50">৫০ প্রতি পৃষ্ঠা</option>
                  <option value="100">১০০ প্রতি পৃষ্ঠা</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto bg-[#D1D8BE] bg-opacity-30 rounded-full flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-[#819A91]" />
              </div>
              <h3 className="text-lg font-semibold text-[#2C4A3B] mb-2">
                কোনো ব্যবহারকারী পাওয়া যায়নি
              </h3>
              <p className="text-[#819A91] max-w-md mx-auto mb-6">
                {filters.search || filters.role
                  ? "আপনার বর্তমান ফিল্টারের সাথে মিলছে এমন কোনো ব্যবহারকারী নেই। অনুগ্রহ করে বিভিন্ন ফিল্টার চেষ্টা করুন।"
                  : "এখনও কোনো ব্যবহারকারী রেজিস্ট্রেশন করেননি।"}
              </p>
              {(filters.search || filters.role) && (
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2 rounded-xl bg-[#819A91] text-[#EEEFE0] hover:bg-[#2C4A3B] transition-all duration-300 font-medium"
                >
                  সব ফিল্টার সরান
                </button>
              )}
            </div>
          ) : (
            <>
              <UserTable
                users={users}
                onUserUpdate={handleUserUpdate}
                onUserDelete={handleUserDelete}
              />

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="p-6 border-t border-[#D1D8BE] bg-[#EEEFE0] bg-opacity-50">
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
