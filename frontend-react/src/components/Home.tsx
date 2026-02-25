import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTrajes } from '../hooks/useTrajes';
import { Stats, Material } from '../types';

const Home: React.FC = () => {
  const { trajes, loading: trajesLoading } = useTrajes();
  const [featuredTrajes, setFeaturedTrajes] = useState<Array<any>>([]);
  const [stats, setStats] = useState<Stats>({
    totalTrajes: 0,
    materialesUnicos: 0,
    propietariosUnicos: 0
  });

  const materiales: Material[] = [
    { key: 'Seda', label: 'Seda', icon: 'fas fa-gem', color: 'primary' },
    { key: 'Terciopelo', label: 'Terciopelo', icon: 'fas fa-crown', color: 'info' },
    { key: 'Raso', label: 'Raso', icon: 'fas fa-star', color: 'warning' },
    { key: 'Brocado', label: 'Brocado', icon: 'fas fa-award', color: 'success' },
    { key: 'Lentejuela', label: 'Lentejuela', icon: 'fas fa-sparkles', color: 'danger' }
  ];

  useEffect(() => {
    if (trajes && trajes.length > 0) {
      // Calcular estadísticas
      const materialesUnicos = [...new Set(trajes.map(t => t.material))].length;
      const propietariosUnicos = [...new Set(trajes.map(t => t.propietario))].length;
      
      setStats({
        totalTrajes: trajes.length,
        materialesUnicos,
        propietariosUnicos
      });

      // Obtener trajes destacados (4 más recientes)
      const featured = trajes
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);
      setFeaturedTrajes(featured);
    }
  }, [trajes]);

  const getMaterialCount = (materialKey: string): number => {
    return featuredTrajes.filter(t => t.material === materialKey).length;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section text-white p-5 mb-5 rounded">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="display-4 fw-bold mb-3">
              <i className="fas fa-crown me-3"></i>
              FallaMarket
            </h1>
            <p className="lead mb-4">
              El marketplace especializado en trajes falleros valencianos y sus accesorios. 
              Encuentra y vende piezas únicas para las fallas de Valencia.
            </p>
            <div className="d-flex gap-3">
              <Link to="/trajes" className="btn btn-warning btn-lg">
                <i className="fas fa-tshirt me-2"></i>
                Ver Trajes
              </Link>
              <Link to="/trajes/add" className="btn btn-outline-light btn-lg">
                <i className="fas fa-plus me-2"></i>
                Añadir Traje
              </Link>
            </div>
          </div>
          <div className="col-md-4 text-center">
            <i className="fas fa-crown" style={{ fontSize: '150px', opacity: 0.3 }}></i>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-tshirt fa-3x text-primary mb-3"></i>
              <h5 className="card-title">Trajes Registrados</h5>
              <p className="card-text">
                Encuentra trajes falleros auténticos de diferentes materiales y estilos.
              </p>
              <div className="text-primary fw-bold fs-4">{stats.totalTrajes}</div>
              <small className="text-muted">trajes disponibles</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-fabric fa-3x text-success mb-3"></i>
              <h5 className="card-title">Materiales Únicos</h5>
              <p className="card-text">
                Variedad de materiales tradicionales para trajes falleros.
              </p>
              <div className="text-success fw-bold fs-4">{stats.materialesUnicos}</div>
              <small className="text-muted">tipos de materiales</small>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100 text-center">
            <div className="card-body">
              <i className="fas fa-users fa-3x text-warning mb-3"></i>
              <h5 className="card-title">Propietarios</h5>
              <p className="card-text">
                Comunidad de falleros que comparten sus trajes registrados.
              </p>
              <div className="text-warning fw-bold fs-4">{stats.propietariosUnicos}</div>
              <small className="text-muted">propietarios diferentes</small>
            </div>
          </div>
        </div>
      </div>

      {/* Materiales Principales */}
      <h2 className="mb-4">Materiales Principales</h2>
      <div className="row mb-5">
        {materiales.map((material) => (
          <div key={material.key} className="col-md-6 col-lg-3 mb-3">
            <div className="card category-card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <i 
                  className={`${material.icon} fa-3x mb-3 text-${material.color}`}
                ></i>
                <h5 className="card-title">{material.label}</h5>
                <div className={`fw-bold text-${material.color}`}>
                  {getMaterialCount(material.key)}
                </div>
                <small className="text-muted">trajes</small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trajes Destacados */}
      <h2 className="mb-4">Trajes Recientes</h2>
      {featuredTrajes.length > 0 ? (
        <div className="row">
          {featuredTrajes.map((traje: any) => (
            <div key={traje._id} className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column">
                  <div className="text-center mb-3">
                    <i className="fas fa-tshirt fa-3x text-primary"></i>
                  </div>
                  
                  <h6 className="card-title text-center fw-bold">
                    {traje.nombre}
                  </h6>
                  
                  <div className="mt-auto">
                    <div className="mb-2">
                      <small className="text-muted">Material:</small>
                      <br />
                      <span className="badge bg-info text-dark">
                        {traje.material}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-muted">Propietario:</small>
                      <br />
                      <span className="badge bg-success">
                        {traje.propietario}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <small className="text-muted">Añadido:</small>
                      <br />
                      <small className="text-secondary">
                        {formatDate(traje.createdAt)}
                      </small>
                    </div>
                    
                    <Link 
                      to={`/trajes/${traje._id}`}
                      className="btn btn-primary btn-sm w-100"
                    >
                      <i className="fas fa-eye me-1"></i>
                      Ver Detalles
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info" role="alert">
          {trajesLoading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <>
              <i className="fas fa-info-circle me-2"></i>
              No hay trajes registrados en este momento. ¡Añade el primer traje fallero!
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;