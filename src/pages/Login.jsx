import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { iniciarLogin } from '../services/auth.js'

export default function Login() {
  const { user } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.from || '/perfil'

  if (user) return <Navigate to={destino} replace />

  return (
    <section className="container page">
      <div className="auth-box">
        <h1 className="page-title">Entrar</h1>
        <p className="muted">
          {location.state?.from
            ? 'Entre para continuar.'
            : 'Acesse para se inscrever em cursos e se candidatar a vagas.'}
        </p>

        <button
          type="button"
          className="btn btn-green btn-block btn-lg"
          onClick={() => navigate(iniciarLogin(destino))}
        >
          Entrar com gov.br
        </button>

        <ul className="check-list login-notes">
          <li>Você não cria conta aqui: o cadastro é feito no gov.br.</li>
          <li>Nós não recebemos nem guardamos sua senha.</li>
          <li>Você escolhe quais dados compartilhar.</li>
        </ul>

        <p className="small muted">
          Versão de demonstração: o login com o gov.br é simulado e os dados ficam salvos apenas
          neste navegador.
        </p>
      </div>
    </section>
  )
}