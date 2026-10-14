export default function Secao({ titulo, texto, itens }) {
  const vazio = texto !== undefined ? !texto.trim() : !itens || itens.length === 0
  if (vazio) return null

  return (
    <div className="card">
      <h2>{titulo}</h2>
      {texto !== undefined ? (
        <p className="card-text">{texto}</p>
      ) : (
        <ul className="check-list">
          {itens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}