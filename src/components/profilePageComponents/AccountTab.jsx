import {useAuth} from '../../hooks/useAuth';
import axiosInstance from '../../api/axios';
import {useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Message = ({ msg }) => {
  if (!msg?.text) return null;

  return (
    <p
      className={`text-sm font-semibold ${
        msg.type === 'success' ? 'text-emerald-600' : 'text-red-500'
      }`}
    >
      {msg.text}
    </p>
  );
};

const AccountTab = () => {
    const {user ,setUser} = useAuth(); //setting currently loggegin user's data into user
    const navigate = useNavigate(); 


    const [info , setInfo] = useState({name :user?.name || '' , email : user?.email || ''}); // object state
    const [password , setPassword] = useState({currentPassword : '' , newPassword : '' , confirmNewPassword : ''});
    const [ infoMsg , setInfoMsg] = useState(null);
    const [ passwordMsg , setPasswordMsg] = useState(null);
    const [deleteConfirm , setDeleteConfirm] = useState(false); //boolean state

    const handleUpdateInfo = async () => {
        try {
            const res = await axiosInstance.patch('/users/updateUser' , info); //{{URL}}/api/v1/users/login
            //here info === req.body and 'info' re rendered from input feilds
        const updatedUser = res?.data?.data?.doc || res?.data?.data?.user;
        if (updatedUser) {
          setUser(updatedUser);
        }
            setInfoMsg({type : 'success', text :'Profile updated successfully!'});
        } catch {
            setInfoMsg({type : 'error', text :'Failed to update profile.'});
        }
    };


    const handleUpdatePassword = async () => {
      if (!password.currentPassword || !password.newPassword || !password.confirmNewPassword) {
        setPasswordMsg({ type: 'error', text: 'Please fill in all password fields.' });
        return;
      }

      if(password.currentPassword === password.newPassword) {
        setPasswordMsg({type : 'error', text :'New password cannot be the same as current password.'});
        return;
      }

      if (password.newPassword !== password.confirmNewPassword) {
        setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        try {
            const payload = {
              currentPassword: password.currentPassword,
              newPassword: password.newPassword,
              newPasswordConfirm: password.confirmNewPassword,
            };

            await axiosInstance.patch('/users/updatePassword' , payload);

            try {
              const meRes = await axiosInstance.get('/users/me');
              const freshUser = meRes?.data?.data?.doc || meRes?.data?.data?.user;
              if (freshUser) {
                setUser(freshUser);
              }
            } catch {
              // keep current user state if /me fails after password change
            }

            setPasswordMsg({type : 'success', text :'Password updated successfully!'});
            setPassword({currentPassword : '' , newPassword : '' , confirmNewPassword : ''});
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to update password. Please try again.';
            setPasswordMsg({type : 'error', text : message});
        }
};


      const handleDeleteAccount = async () => {
        try {
            await axiosInstance.delete('/users/deleteUser');
            setUser(null);
            navigate('/');
        } catch {
          alert('Delete failed.');
        }
};

  
return (
    <div className="space-y-8">

     
      <div id="account-info" className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-xl font-bold text-emerald-600 mb-4">Update Info</h3>  {/* Update Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={info.name}
              onChange={(e) => setInfo({ ...info, name: e.target.value })} // only name updates from user input and other info remains same 
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-emerald-400 transition text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => setInfo({ ...info, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-emerald-400 transition text-gray-700"
            />
          </div>
          <button
            onClick={handleUpdateInfo}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition shadow-md"
          >
            Save Changes
          </button>
          <Message msg={infoMsg} />
        </div>
      </div>

      
      <div id="account-password" className="bg-white rounded-2xl shadow p-6">  {/* Change Password */}
        <h3 className="text-xl font-bold text-emerald-600 mb-4">Change Password</h3>
        <div className="space-y-4">
          {[
            { key: 'currentPassword', label: 'Current Password' },
            { key: 'newPassword', label: 'New Password' },
            { key: 'confirmNewPassword', label: 'Confirm New Password' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
              <input
                type="password"
                value={password[key]}
                onChange={(e) => setPassword({ ...password, [key]: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-emerald-400 transition text-gray-700"
              />
            </div>
          ))}
          <button
            onClick={handleUpdatePassword}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition shadow-md"
          >
            Update Password
          </button>
          <Message msg={passwordMsg} />
        </div>
      </div>

      
      <div className="bg-white rounded-2xl shadow p-6 border-2 border-red-100"> {/* Delete Account */}
        <h3 className="text-xl font-bold text-red-500 mb-2">Delete Account</h3>
        <p className="text-gray-500 text-sm mb-4">Bro are you sure ??.</p>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition shadow-md"
          >
            Delete My Account
          </button>
        ) : (
          <div className="flex gap-3 items-center">
            <p className="text-red-500 font-semibold text-sm">Are you sure?</p>
            <button
              onClick={handleDeleteAccount}
              className="px-5 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition"
            >
              Yes, Delete
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="px-5 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountTab;

