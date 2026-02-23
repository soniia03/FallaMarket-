import { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { Traje, TrajeFormData, UseTrajesReturn, ApiResponse } from '../types';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1';


export const useTrajes = (): UseTrajesReturn => {
  const [trajes, setTrajes] = useState<Traje[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchTrajes = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<Traje[]>>(`${API_BASE_URL}/trajes/`);
      if (response.data.status) {
        setTrajes(response.data.status as Traje[]);
      }
    } catch (err) {
      const errorMessage = (err as AxiosError).message;
      setError(errorMessage);
      console.error('Error fetching trajes:', err);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchTrajes();
  }, [fetchTrajes]);


  const createTraje = useCallback(async (trajeData: TrajeFormData): Promise<Traje | undefined> => {
    try {
      const response = await axios.post<ApiResponse<Traje>>(`${API_BASE_URL}/trajes/anadir`, trajeData);
      if (response.data.status === 'Traje agregado correctamente') {
        await fetchTrajes(); // Refresh the list
        return response.data.data;
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      throw new Error(error.response?.data?.status || error.message);
    }
  }, [fetchTrajes]);


  const updateTraje = useCallback(async (id: string, trajeData: TrajeFormData): Promise<Traje | undefined> => {
    try {
      const response = await axios.put<ApiResponse<Traje>>(`${API_BASE_URL}/trajes/editar/${id}`, trajeData);
      if (response.data.status === 'Traje actualizado correctamente') {
        await fetchTrajes(); // Refresh the list
        return response.data.data;
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      throw new Error(error.response?.data?.status || error.message);
    }
  }, [fetchTrajes]);


  const deleteTraje = useCallback(async (id: string): Promise<boolean | undefined> => {
    try {
      const response = await axios.delete<ApiResponse<any>>(`${API_BASE_URL}/trajes/eliminar/${id}`);
      if (response.data.status === 'Traje eliminado correctamente') {
        await fetchTrajes(); // Refresh the list
        return true;
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      throw new Error(error.response?.data?.status || error.message);
    }
  }, [fetchTrajes]);


  const getTrajeById = useCallback(async (id: string): Promise<Traje | undefined> => {
    try {
      const response = await axios.get<ApiResponse<Traje>>(`${API_BASE_URL}/trajes/traje/${id}`);
      if (response.data.status === 'Traje encontrado correctamente') {
        return response.data.data;
      }
    } catch (err) {
      const error = err as AxiosError<ApiResponse<any>>;
      throw new Error(error.response?.data?.status || error.message);
    }
  }, []);


  return {
    trajes,
    loading,
    error,
    createTraje,
    updateTraje,
    deleteTraje,
    getTrajeById,
    refetch: fetchTrajes
  };
};
