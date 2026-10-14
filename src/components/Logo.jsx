// Brasão genérico (troque pelo arquivo oficial da Prefeitura, se tiverem autorização de uso).
export default function Logo() {
  return (
    <div className="logo">
      <svg className="logo-shield" viewBox="0 0 48 56" aria-hidden="true">
        <path d="M24 2 4 9v20c0 12 8 21 20 25 12-4 20-13 20-25V9L24 2Z" fill="#c8102e" stroke="#1d4f91" strokeWidth="3" />
        <path d="M24 2v52C12 50 4 41 4 29V9l20-7Z" fill="#1d4f91" opacity=".9" />
        <circle cx="30" cy="24" r="6" fill="#f4c20d" />
      </svg>
      <div className="logo-text">
        <span className="logo-small">Prefeitura de</span>
        <span className="logo-big">Canhotinho</span>
      </div>
    </div>
  )
}