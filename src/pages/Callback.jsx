import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { limparPedido, lerPedido, trocarCodigoPorUsuario } from '../services/auth.js'

export default function Callback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useApp()
  const [erro, setErro] = useState('')
  const jaExecutou = useRef(false) // evita rodar duas vezes no modo de desenvolvimento

  useEffect(() => {
    if (jaExecutou.current) return
    jaExecutou.current = true

    const pedido = lerPedido()
    const code = params.get('code')
    const state = params.get('state')

    if (!pedido || !code || state !== pedido.state) {
      setErro('Não foi possível confirmar o pedido de login.')
      return
    }

    trocarCodigoPorUsuario(code)
      .then((dados) => {
        login({
          nome: dados.nome,
          cpf: dados.cpf,
          cidade: 'Canhotinho',
          escolaridade: '',
          interesses: [],
        })
        limparPedido()
        navigate(pedido.destino, { replace: true })
      })
      .catch(() => setErro('Não foi possível concluir o login. Tente novamente.'))
  }, [])

  return (
    <section className="container page">
      <div className="auth-box">
        {erro ? (
          <>
            <h1 className="page-title">Ops!</h1>
            <p className="form-error">{erro}</p>
            <Link to="/login" className="btn btn-green btn-block">
              Voltar ao login
            </Link>
          </>
        ) : (
          <>
            <h1 className="page-title">Concluindo login...</h1>
            <p className="muted">Só um instante.</p>
          </>
        )}
      </div>
    </section>
  )
}