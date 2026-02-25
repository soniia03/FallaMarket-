import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrajes } from '../components2/useTrajes';
import { Traje } from '../types';
import TrajeCard from '../components2/TrajeCard';
import Loader from '../components2/Loader';
import Toast from '../components2/Toast';
import { useToast } from '../components2/useToast';


const TrajeList: React.FC = () => {
  const navigate = useNavigate();
  const { trajes, loading, error, deleteTraje } = useTrajes();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast, showSuccess, showError, hideToast } = useToast();


  const filteredTrajes = trajes.filter(traje =>
    traje.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    traje.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    traje.propietario.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleDelete = async (id: string) => {
    try {
      await deleteTraje(id);
      showSuccess('Traje eliminado correctamente');
    } catch (err) {
      showError((err as Error).message || 'Error al eliminar el traje');
    }
  };


  const handleEdit = (id: string) => {
    navigate(`/trajes/edit/${id}`);
  };


  if (loading) {
    return <Loader message="Cargando trajes..." />;
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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2><i className="fas fa-crown me-2 text-warning"></i>Trajes Falleros</h2>
          <p className="text-muted mb-0">Total: {filteredTrajes.length} trajes</p>
        </div>
        <Link to="/trajes/add" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Agregar Traje
        </Link>
      </div>


      {/* Buscador - Responsive */}
      <div className="row mb-4">
        <div className="col-12 col-md-8 col-lg-6">
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
            {searchTerm && (
              <button 
                className="btn btn-outline-secondary" 
                onClick={() => setSearchTerm('')}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      </div>


      {/* Lista de trajes */}
      {filteredTrajes.length > 0 ? (
        <div className="row">
          {filteredTrajes.map((traje: Traje) => (
            <div key={traje._id} className="col-12 col-md-6 col-xl-4 mb-4">
              <TrajeCard 
                traje={traje}
                showActions={true}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info" role="alert">
          <i className="fas fa-info-circle me-2"></i>
          {searchTerm 
            ? `No se encontraron trajes que coincidan con "${searchTerm}"`
            : 'No hay trajes registrados. ¡Añade el primero!'
          }
        </div>
      )}


      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </div>
  );
};


export default TrajeList;
