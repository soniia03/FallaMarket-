import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Importar componentes
import Navbar from './components/Navbar';
import Home from './components/Home';
import TrajeList from './components/TrajeList';
import TrajeDetail from './components/TrajeDetail';
import TrajeForm from './components/TrajeForm';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navbar />
        
        <main className="container mt-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trajes" element={<TrajeList />} />
            <Route path="/trajes/add" element={<TrajeForm />} />
            <Route path="/trajes/edit/:id" element={<TrajeForm />} />
            <Route path="/trajes/:id" element={<TrajeDetail />} />
            <Route path="*" element={
              <div className="text-center py-5">
                <h2>Página no encontrada</h2>
                <p>La página que buscas no existe.</p>
                <a href="/" className="btn btn-primary">Volver al inicio</a>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;