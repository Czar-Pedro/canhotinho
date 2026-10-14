import { Link, useNavigate, useParams } from 'react-router-dom'
import NaoEncontrado from '../components/NaoEncontrado.jsx'
import { useDados } from '../context/DadosContext.jsx'
import Estado from '../components/Estado.jsx'
import Secao from '../components/Secao.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function VagaDetalhe() {
  const { id } = useParams()
  const { user, candidaturas, toggleCandidatura } = useApp()
  const navigate = useNavigate()
  const { vagas, carregando, erro, recarregar } = useDados()

  if (carregando || erro) {
    return <Estado titulo="Vaga" carregando={carregando} erro={erro} onTentar={recarregar} />
  }

  const vaga = vagas.find((v) => String(v.id) === id)

  if (!vaga) {
    return (
      <NaoEncontrado
        texto="Vaga não encontrada"
        voltarPara="/vagas"
        voltarTexto="Ver todas as vagas"
      />
    )
  }

  const candidatado = candidaturas.includes(vaga.id)

  function aoClicar() {
    if (!user) {
      navigate('/login', { state: { from: `/vagas/${vaga.id}` } })
      return
    }
    toggleCandidatura(vaga.id)
  }

  return (
    <section className="container page">
      <Link to="/vagas" className="back-link">
        ← Voltar para o Mural de Vagas
      </Link>

      <div className="detail-head">
        <div className="tags">
          <span className="tag tag-green">{vaga.categoria}</span>
          <span className="tag tag-gray">{vaga.tipo}</span>
          <span className="tag tag-gray">{vaga.modalidade}</span>
        </div>
        <h1 className="page-title">{vaga.titulo}</h1>
        <p className="detail-lead">
          {vaga.empresa} · {vaga.local}
        </p>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <Secao titulo="Sobre a vaga" texto={vaga.descricao} />
          <Secao titulo="Atividades" itens={vaga.atividades} />
          <Secao titulo="Requisitos" itens={vaga.requisitos} />
          <Secao titulo="Benefícios" itens={vaga.beneficios} />
        </div>

        <aside className="detail-side card">
          <dl className="facts">
            <div>
              <dt>Remuneração</dt>
              <dd>{vaga.salario}</dd>
            </div>
            <div>
              <dt>Jornada</dt>
              <dd>{vaga.jornada}</dd>
            </div>
            <div>
              <dt>Local</dt>
              <dd>{vaga.local}</dd>
            </div>
            <div>
              <dt>Inscrições até</dt>
              <dd>{vaga.prazo}</dd>
            </div>
          </dl>

          <button
            type="button"
            className={candidatado ? 'btn btn-outline btn-block' : 'btn btn-green btn-block'}
            onClick={aoClicar}
          >
            {candidatado ? '✓ Candidatura enviada (cancelar)' : 'Candidatar-se'}
          </button>
        </aside>
      </div>
    </section>
  )
}