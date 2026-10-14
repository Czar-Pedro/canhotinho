import { useState } from 'react'
import SearchFilter from '../components/SearchFilter.jsx'
import { useDados } from '../context/DadosContext.jsx'
import Estado from '../components/Estado.jsx'
import { normalizar } from '../utils/texto.js'
import { useApp } from '../context/AppContext.jsx'
import { Link, useNavigate } from 'react-router-dom'

export default function Vagas() {
  const { user, candidaturas, toggleCandidatura } = useApp()
  const navigate = useNavigate()
  const { vagas, categoriasVagas, carregando, erro, recarregar } = useDados()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')

  function aoClicar(id) {
  if (!user) {
    navigate('/login', { state: { from: '/vagas' } })
    return
  }
  toggleCandidatura(id)
}

if (carregando || erro) {
  return <Estado titulo="Mural de Vagas" carregando={carregando} erro={erro} onTentar={recarregar} />
}

  const lista = vagas.filter((v) => {
    const texto = normalizar(`${v.titulo} ${v.empresa} ${v.descricao} ${v.categoria} ${v.tipo}`)
    const passaBusca = texto.includes(normalizar(busca))
    const passaCategoria = !categoria || v.categoria === categoria
    return passaBusca && passaCategoria
  })

  return (
    <section className="container page">
      <h1 className="page-title">Mural de Vagas</h1>

      <div className="list-layout">
        <div className="cards">
          {lista.length === 0 && <p className="muted">Nenhuma vaga encontrada.</p>}

          {lista.map((v) => {
            const candidatado = candidaturas.includes(v.id)

            return (
              <article key={v.id} className="card">
                <h2>
                  <Link to={`/vagas/${v.id}`}>{v.titulo}</Link>
                </h2>
                <small className="muted">{v.empresa}</small>
                <p className="card-text">{v.descricao}</p>

                <div className="tags">
                  <span className="tag tag-gray">{v.modalidade}</span>
                  <span className="tag tag-gray">{v.tipo}</span>
                  <span className="tag tag-green">Inscrições Abertas</span>
                </div>

                <Link to={`/vagas/${v.id}`} className="more-link">
                  Ver detalhes →
                </Link>

                <button
                  type="button"
                  className={candidatado ? 'btn btn-outline btn-block' : 'btn btn-green btn-block'}
                  onClick={() => aoClicar(v.id)}
                >
                  {candidatado ? '✓ Candidatura enviada (cancelar)' : 'Candidatar-se'}
                </button>
              </article>
            )
          })}
        </div>

        <SearchFilter
          busca={busca}
          onBusca={setBusca}
          categorias={categoriasVagas}
          categoria={categoria}
          onCategoria={setCategoria}
        />
      </div>
    </section>
  )
}