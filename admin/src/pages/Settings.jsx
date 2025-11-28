import React, { useState, useEffect } from 'react';
import { 
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Shield,
  Bell,
  Palette
} from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { admin, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);

  useEffect(() => {
    if (admin) {
      setProfileData({
        name: admin.name || '',
        email: admin.email || ''
      });
      setLoading(false);
    }
  }, [admin]);

  const validateProfile = () => {
    const errors = {};
    
    if (!profileData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword.trim()) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) return;
    
    setSubmittingProfile(true);
    setProfileSuccess('');
    
    try {
      await authAPI.updateProfile({
        name: profileData.name,
        email: profileData.email
      });
      
      setProfileSuccess('Profile updated successfully!');
      // Refresh admin data by re-fetching profile
      const response = await authAPI.getProfile();
      // Update context with new data if needed
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      setProfileErrors({ submit: message });
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;
    
    setSubmittingPassword(true);
    setPasswordSuccess('');
    
    try {
      await authAPI.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      setPasswordErrors({ submit: message });
    } finally {
      setSubmittingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      logout(); // Force logout even if API call fails
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Settings</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 transition-colors glow"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 soft-gradient glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
              <p className="text-sm text-gray-500">Update your personal details</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
              {profileErrors.name && (
                <p className="text-red-500 text-sm mt-1">{profileErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email address"
              />
              {profileErrors.email && (
                <p className="text-red-500 text-sm mt-1">{profileErrors.email}</p>
              )}
            </div>

            {profileSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {profileSuccess}
              </div>
            )}

            {profileErrors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {profileErrors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={submittingProfile}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Save size={18} />
              {submittingProfile ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Password Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 soft-gradient glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lock className="text-green-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
              <p className="text-sm text-gray-500">Update your login password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {passwordSuccess}
              </div>
            )}

            {passwordErrors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {passwordErrors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={submittingPassword}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <Lock size={18} />
              {submittingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Additional Settings Cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 soft-gradient glow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="text-purple-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Security</h2>
              <p className="text-sm text-gray-500">Manage security preferences</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">Two-factor authentication</span>
              <button className="text-blue-600 text-sm hover:text-blue-800">
                Enable
              </button>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">Session management</span>
              <button className="text-blue-600 text-sm hover:text-blue-800">
                View active sessions
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell className="text-orange-600" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
              <p className="text-sm text-gray-500">Configure notification preferences</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">Email notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">Order alerts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8 soft-gradient glow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Admin ID:</span>
            <span className="text-gray-800 ml-2">{admin?._id || 'N/A'}</span>
          </div>
          <div>
            <span className="text-gray-500">Role:</span>
            <span className="text-gray-800 ml-2">Administrator</span>
          </div>
          <div>
            <span className="text-gray-500">Last Login:</span>
            <span className="text-gray-800 ml-2">
              {admin?.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
