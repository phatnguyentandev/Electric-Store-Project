import React, { useState, useEffect } from 'react';
import SideNav from '../SideNav';
import UserTable from './UserTable'; // Ensure this component exists
import UserForm from './UserForm';
import clientAPI from '../../../client-api/rest-client';

const UserManagement = () => {
  const [isOpen, setIsOpen] = useState(true); 
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientAPI.service('user').find();
      setUsers(response.data);
      setSelectedUser(null); // Reset selected user after refreshing
    } catch (error) {
      console.error('Cannot fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="flex h-screen">
      <SideNav />
      <div className={`flex-1 h-full overflow-auto px-2 ${isOpen ? 'ml-1/5' : 'ml-1/6'}`}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading users...</p>
            {/* You can replace this text with a loading spinner or animation */}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <UserTable users={users} onUserSelect={setSelectedUser} />
            <UserForm selectedUser={selectedUser} onRefresh={refreshUsers} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
