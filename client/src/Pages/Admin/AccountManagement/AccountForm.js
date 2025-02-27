import React, { useState, useEffect } from 'react';
import clientAPI from '../../../client-api/rest-client'; // Ensure the path is correct

const AccountForm = ({ selectedAccount, onRefresh }) => {
  const [account, setAccount] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'Active',
    idCompany: '', // Single company selection for combobox
  });
  const [error, setError] = useState('');
  const [companies, setCompanies] = useState([]); // Array to store available companies

  // Fetch the list of companies when the component mounts
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await clientAPI.service('expressCompany').find(); // API endpoint to get companies
        setCompanies(response.data); // Assuming the response contains an array of companies
      } catch (error) {
        setError('Không thể tải danh sách công ty!');
      }
    };

    fetchCompanies();

    if (selectedAccount) {
      setAccount({
        username: selectedAccount.username,
        email: selectedAccount.email,
        password: '', // Do not display password
        role: selectedAccount.role,
        status: selectedAccount.isActive ? 'Active' : 'Inactive',
        idCompany: selectedAccount.idCompany || '', // Single company for combobox
      });
    } else {
      resetForm();
    }
  }, [selectedAccount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((prevAccount) => ({
      ...prevAccount,
      [name]: value,
    }));
    setError('');
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    if (!account.username || !account.email || !account.password || !account.role || !account.status) {
      setError('Vui lòng điền đầy đủ thông tin tài khoản!');
      return;
    }

    // Chuẩn bị dữ liệu để gửi lên server
    const formData = {
      username: account.username,
      email: account.email,
      password: account.password,
      role: account.role,
      isActive: account.status === 'Active',
      idCompany: account.role === 'staff' ? account.idCompany : undefined, // Chỉ gửi công ty khi là staff
    };

    try {
      console.log(formData);
      const response = await clientAPI.service('account').create(formData);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      setError('Có lỗi xảy ra khi thêm tài khoản!');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Check required fields
    if (!account.username || !account.role || !account.status) {
      setError('Vui lòng điền đầy đủ thông tin tài khoản!');
      return;
    }

    const formData = {
      username: account.username,
      role: account.role,
      isActive: account.status === 'Active',
      idCompany: account.role === 'staff' ? account.idCompany : undefined,
    };

    if (account.password) {
      formData.password = account.password;
    }

    try {
      await clientAPI.service('account').patch(selectedAccount._id, formData);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật tài khoản!');
    }
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;
    try {
      await clientAPI.service('account').remove(selectedAccount._id);
      resetForm();
      if (onRefresh) onRefresh();
    } catch (error) {
      setError('Có lỗi xảy ra khi xóa tài khoản!');
    }
  };

  const resetForm = () => {
    setAccount({
      username: '',
      email: '',
      password: '',
      role: 'user',
      status: 'Active',
      idCompany: '', // Reset to empty for combobox
    });
    setError('');
  };

  return (
    <div className="account-form p-4 bg-white border ml-4 h-full flex flex-col">
      {error && <p className="text-red-500">{error}</p>}

      <form className="flex-grow">
        {[ 
          { label: 'Tài khoản', type: 'text', name: 'username' },
          { label: 'Email', type: 'email', name: 'email', disabled: !!selectedAccount },
          { label: 'Mật khẩu', type: 'password', name: 'password', disabled: !!selectedAccount },
          { label: 'Quyền', type: 'select', name: 'role', disabled: !!selectedAccount, options: [{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }, { value: 'staff', label: 'Staff' }] },
          { label: 'Trạng thái', type: 'select', name: 'status', options: [{ value: 'Active', label: 'Active' }, { value: 'Inactive', label: 'Inactive' }] },
        ].map(({ label, type, options, disabled, ...inputProps }, index) => (
          <div key={index} className="mb-3">
            <label className="block mb-1 text-sm font-medium">{label}</label>
            {type === 'select' ? (
              <select
                {...inputProps}
                className="border py-1 px-2 w-full text-sm rounded-md"
                onChange={handleChange}
                value={account[inputProps.name] || ''}
                disabled={disabled}
              >
                <option value="">{`Chọn ${label.toLowerCase()}`}</option>
                {options?.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                {...inputProps}
                value={account[inputProps.name] || ''}
                onChange={handleChange}
                className="border py-1 px-2 w-full text-sm rounded-md"
                disabled={disabled}
              />
            )}
          </div>
        ))}

        {account.role === 'staff' && (
          <div className="mb-3">
            <label className="block mb-1 text-sm font-medium">Công ty</label>
            <select
              name="idCompany"
              onChange={handleChange}
              value={account.idCompany || ''}
              className="border py-1 px-2 w-full text-sm rounded-md"
            >
              <option value="">{`Chọn công ty`}</option>
              {companies.map((company) => (
                <option key={company.idCompany} value={company.idCompany}>
                  {company.nameOfCompany}
                </option>
              ))}
            </select>
          </div>
        )}
      </form>

      <div className="flex space-x-3 mt-4">
      <button
        type="button"
        onClick={handleCreate}
        className={`bg-yellow-500 text-white px-3 py-1 text-sm rounded-md ${selectedAccount ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!!selectedAccount}
      >
        Thêm
      </button>
        <button
          type="button"
          onClick={handleUpdate}
          className={`bg-green-500 text-white px-3 py-1 text-sm rounded-md ${!selectedAccount ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!selectedAccount}
        >
          Sửa
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className={`bg-red-500 text-white px-3 py-1 text-sm rounded-md ${!selectedAccount ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!selectedAccount}
        >
          Xóa
        </button>
        <button
          type="button"
          onClick={() => { resetForm(); if (onRefresh) onRefresh(); }}
          className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md"
        >
          Làm mới
        </button>
      </div>
    </div>
  );
};

export default AccountForm;
