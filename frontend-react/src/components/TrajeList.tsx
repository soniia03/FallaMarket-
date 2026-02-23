import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrajes } from '../hooks/useTrajes';
import { Traje } from '../types';


const TrajeList: React.FC = () => {
  const { trajes, loading, error, deleteTraje } = useTrajes();
  const [searchTerm, setSearchTerm] = useState<string>('');


  const filteredTrajes = trajes.filter(traje =>
    traje.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    traje.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    traje.propietario.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleDelete = async (id: string, nombre: string): Promise<void> => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el traje "${nombre}"?`)) {
      try {
        await deleteTraje(id);
      } catch (error) {
        alert(`Error al eliminar el traje: ${(error as Error).message}`);
      }
    }
  };


  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando trajes...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Error</h4>
        <p>No se pudieron cargar los trajes: {error}</p>
      </div>
    );
  }


  return (
    <div>
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2><i className="fas fa-crown me-2 text-warning"></i>Trajes Falleros</h2>
          <p className="text-muted">Total: {filteredTrajes.length} trajes</p>
        </div>
        <Link to="/trajes/add" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Agregar Traje
        </Link>
      </div>


      {/* Buscador */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por nombre, material o propietario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>


      {/* Lista de trajes */}
      {filteredTrajes.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-tshirt" style={{ fontSize: '80px', color: '#ddd' }}></i>
          <h4 className="mt-3 text-muted">No hay trajes disponibles</h4>
          <p>¡Añade tu primer traje fallero!</p>
          <Link to="/trajes/add" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Agregar Traje
          </Link>
        </div>
      ) : (
        <div className="row">
          {filteredTrajes.map((traje: Traje) => (
            <div key={traje.id} className="col-lg-6 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title text-primary fw-bold">
                      <i className="fas fa-tshirt me-2"></i>
                      {traje.nombre}
                    </h5>
                    <div className="dropdown">
                      <button className="btn btn-outline-secondary btn-sm dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <Link to={`/trajes/${traje.id}`} className="dropdown-item">
                            <i className="fas fa-eye me-2"></i>Ver detalles
                          </Link>
                        </li>
                        <li>
                          <Link to={`/trajes/edit/${traje.id}`} className="dropdown-item">
                            <i className="fas fa-edit me-2"></i>Editar
                          </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleDelete(traje.id, traje.nombre)}
                          >
                            <i className="fas fa-trash me-2"></i>Eliminar
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>


                  <div className="row mb-3">
                    <div className="col-sm-6">
                      <small className="text-muted">Material:</small>
                      <p className="mb-2">
                        <span className="badge bg-info text-dark">
                          <i className="fas fa-fabric me-1"></i>
                          {traje.material}
                        </span>
                      </p>
                    </div>
                    <div className="col-sm-6">
                      <small className="text-muted">Propietario:</small>
                      <p className="mb-2">
                        <span className="badge bg-success">
                          <i className="fas fa-user me-1"></i>
                          {traje.propietario}
                        </span>
                      </p>
                    </div>
                  </div>


                  {/* Descripción */}
                  <div className="mb-3">
                    <small className="text-muted">Descripción:</small>
                    <p className="mb-2 text-dark">
                      {traje.descripcion.length > 100
                        ? `${traje.descripcion.substring(0, 100)}...`
                        : traje.descripcion}
                    </p>
                  </div>


                  {/* Precio y Disponibilidad */}
                  <div className="row mb-3">
                    <div className="col-sm-6">
                      <small className="text-muted">Precio:</small>
                      <p className="mb-2">
                        <span className="badge bg-warning text-dark">
                          <i className="fas fa-euro-sign me-1"></i>
                          {traje.precio.toFixed(2)}
                        </span>
                      </p>
                    </div>
                    <div className="col-sm-6">
                      <small className="text-muted">Estado:</small>
                      <p className="mb-2">
                        <span className={`badge ${traje.disponible ? 'bg-success' : 'bg-danger'}`}>
                          <i className={`fas ${traje.disponible ? 'fa-check-circle' : 'fa-times-circle'} me-1`}></i>
                          {traje.disponible ? 'Disponible' : 'No disponible'}
                        </span>
                      </p>
                    </div>
                  </div>


                  <div className="text-muted small">
                    <div className="d-flex justify-content-between">
                      <span>
                        <i className="fas fa-calendar-plus me-1"></i>
                        Creado: {formatDate(traje.createdAt)}
                      </span>
                      {traje.updatedAt !== traje.createdAt && (
                        <span>
                          <i className="fas fa-edit me-1"></i>
                          Actualizado: {formatDate(traje.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex gap-2">
                    <Link to={`/trajes/${traje.id}`} className="btn btn-outline-primary btn-sm flex-grow-1">
                      <i className="fas fa-eye me-1"></i>Ver
                    </Link>
                    <Link to={`/trajes/edit/${traje.id}`} className="btn btn-outline-warning btn-sm flex-grow-1">
                      <i className="fas fa-edit me-1"></i>Editar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default TrajeList;
