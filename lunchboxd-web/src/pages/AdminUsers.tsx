import { useEffect, useState } from "react";
import { AdminLayout } from "../layouts/AdminLayout";
import { DetailInspectionModal } from "../components/AdminDetailModal";
import type { User, Review } from "../types/types";

export function AdminUsers() {
  const [userList, setUserList] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Load users from mock backend
    const loadUsers = async () => {
      try {
        const response = await fetch("/mock-backend/users.json");
        const allUsers = await response.json();
        const filteredUsers = (allUsers as User[]).filter(
          (u) => u.role !== "admin",
        );
        setUserList(filteredUsers);
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };
    loadUsers();
  }, []);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    // In a real app, you'd fetch reviews for this user from the backend
    setUserReviews([
      {
        id: "rev_1",
        restaurantId: "1",
        userId: user.id,
        rating: 4,
        comment: "Great food and friendly service!",
        createdAt: new Date().toISOString(),
      },
    ]);
    setIsModalOpen(true);
  };

  const filteredUsers = userList.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Users</h1>
            <p className="text-slate-600 mt-1">
              Manage all registered users ({filteredUsers.length})
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <input
            type="text"
            placeholder="Search by name, email, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Users Table */}
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 hidden md:table-cell">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 hidden lg:table-cell">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-slate-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar && (
                          <img
                            src={user.avatar}
                            alt={user.firstName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-slate-600">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 hidden sm:table-cell">
                      <p className="text-sm">{user.email}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700 hidden md:table-cell">
                      <p className="text-sm">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleUserClick(user)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-600">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <DetailInspectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        type="user"
        data={selectedUser}
        reviews={userReviews}
      />
    </AdminLayout>
  );
}
