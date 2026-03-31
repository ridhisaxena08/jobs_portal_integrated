import { useState, useEffect } from 'react';
import api from '../services/api';

export const useProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getProfile();
      
      if (response.success) {
        setUser(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to load profile');
        return null;
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update profile using POST method
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.updateProfileDirect(profileData);
      
      if (response.success) {
        setUser(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to update profile');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update profile using PUT method (alternative)
  const updateProfilePut = async (profileData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.updateProfile(profileData);
      
      if (response.success) {
        setUser(response.data);
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to update profile');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update specific field directly
  const updateField = async (fieldName, value) => {
    const updateData = { [fieldName]: value };
    return await updateProfile(updateData);
  };

  // Upload profile picture
  const uploadProfilePicture = async (file) => {
    try {
      setLoading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.uploadProfilePicture(formData);
      
      if (response.success) {
        // Update user state with new profile picture
        if (user) {
          setUser({
            ...user,
            profile: {
              ...user.profile,
              profilePicture: response.data.profilePicture
            }
          });
        }
        return { success: true, data: response.data };
      } else {
        setError(response.message || 'Failed to upload profile picture');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.changePassword(passwordData);
      
      if (response.success) {
        return { success: true, message: 'Password changed successfully' };
      } else {
        setError(response.message || 'Failed to change password');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const deleteAccount = async (password) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.deleteAccount(password);
      
      if (response.success) {
        api.clearAuth();
        return { success: true, message: 'Account deleted successfully' };
      } else {
        setError(response.message || 'Failed to delete account');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError('');

  // Load profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    user,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateProfilePut,
    updateField,
    uploadProfilePicture,
    changePassword,
    deleteAccount,
    clearError
  };
};
