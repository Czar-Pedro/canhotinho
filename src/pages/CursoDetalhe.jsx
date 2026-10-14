import { Link, useNavigate, useParams } from 'react-router-dom'
import NaoEncontrado from '../components/NaoEncontrado.jsx'
import { useDados } from '../context/DadosContext.jsx'
import Estado from '../components/Estado.jsx'
import Secao from '../components/Secao.jsx'
import { useApp } from '../context/AppContext.jsx'

export default function CursoDetalhe() {
  const { id } = useParams()
  const { user, inscricoes, toggleInscricao } = useApp()
  const navigate = useNavigate()
  const { cursos, carregando, erro, recarregar } = useDados()

  if (carregando || erro) {
  return <Estado titulo="Curso" carregando={carregando} erro={erro} onTentar={recarregar} />
}

const curso = cursos.find((c) => String(c.id) === id)

  if (!curso) {
    return (
      <NaoEncontrado
        texto="Curso não encontrado"
        voltarPara="/cursos"
        voltarTexto="Ver todos os cursos"
      />
    )
  }

  const inscrito = inscricoes.includes(curso.id)
  const ocupadas = curso.inscritos + (inscrito ? 1 : 0)
  const percentual =
    curso.vagas > 0 ? Math.min(100, Math.round((ocupadas / curso.vagas) * 100)) : 0
  const lotado = curso.vagas > 0 && ocupadas >= curso.vagas && !inscrito

  function aoClicar() {
    if (!user) {
      navigate('/login', { state: { from: `/cursos/${curso.id}` } })
      return
    }
    toggleInscricao(curso.id)
  }

  return (
    <section className="container page">
      <Link to="/cursos" className="back-link">
        ← Voltar para Cursos &amp; Trilhas
      </Link>

      <div className="detail-head">
        <div className="tags">
          <span className="tag tag-green">{curso.categoria}</span>
          <span className="tag tag-gray">Gratuito</span>
          <span className="tag tag-gray">{curso.cargaHoraria}h</span>
        </div>
        <h1 className="page-title">{curso.titulo}</h1>
        <p className="detail-lead">{curso.descricao}</p>
      </div>

            <div className="detail-layout">
        <div className="detail-main">
          <Secao titulo="Para quem é" texto={curso.publico} />
          <Secao titulo="O que você vai aprender" itens={curso.conteudo} />
          <Secao titulo="Requisitos" itens={curso.requisitos} />
        </div>

        <aside className="detail-side card">
          <dl className="facts">
            <div>
              <dt>Início</dt>
              <dd>{curso.inicio}</dd>
            </div>
            <div>
              <dt>Horário</dt>
              <dd>{curso.horario}</dd>
            </div>
            <div>
              <dt>Local</dt>
              <dd>{curso.local}</dd>
            </div>
            <div>
              <dt>Instrutor</dt>
              <dd>{curso.instrutor}</dd>
            </div>
            <div>
              <dt>Certificado</dt>
              <dd>Incluso ao concluir</dd>
            </div>
          </dl>

          {curso.vagas > 0 && (
  <>
    <div className="progress">
      <div className="progress-bar" style={{ width: `${percentual}%` }} />
    </div>
    <small className="muted">
      {ocupadas} de {curso.vagas} vagas preenchidas
    </small>
  </>
)}

          <button
            type="button"
            className={inscrito ? 'btn btn-outline btn-block' : 'btn btn-green btn-block'}
            disabled={lotado}
            onClick={aoClicar}
          >
            {lotado ? 'Vagas esgotadas' : inscrito ? '✓ Inscrito (cancelar)' : 'Inscrever-se'}
          </button>
        </aside>
      </div>
    </section>
  )
}