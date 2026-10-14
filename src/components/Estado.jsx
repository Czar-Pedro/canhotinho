export default function Estado({ titulo, carregando, erro, onTentar }) {
  return (
    <section className="container page">
      <h1 className="page-title">{titulo}</h1>
      {carregando ? (
        <p className="muted" role="status">
          Carregando...
        </p>
      ) : (
        <>
          <p className="form-error">{erro}</p>
          <button type="button" className="btn btn-green btn-lg" onClick={onTentar}>
            Tentar novamente
          </button>
        </>
      )}
    </section>
  )
}