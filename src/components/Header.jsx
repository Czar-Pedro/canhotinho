import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useApp } from '../context/AppContext.jsx'

const links = [
  { to: '/', label: 'Início', end: true },
  { to: '/cursos', label: 'Cursos & Trilhas' },
  { to: '/vagas', label: 'Mural de Vagas' },
  { to: '/perfil', label: 'Meu Perfil' },
]

export default function Header() {
  const { user, logout } = useApp()

  return (
    <header>
      <div className="topbar">
        <Link to="/" className="brand" aria-label="Página inicial">
          <Logo />
          <span className="brand-divider" />
          <div className="brand-title">
            <span>Canhotinho</span>
            <strong>Qualificação e Oportunidades</strong>
          </div>
        </Link>

        {user ? (
          <div className="topbar-user">
            <span>Olá, {user.nome.split(' ')[0]}</span>
            <button type="button" className="link-btn" onClick={logout}>
              Sair
            </button>
          </div>
        ) : (
          <Link to="/login" className="topbar-login">
            Entrar com gov.br
          </Link>
        )}
      </div>

      <nav className="mainnav" aria-label="Navegação principal">
        <div className="mainnav-inner">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  )
}