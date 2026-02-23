import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Product, ProductFormData, UseProductsReturn } from '../types';

const API_BASE_URL = 'http://localhost:3000/api/v1';

interface ProductApiResponse {
  success: boolean;
  data?: Product | Product[];
  message?: string;
}

export const useProducts = (): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<ProductApiResponse>(`${API_BASE_URL}/products/get/all`);
      if (response.data.success) {
        setProducts(response.data.data as Product[]);
      }
    } catch (err) {
      const errorMessage = (err as AxiosError).message;
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (productData: ProductFormData): Promise<Product | undefined> => {
    try {
      const response = await axios.post<ProductApiResponse>(`${API_BASE_URL}/products/post`, productData);
      if (response.data.success) {
        await fetchProducts(); // Refresh the list
        return response.data.data as Product;
      }
    } catch (err) {
      const error = err as AxiosError<ProductApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const updateProduct = async (id: string, productData: ProductFormData): Promise<Product | undefined> => {
    try {
      const response = await axios.put<ProductApiResponse>(`${API_BASE_URL}/products/update/${id}`, productData);
      if (response.data.success) {
        await fetchProducts(); // Refresh the list
        return response.data.data as Product;
      }
    } catch (err) {
      const error = err as AxiosError<ProductApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const deleteProduct = async (id: string): Promise<boolean | undefined> => {
    try {
      const response = await axios.delete<ProductApiResponse>(`${API_BASE_URL}/products/delete/${id}`);
      if (response.data.success) {
        await fetchProducts(); // Refresh the list
        return true;
      }
    } catch (err) {
      const error = err as AxiosError<ProductApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const getProductById = async (id: string): Promise<Product | undefined> => {
    try {
      const response = await axios.get<ProductApiResponse>(`${API_BASE_URL}/products/get/${id}`);
      if (response.data.success) {
        return response.data.data as Product;
      }
    } catch (err) {
      const error = err as AxiosError<ProductApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const searchProducts = async (query: string): Promise<Product[] | undefined> => {
    try {
      const response = await axios.get<ProductApiResponse>(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
      if (response.data.success) {
        return response.data.data as Product[];
      }
    } catch (err) {
      const error = err as AxiosError<ProductApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const getProductsByCategory = async (category: string): Promise<Product[] | undefined> => {
    try {
      const response = await axios.get<ProductApiResponse>(`${API_BASE_URL}/products/category/${category}`);
      if (response.data.success) {
        return response.data.data as Product[];
      }
    } catch (err) {
      const error = err as AxiosError<ProductApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const reserveProduct = async (id: string): Promise<Product | undefined> => {
    try {
      const response = await axios.patch<ProductApiResponse>(`${API_BASE_URL}/products/reserve/${id}`);
      if (response.data.success) {
        await fetchProducts(); // Refresh the list
        return response.data.data as Product;
      }
    } catch (err) {
      const error = err as AxiosError<ProductApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const markAsSold = async (id: string): Promise<Product | undefined> => {
    try {
      const response = await axios.patch<ProductApiResponse>(`${API_BASE_URL}/products/sold/${id}`);
      if (response.data.success) {
        await fetchProducts(); // Refresh the list
        return response.data.data as Product;
      }
    } catch (err) {
      const error = err as AxiosError<ProductApiResponse>;
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    searchProducts,
    getProductsByCategory,
    reserveProduct,
    markAsSold,
    refetch: fetchProducts
  };
};