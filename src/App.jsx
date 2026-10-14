import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Cursos from './pages/Cursos.jsx'
import Vagas from './pages/Vagas.jsx'
import Login from './pages/Login.jsx'
import Perfil from './pages/Perfil.jsx'
import CursoDetalhe from './pages/CursoDetalhe.jsx'
import VagaDetalhe from './pages/VagaDetalhe.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import AcessoSimulado from './pages/AcessoSimulado.jsx'
import Callback from './pages/Callback.jsx'

export default function App() {
  return (
    <div className="app">
      <Header />
      <ScrollToTop />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cursos" element={<Cursos />} />
          <Route path="/cursos/:id" element={<CursoDetalhe />} />
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/vagas/:id" element={<VagaDetalhe />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/acesso-simulado" element={<AcessoSimulado />} />
          <Route path="/auth/callback" element={<Callback />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}