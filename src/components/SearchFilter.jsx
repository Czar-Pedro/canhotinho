export default function SearchFilter({ busca, onBusca, categorias, categoria, onCategoria }) {
  return (
    <aside className="sidebar">
      <form className="search" onSubmit={(e) => e.preventDefault()} role="search">
        <input
          type="search"
          placeholder="Busca"
          value={busca}
          onChange={(e) => onBusca(e.target.value)}
          aria-label="Buscar"
        />
        <button type="submit" aria-label="Buscar">
          🔍
        </button>
      </form>

      <p className="filters-label">Filtros rápidos por:</p>
      <div className="filters">
        {categorias.map((c) => (
          <button
            key={c}
            type="button"
            className={categoria === c ? 'filter active' : 'filter'}
            onClick={() => onCategoria(categoria === c ? '' : c)}
          >
            {c}
          </button>
        ))}
      </div>
    </aside>
  )
}