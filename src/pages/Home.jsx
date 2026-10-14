import { Link } from 'react-router-dom'

const atalhos = [
  {
    to: '/cursos',
    titulo: 'Cursos & Trilhas',
    texto: 'Explore cursos gratuitos e trilhas de aprendizagem para desenvolver suas habilidades.',
    cor: 'var(--green)',
    icone: (
      <path d="M12 3 2 8l10 5 8-4v6h2V8L12 3Zm-6 9.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.5l-6 3-6-3Z" />
    ),
  },
  {
    to: '/vagas',
    titulo: 'Mural de Vagas',
    texto: 'Confira as oportunidades de emprego e estágio disponíveis na sua região.',
    cor: '#1565c0',
    icone: (
      <path d="M9 3a2 2 0 0 0-2 2v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a2 2 0 0 0-2-2H9Zm0 2h6v1H9V5Zm-5 8h16v5H4v-5Z" />
    ),
  },
  {
    to: '/perfil',
    titulo: 'Meu Perfil',
    texto: 'Mantenha seus dados atualizados e aumente suas chances de ser selecionado.',
    cor: '#5b2a86',
    icone: (
      <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5Z" />
    ),
  },
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <span className="chip-hero">🚀 Seu futuro começa aqui!</span>
            <h1>
              Mais qualificação,
              <br />
              <span className="green">mais oportunidades!</span>
            </h1>
            <p>
              O Desafio de Canhotinho conecta você a cursos, capacitações e vagas de emprego,
              ajudando a construir seu primeiro passo no mercado de trabalho.
            </p>
            <Link to="/cursos" className="btn btn-green btn-lg">
              🔍 Explorar cursos e trilhas
            </Link>
          </div>

          <div className="hero-art">
            {/* Coloque a foto em public/jovens.png. Se não existir, essa área some. */}
            <img
              src="jovens.png"
              alt="Jovens sorrindo com mochilas e cadernos"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        </div>
      </section>

      <section className="quick">
        <div className="container quick-inner">
          <div className="quick-intro">
            <h2>Acesso rápido</h2>
            <p>Comece hoje mesmo a construir seu futuro profissional.</p>
          </div>

          <div className="quick-cards">
            {atalhos.map((a) => (
              <Link key={a.to} to={a.to} className="quick-card">
                <span className="quick-icon" style={{ background: a.cor }}>
                  <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                    {a.icone}
                  </svg>
                </span>
                <div>
                  <h3>
                    {a.titulo} <span className="arrow">→</span>
                  </h3>
                  <p>{a.texto}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}