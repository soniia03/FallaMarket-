import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { User, UserFormData, UseUsersReturn, Product } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

interface UserApiResponse {
  success: boolean;
  data?: User | User[] | Product[];
  message?: string;
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<UserApiResponse>(`${API_BASE_URL}/users/get/all`);
      if (response.data.success) {
        setUsers(response.data.data as User[]);
      }
    } catch (err) {
      const errorMessage = (err as AxiosError).message;
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userData: UserFormData): Promise<User | undefined> => {
    try {
      const response = await axios.post<UserApiResponse>(`${API_BASE_URL}/users/post`, userData);
      if (response.data.success) {
        await fetchUsers(); // Refresh the list
        return response.data.data as User;
      }
    } catch (err) {
      const error = err as AxiosError<UserApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const updateUser = async (id: string, userData: UserFormData): Promise<User | undefined> => {
    try {
      const response = await axios.put<UserApiResponse>(`${API_BASE_URL}/users/update/${id}`, userData);
      if (response.data.success) {
        await fetchUsers(); // Refresh the list
        return response.data.data as User;
      }
    } catch (err) {
      const error = err as AxiosError<UserApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const deleteUser = async (id: string): Promise<boolean | undefined> => {
    try {
      const response = await axios.delete<UserApiResponse>(`${API_BASE_URL}/users/delete/${id}`);
      if (response.data.success) {
        await fetchUsers(); // Refresh the list
        return true;
      }
    } catch (err) {
      const error = err as AxiosError<UserApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const getUserById = async (id: string): Promise<User | undefined> => {
    try {
      const response = await axios.get<UserApiResponse>(`${API_BASE_URL}/users/get/${id}`);
      if (response.data.success) {
        return response.data.data as User;
      }
    } catch (err) {
      const error = err as AxiosError<UserApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const getUserByEmail = async (email: string): Promise<User | undefined> => {
    try {
      const response = await axios.get<UserApiResponse>(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`);
      if (response.data.success) {
        return response.data.data as User;
      }
    } catch (err) {
      const error = err as AxiosError<UserApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const getActiveUsers = async (): Promise<User[] | undefined> => {
    try {
      const response = await axios.get<UserApiResponse>(`${API_BASE_URL}/users/get/active`);
      if (response.data.success) {
        return response.data.data as User[];
      }
    } catch (err) {
      const error = err as AxiosError<UserApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const getUserProducts = async (id: string): Promise<Product[] | undefined> => {
    try {
      const response = await axios.get<UserApiResponse>(`${API_BASE_URL}/users/products/${id}`);
      if (response.data.success) {
        return response.data.data as Product[];
      }
    } catch (err) {
      const error = err as AxiosError<UserApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const deactivateUser = async (id: string): Promise<User | undefined> => {
    try {
      const response = await axios.patch<UserApiResponse>(`${API_BASE_URL}/users/deactivate/${id}`);
      if (response.data.success) {
        await fetchUsers(); // Refresh the list
        return response.data.data as User;
      }
    } catch (err) {
      const error = err as AxiosError<UserApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const reactivateUser = async (id: string): Promise<User | undefined> => {
    try {
      const response = await axios.patch<UserApiResponse>(`${API_BASE_URL}/users/reactivate/${id}`);
      if (response.data.success) {
        await fetchUsers(); // Refresh the list
        return response.data.data as User;
      }
    } catch (err) {
      const error = err as AxiosError<UserApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUserByEmail,
    getActiveUsers,
    getUserProducts,
    deactivateUser,
    reactivateUser,
    refetch: fetchUsers
  };
};