import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await axios.get("http://localhost:3000/admin/bookings");
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load booking requests");
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
     
      await axios.put(`http://localhost:3000/admin/bookings/${bookingId}`, {
        status
      });
      
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? {...booking, status} : booking
      ));
    } catch (err) {
      console.error("Error updating booking:", err);
      alert("Failed to update booking status");
    }
  };

  const filteredBookings = bookings.filter(booking => booking.status === activeTab);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 flex justify-center items-center h-screen">Error: {error}</div>;

  return (
    <div className="container mx-auto pt-24 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${activeTab === 'pending' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Requests
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'approved' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('approved')}
          >
            Approved
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'rejected' ? 'border-b-2 border-blue-500 font-bold' : 'text-gray-500'}`}
            onClick={() => setActiveTab('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No {activeTab} booking requests found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Asset</th>
                <th className="py-2 px-4 border-b text-left">User</th>
                <th className="py-2 px-4 border-b text-left">Start Time</th>
                <th className="py-2 px-4 border-b text-left">End Time</th>
                <th className="py-2 px-4 border-b text-left">Requested On</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{booking.asset_name}</td>
                  <td className="py-2 px-4 border-b">{booking.user_name}</td>
                  <td className="py-2 px-4 border-b">{new Date(booking.start_time).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{new Date(booking.end_time).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">{new Date(booking.created_at).toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">
                    {booking.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(booking.id, 'approved')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'rejected')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {booking.status === 'approved' && (
                      <span className="text-green-600 font-medium">Approved</span>
                    )}
                    {booking.status === 'rejected' && (
                      <span className="text-red-600 font-medium">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;