import { useState } from 'react'
import SearchFilter from '../components/SearchFilter.jsx'
import { useDados } from '../context/DadosContext.jsx'
import Estado from '../components/Estado.jsx'
import { normalizar } from '../utils/texto.js'
import { useApp } from '../context/AppContext.jsx'
import { Link, useNavigate } from 'react-router-dom'

export default function Cursos() {
  const { user, inscricoes, toggleInscricao } = useApp()
  const navigate = useNavigate()
  const { cursos, categoriasCursos, carregando, erro, recarregar } = useDados()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')

  function aoClicar(id) {
  if (!user) {
    navigate('/login', { state: { from: '/cursos' } })
    return
  }
  toggleInscricao(id)
}

if (carregando || erro) {
  return <Estado titulo="Cursos & Trilhas" carregando={carregando} erro={erro} onTentar={recarregar} />
}

  const lista = cursos.filter((c) => {
    const texto = normalizar(`${c.titulo} ${c.descricao} ${c.categoria}`)
    const passaBusca = texto.includes(normalizar(busca))
    const passaCategoria = !categoria || c.categoria === categoria
    return passaBusca && passaCategoria
  })

  return (
    <section className="container page">
      <h1 className="page-title">Cursos &amp; Trilhas</h1>

      <div className="list-layout">
        <div className="cards">
          {lista.length === 0 && <p className="muted">Nenhum curso encontrado.</p>}

          {lista.map((c) => {
            const inscrito = inscricoes.includes(c.id)
            const ocupadas = c.inscritos + (inscrito ? 1 : 0)
            const percentual = c.vagas > 0 ? Math.min(100, Math.round((ocupadas / c.vagas) * 100)) : 0
            const lotado = c.vagas > 0 && ocupadas >= c.vagas && !inscrito

            return (
              <article key={c.id} className="card">
                <h2>
                  <Link to={`/cursos/${c.id}`}>{c.titulo}</Link>
                </h2>
                <p className="card-text">{c.descricao}</p>

                {c.vagas > 0 && (
                  <>
                    <div className="progress" title={`${percentual}% das vagas preenchidas`}>
                      <div className="progress-bar" style={{ width: `${percentual}%` }} />
                    </div>
                    <small className="muted">
                      {ocupadas} de {c.vagas} vagas preenchidas
                    </small>
                  </>
                )}

                <div className="tags">
                  <span className="tag tag-gray">Gratuito</span>
                  <span className="tag tag-gray">{c.cargaHoraria}h</span>
                  <span className={lotado ? 'tag tag-red' : 'tag tag-green'}>
                    {lotado ? 'Vagas esgotadas' : 'Inscrições Abertas'}
                  </span>
                </div>

                <Link to={`/cursos/${c.id}`} className="more-link">
                   Ver detalhes →
                </Link>

                <button
                  type="button"
                  className={inscrito ? 'btn btn-outline btn-block' : 'btn btn-green btn-block'}
                  disabled={lotado}
                  onClick={() => aoClicar(c.id)}
                >
                  {inscrito ? '✓ Inscrito (cancelar)' : 'Inscrever-se'}
                </button>
              </article>
            )
          })}
        </div>

        <SearchFilter
          busca={busca}
          onBusca={setBusca}
          categorias={categoriasCursos}
          categoria={categoria}
          onCategoria={setCategoria}
        />
      </div>
    </section>
  )
}