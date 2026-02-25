import React from 'react';
import { Link } from 'react-router-dom';
import { Traje } from '../types';

interface TrajeCardProps {
  traje: Traje;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  className?: string;
}

const TrajeCard: React.FC<TrajeCardProps> = ({ 
  traje, 
  showActions = true, 
  onDelete, 
  onEdit,
  className = '' 
}) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className={`card h-100 ${className}`}>
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title text-primary mb-1">{traje.nombre}</h5>
          <span className={`badge ${traje.disponible ? 'bg-success' : 'bg-warning'}`}>
            {traje.disponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>
        
        <div className="mb-2">
          <small className="text-muted">
            <i className="fas fa-user me-1"></i>
            {traje.propietario}
          </small>
        </div>
        
        <div className="mb-2">
          <span className="badge bg-info">
            <i className="fas fa-fabric me-1"></i>
            {traje.material}
          </span>
        </div>
        
        {traje.descripcion && (
          <p className="card-text text-muted small mb-3">
            {traje.descripcion.length > 100 
              ? `${traje.descripcion.substring(0, 100)}...` 
              : traje.descripcion
            }
          </p>
        )}
        
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="h5 text-success mb-0">{formatPrice(traje.precio || 0)}</span>
            <small className="text-muted">
              {formatDate(traje.createdAt)}
            </small>
          </div>
          
          {showActions && (
            <div className="btn-group w-100" role="group">
              <Link 
                to={`/trajes/${traje._id}`} 
                className="btn btn-outline-primary btn-sm"
              >
                <i className="fas fa-eye me-1"></i>
                Ver
              </Link>
              
              {onEdit && (
                <button 
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => onEdit(traje._id)}
                >
                  <i className="fas fa-edit me-1"></i>
                  Editar
                </button>
              )}
              
              {onDelete && (
                <button 
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres eliminar este traje?')) {
                      onDelete(traje._id);
                    }
                  }}
                >
                  <i className="fas fa-trash me-1"></i>
                  Eliminar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrajeCard;