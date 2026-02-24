export interface Traje {
  _id: string;
  nombre: string;
  material: string;
  propietario: string;
  descripcion?: string;
  precio?: number;
  disponible: boolean;
  imagen?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrajeFormData {
  nombre: string;
  material: string;
  propietario: string;
  descripcion?: string;
  precio?: number;
  disponible: boolean;
  imagen?: string;
}

export interface ApiResponse<T> {
  status: string | T;
  data?: T;
  message?: string;
  pagination?: PaginationInfo;
}

// Información de paginación
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Respuesta paginada
export interface PaginatedApiResponse<T> {
  status: T;
  pagination: PaginationInfo;
}

export interface Stats {
  totalTrajes: number;
  materialesUnicos: number;
  propietariosUnicos: number;
}

export interface Material {
  key: string;
  label: string;
  icon: string;
  color: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  category?: string;
}

export interface UserFormData {
  name: string;
  email: string;
  role?: string;
}

export interface UseTrajesReturn {
  trajes: Traje[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  currentPage: number;
  itemsPerPage: number;
  createTraje: (trajeData: TrajeFormData) => Promise<Traje | undefined>;
  updateTraje: (id: string, trajeData: TrajeFormData) => Promise<Traje | undefined>;
  deleteTraje: (id: string) => Promise<boolean | undefined>;
  getTrajeById: (id: string) => Promise<Traje | undefined>;
  changePage: (page: number) => void;
  changeItemsPerPage: (limit: number) => void;
  refetch: () => Promise<void>;
}

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  createProduct: (productData: ProductFormData) => Promise<Product | undefined>;
  updateProduct: (id: string, productData: ProductFormData) => Promise<Product | undefined>;
  deleteProduct: (id: string) => Promise<boolean | undefined>;
  getProductById: (id: string) => Promise<Product | undefined>;
  searchProducts: (query: string) => Promise<Product[] | undefined>;
  getProductsByCategory: (category: string) => Promise<Product[] | undefined>;
  reserveProduct: (id: string) => Promise<Product | undefined>;
  markAsSold: (id: string) => Promise<Product | undefined>;
  refetch: () => Promise<void>;
}

export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  createUser: (userData: UserFormData) => Promise<User | undefined>;
  updateUser: (id: string, userData: UserFormData) => Promise<User | undefined>;
  deleteUser: (id: string) => Promise<boolean | undefined>;
  getUserById: (id: string) => Promise<User | undefined>;
  getUserByEmail: (email: string) => Promise<User | undefined>;
  getActiveUsers: () => Promise<User[] | undefined>;
  getUserProducts: (id: string) => Promise<Product[] | undefined>;
  deactivateUser: (id: string) => Promise<User | undefined>;
  reactivateUser: (id: string) => Promise<User | undefined>;
  refetch: () => Promise<void>;
}