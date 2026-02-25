import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrajes } from '../components2/useTrajes';
import { Traje } from '../types';
import TrajeCard from '../components2/TrajeCard';


const TrajeList: React.FC = () => {
  const navigate = useNavigate();
  const { trajes, loading, error, deleteTraje, pagination, currentPage, itemsPerPage, changePage, changeItemsPerPage } = useTrajes();
  const [searchTerm, setSearchTerm] = useState<string>('');


  const filteredTrajes = trajes.filter(traje =>
    traje.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    traje.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    traje.propietario.toLowerCase().includes(searchTerm.toLowerCase())
  );


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
            <div key={traje._id} className="col-lg-6 mb-4">
              <TrajeCard 
                traje={traje}
                showActions={true}
                onDelete={async (id) => {
                  try {
                    await deleteTraje(id);
                  } catch (error) {
                    alert(`Error al eliminar el traje: ${(error as Error).message}`);
                  }
                }}
                onEdit={(id) => navigate(`/trajes/edit/${id}`)}
                className="shadow-sm"
              />
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {pagination && pagination.total > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
          <div className="text-muted">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} - 
            {Math.min(currentPage * itemsPerPage, pagination.total)} de {pagination.total} trajes
          </div>
          
          <div className="btn-group">
            <button 
              className="btn btn-sm btn-outline-primary" 
              disabled={!pagination.hasPrevPage}
              onClick={() => changePage(currentPage - 1)}>
              <i className="fas fa-chevron-left"></i> Anterior
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => {
              if (pagination.totalPages > 10 && (page < currentPage - 2 || page > currentPage + 2)) {
                return null;
              }
              return (
                <button
                  key={page}
                  className={`btn btn-sm btn-outline-primary ${currentPage === page ? 'active' : ''}`}
                  onClick={() => changePage(page)}>
                  {page}
                </button>
              );
            })}
            <button 
              className="btn btn-sm btn-outline-primary" 
              disabled={!pagination.hasNextPage}
              onClick={() => changePage(currentPage + 1)}>
              Siguiente <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <select 
            className="form-select form-select-sm" 
            style={{ width: 'auto' }}
            value={itemsPerPage}
            onChange={(e) => changeItemsPerPage(Number(e.target.value))}>
            <option value={5}>5 por página</option>
            <option value={10}>10 por página</option>
            <option value={20}>20 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>
      )}
    </div>
  );
};


export default TrajeList;
