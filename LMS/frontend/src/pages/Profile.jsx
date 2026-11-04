import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">My Profile</h1>

      <div className="bg-white border rounded-xl p-8 mt-8 max-w-xl">
        <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-3xl font-bold">
          {user?.name?.charAt(0)}
        </div>

        <h2 className="text-2xl font-bold mt-5">{user?.name}</h2>
        <p className="text-gray-500 mt-2">{user?.email}</p>

        <span className="inline-block bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full mt-4 capitalize">
          {user?.role}
        </span>
      </div>
    </DashboardLayout>
  );
}
