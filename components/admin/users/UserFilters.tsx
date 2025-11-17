'use client';

interface UserFiltersProps {
  search: string;
  role: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onReset: () => void;
}

export default function UserFilters({
  search,
  role,
  onSearchChange,
  onRoleChange,
  onReset,
}: UserFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by email or name..."
            className="input input-bordered w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
            className="select select-bordered w-full"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="btn btn-outline w-full"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}