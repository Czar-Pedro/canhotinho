import { Link } from 'react-router-dom'

export default function NaoEncontrado({ texto, voltarPara, voltarTexto }) {
  return (
    <section className="container page">
      <h1 className="page-title">{texto}</h1>
      <Link to={voltarPara} className="btn btn-green btn-lg">
        {voltarTexto}
      </Link>
    </section>
  )
}