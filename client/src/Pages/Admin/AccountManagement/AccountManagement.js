import React, { useState, useEffect } from 'react';
import SideNav from '../SideNav';
import AccountTable from './AccountTable'; // Ensure this component exists
import AccountForm from './AccountForm';
import clientAPI from '../../../client-api/rest-client';

const AccountManagement = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientAPI.service('account').find();
      setAccounts(response.data);
      setSelectedAccount(null); // Reset selected account after refreshing
    } catch (error) {
      console.error('Unable to fetch accounts:', error);
      setError('Unable to load accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAccounts();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="flex h-screen">
      <SideNav />
      <div className="flex-1 p-4 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading accounts...</p>
            {/* You could add a spinner here for a smoother experience */}
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4">
            <AccountTable accounts={accounts} onAccountSelect={setSelectedAccount} />
            <AccountForm selectedAccount={selectedAccount} onRefresh={refreshAccounts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;
