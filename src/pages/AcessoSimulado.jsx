import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import NaoEncontrado from '../components/NaoEncontrado.jsx'
import { autorizar, lerPedido } from '../services/auth.js'
import { formatarCpf } from '../utils/texto.js'

export default function AcessoSimulado() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const [etapa, setEtapa] = useState('identificar')
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [erro, setErro] = useState('')

  const pedido = lerPedido()
  if (!pedido || pedido.state !== params.get('state')) {
    return (
      <NaoEncontrado
        texto="Pedido de login inválido ou expirado"
        voltarPara="/login"
        voltarTexto="Voltar ao login"
      />
    )
  }

  function continuar(e) {
    e.preventDefault()
    if (nome.trim().length < 3) {
      setErro('Digite seu nome completo.')
      return
    }
    if (cpf.replace(/\D/g, '').length !== 11) {
      setErro('O CPF precisa ter 11 números.')
      return
    }
    setErro('')
    setEtapa('autorizar')
  }

  function aceitar() {
    navigate(autorizar({ nome: nome.trim(), cpf }), { replace: true })
  }

  return (
    <section className="container page">
      <div className="auth-box">
        <div className="sim-banner">
          SIMULAÇÃO · Esta não é a tela do gov.br. Não digite dados reais de acesso.
        </div>

        {etapa === 'identificar' ? (
          <>
            <h1 className="page-title">Identifique-se</h1>
            <p className="muted">
              Na versão real, aqui entram seu CPF e sua senha do gov.br. Nesta demonstração, digite
              um nome e um CPF de teste.
            </p>

            <form onSubmit={continuar} className="form" noValidate>
              <label>
                Nome completo
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  autoComplete="off"
                />
              </label>

              <label>
                CPF
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(formatarCpf(e.target.value))}
                  autoComplete="off"
                />
              </label>

              {erro && <p className="form-error">{erro}</p>}

              <button type="submit" className="btn btn-green btn-block">
                Continuar
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="page-title">Autorizar acesso</h1>
            <p className="muted">
              <strong>Canhotinho – Qualificação e Oportunidades</strong> quer acessar estes dados da
              sua conta:
            </p>

            <ul className="check-list consent-list">
              <li>Nome: {nome.trim()}</li>
              <li>CPF: {cpf}</li>
            </ul>

            <div className="consent-actions">
              <button type="button" className="btn btn-green btn-block" onClick={aceitar}>
                Autorizar
              </button>
              <button
                type="button"
                className="btn btn-outline btn-block"
                onClick={() => navigate('/login', { replace: true })}
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}