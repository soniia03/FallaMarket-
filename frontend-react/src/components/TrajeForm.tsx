import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrajes } from '../components2/useTrajes';
import { TrajeFormData } from '../types';
import { validateTrajeForm, hasValidationErrors, ValidationErrors } from '../components2/validation';
import Loader from '../components2/Loader';
import Toast from '../components2/Toast';
import { useToast } from '../components2/useToast';


const TrajeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createTraje, updateTraje, getTrajeById } = useTrajes();
  const isEdit = Boolean(id);
  const { toast, showSuccess, showError, hideToast } = useToast();


  const [formData, setFormData] = useState<TrajeFormData>({
    nombre: '',
    material: '',
    propietario: '',
    descripcion: '',
    precio: 0,
    disponible: true
  });


  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});


  useEffect(() => {
    if (isEdit && id) {
      const fetchTraje = async (): Promise<void> => {
        try {
          setLoading(true);
          const traje = await getTrajeById(id);
          if (traje) {
            setFormData({
              nombre: traje.nombre,
              material: traje.material,
              propietario: traje.propietario,
              descripcion: traje.descripcion || '',
              precio: traje.precio,
              disponible: traje.disponible
            });
          }
        } catch (err) {
          setError(`Error al cargar el traje: ${(err as Error).message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchTraje();
    }
  }, [id, isEdit, getTrajeById]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
   
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setValidationErrors({});
   
    // Validaciones mejoradas
    const errors = validateTrajeForm(formData);
    
    if (hasValidationErrors(errors)) {
      setValidationErrors(errors);
      setError('Por favor, corrige los errores en el formulario.');
      showError('Por favor, corrige los errores en el formulario.');
      return;
    }


    try {
      setLoading(true);
      if (isEdit && id) {
        await updateTraje(id, formData);
        showSuccess('Traje actualizado correctamente');
      } else {
        await createTraje(formData);
        showSuccess('Traje creado correctamente');
      }
      setTimeout(() => navigate('/trajes'), 1500);
    } catch (err) {
      const errorMsg = (err as Error).message;
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };


  const materialesComunes: string[] = [
    'Seda',
    'Terciopelo',
    'Raso',
    'Brocado',
    'Lentejuela',
    'Damasco',
    'Faille',
    'Tul',
    'Gasa',
    'Otro'
  ];

  if (loading && isEdit) {
    return <Loader message="Cargando datos del traje..." />;
  }

  return (
    <>
      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
      
      {loading && <Loader message="Guardando..." fullScreen />}
      
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          <div className="card border-0 shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="card-title mb-0">
                <i className={`fas ${isEdit ? 'fa-edit' : 'fa-plus'} me-2`}></i>
                {isEdit ? 'Editar Traje' : 'Agregar Nuevo Traje'}
              </h3>
            </div>
            <div className="card-body p-4">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit}>
              {/* Nombre del traje */}
              <div className="mb-4">
                <label htmlFor="nombre" className="form-label fw-bold">
                  <i className="fas fa-tshirt me-2 text-primary"></i>
                  Nombre del Traje *
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg ${validationErrors.nombre ? 'is-invalid' : ''}`}
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Traje Fallera Mayor, Traje Infantil..."
                  required
                />
                {validationErrors.nombre && (
                  <div className="invalid-feedback">
                    {validationErrors.nombre}
                  </div>
                )}
                <div className="form-text">
                  Introduce un nombre descriptivo para el traje (mínimo 3 caracteres).
                </div>
              </div>


              {/* Material */}
              <div className="mb-4">
                <label htmlFor="material" className="form-label fw-bold">
                  <i className="fas fa-fabric me-2 text-info"></i>
                  Material *
                </label>
                <select
                  className="form-select form-control-lg"
                  id="material"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona el material...</option>
                  {materialesComunes.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
                <div className="form-text">
                  O puedes escribir directamente si seleccionas "Otro".
                </div>
               
                {/* Campo de texto para "Otro" material */}
                {formData.material === 'Otro' && (
                  <input
                    type="text"
                    className="form-control mt-2"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    placeholder="Especifica el material..."
                  />
                )}
              </div>


              {/* Propietario */}
              <div className="mb-4">
                <label htmlFor="propietario" className="form-label fw-bold">
                  <i className="fas fa-user me-2 text-success"></i>
                  Propietario *
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg ${validationErrors.propietario ? 'is-invalid' : ''}`}
                  id="propietario"
                  name="propietario"
                  value={formData.propietario}
                  onChange={handleChange}
                  placeholder="Ej: María Carmen López"
                  required
                />
                {validationErrors.propietario && (
                  <div className="invalid-feedback">
                    {validationErrors.propietario}
                  </div>
                )}
                <div className="form-text">
                  Nombre de la persona propietaria del traje (mínimo 2 caracteres).
                </div>
              </div>


              {/* Descripción */}
              <div className="mb-4">
                <label htmlFor="descripcion" className="form-label fw-bold">
                  <i className="fas fa-pen me-2 text-secondary"></i>
                  Descripción *
                </label>
                <textarea
                  className={`form-control form-control-lg ${validationErrors.descripcion ? 'is-invalid' : ''}`}
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Describe los detalles del traje, características especiales, etc."
                  rows={4}
                  required
                />
                {validationErrors.descripcion && (
                  <div className="invalid-feedback">
                    {validationErrors.descripcion}
                  </div>
                )}
                <div className="form-text">
                  Proporciona una descripción detallada del traje (mínimo 10 caracteres, máximo 500).
                </div>
              </div>


              {/* Precio */}
              <div className="mb-4">
                <label htmlFor="precio" className="form-label fw-bold">
                  <i className="fas fa-euro-sign me-2 text-warning"></i>
                  Precio *
                </label>
                <input
                  type="number"
                  className={`form-control form-control-lg ${validationErrors.precio ? 'is-invalid' : ''}`}
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  max="10000"
                  required
                />
                {validationErrors.precio && (
                  <div className="invalid-feedback">
                    {validationErrors.precio}
                  </div>
                )}
                <div className="form-text">
                  Introduce el precio estimado del traje en euros (entre 0 y 10,000€).
                </div>
              </div>


              {/* Disponible */}
              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="disponible"
                    name="disponible"
                    checked={formData.disponible}
                    onChange={handleChange}
                  />
                  <label className="form-check-label fw-bold" htmlFor="disponible">
                    <i className="fas fa-check-circle me-2 text-success"></i>
                    Disponible
                  </label>
                </div>
                <div className="form-text">
                  Marca si el traje está disponible o no.
                </div>
              </div>


              {/* Botones */}
              <div className="d-flex gap-3 pt-3 border-top">
                <button
                  type="button"
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={() => navigate('/trajes')}
                  disabled={loading}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-grow-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </span>
                      {isEdit ? 'Actualizando...' : 'Guardando...'}
                    </>
                  ) : (
                    <>
                      <i className={`fas ${isEdit ? 'fa-save' : 'fa-plus'} me-2`}></i>
                      {isEdit ? 'Actualizar Traje' : 'Crear Traje'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>


        {/* Información adicional */}
        <div className="mt-4">
          <div className="card bg-light border-0">
            <div className="card-body">
              <h6 className="card-title">
                <i className="fas fa-info-circle me-2 text-info"></i>
                Información sobre Trajes Falleros
              </h6>
              <p className="card-text small text-muted mb-0">
                Los trajes falleros son una parte fundamental de la tradición valenciana.
                Asegúrate de incluir información precisa sobre el material y propietario
                para facilitar su identificación y cuidado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};


export default TrajeForm;