import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Traje, User, Product } from '../types';

// Tipos del estado global
interface AppState {
  trajes: Traje[];
  users: User[];
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Tipos de acciones
type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRAJES'; payload: Traje[] }
  | { type: 'ADD_TRAJE'; payload: Traje }
  | { type: 'UPDATE_TRAJE'; payload: { id: string; traje: Traje } }
  | { type: 'DELETE_TRAJE'; payload: string }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: { id: string; user: User } }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; product: Product } }
  | { type: 'DELETE_PRODUCT'; payload: string };

// Estado inicial
const initialState: AppState = {
  trajes: [],
  users: [],
  products: [],
  loading: false,
  error: null
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_TRAJES':
      return { ...state, trajes: action.payload };
    
    case 'ADD_TRAJE':
      return { ...state, trajes: [...state.trajes, action.payload] };
    
    case 'UPDATE_TRAJE':
      return {
        ...state,
        trajes: state.trajes.map(traje => 
          traje._id === action.payload.id ? action.payload.traje : traje
        )
      };
    
    case 'DELETE_TRAJE':
      return {
        ...state,
        trajes: state.trajes.filter(traje => traje._id !== action.payload)
      };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user._id === action.payload.id ? action.payload.user : user
        )
      };
    
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product => 
          product._id === action.payload.id ? action.payload.product : product
        )
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product._id !== action.payload)
      };
    
    default:
      return state;
  }
};

// Contexto
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook para usar el contexto
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Provider del contexto
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Acciones helper para facilitar el uso
export const appActions = {
  setLoading: (loading: boolean): AppAction => ({ 
    type: 'SET_LOADING', 
    payload: loading 
  }),
  
  setError: (error: string | null): AppAction => ({ 
    type: 'SET_ERROR', 
    payload: error 
  }),
  
  setTrajes: (trajes: Traje[]): AppAction => ({ 
    type: 'SET_TRAJES', 
    payload: trajes 
  }),
  
  addTraje: (traje: Traje): AppAction => ({ 
    type: 'ADD_TRAJE', 
    payload: traje 
  }),
  
  updateTraje: (id: string, traje: Traje): AppAction => ({ 
    type: 'UPDATE_TRAJE', 
    payload: { id, traje } 
  }),
  
  deleteTraje: (id: string): AppAction => ({ 
    type: 'DELETE_TRAJE', 
    payload: id 
  }),
};