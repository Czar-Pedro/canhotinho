import { useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { useDados } from '../context/DadosContext.jsx'
import Estado from '../components/Estado.jsx'

const escolaridades = [
  'Fundamental incompleto',
  'Fundamental completo',
  'Médio incompleto',
  'Médio completo',
  'Superior incompleto',
  'Superior completo',
]

const LIMITE_PDF = 500 * 1024 // 500 KB
const LIMITE_RESUMO = 500
const experienciaVazia = { cargo: '', empresa: '', periodo: '', descricao: '' }

/* ------------------------------------------------------------------ */
/* Formulário do perfil (só aparece depois que a conta carregou)       */
/* ------------------------------------------------------------------ */
function PerfilForm() {
  const {
    user,
    atualizarPerfil,
    inscricoes,
    toggleInscricao,
    candidaturas,
    toggleCandidatura,
    sincronizacao,
  } = useApp()
  const { cursos, vagas, categorias, carregando, erro, recarregar } = useDados()

  const [nome, setNome] = useState(user?.nome ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [cidade, setCidade] = useState(user?.cidade ?? '')
  const [escolaridade, setEscolaridade] = useState(user?.escolaridade ?? '')
  const [interesses, setInteresses] = useState(user?.interesses ?? [])
  const [resumo, setResumo] = useState(user?.resumo ?? '')
  const [experiencias, setExperiencias] = useState(user?.experiencias ?? [])
  const [curriculo, setCurriculo] = useState(user?.curriculo ?? null)

  const [novaExp, setNovaExp] = useState(experienciaVazia)
  const [erroExp, setErroExp] = useState('')
  const [erroPdf, setErroPdf] = useState('')
  const [erroForm, setErroForm] = useState('')
  const [salvo, setSalvo] = useState(false)
  const inputPdf = useRef(null)

  if (!user) return <Navigate to="/login" state={{ from: '/perfil' }} replace />

  if (carregando || erro) {
    return <Estado titulo="Meu Perfil" carregando={carregando} erro={erro} onTentar={recarregar} />
  }

  const meusCursos = cursos.filter((c) => inscricoes.includes(c.id))
  const minhasVagas = vagas.filter((v) => candidaturas.includes(v.id))
  const cpfMascarado = '***.***.***-' + user.cpf.slice(-2)

  const textoSync = {
    carregando: '☁ Carregando seus dados...',
    salvando: '☁ Salvando na nuvem...',
    salvo: '☁ Dados salvos na nuvem',
    erro: '⚠ Não foi possível salvar na nuvem (seus dados continuam neste navegador)',
  }[sincronizacao]

  // Atualiza um campo de texto e tira o aviso "salvo"
  function editar(setter) {
    return (e) => {
      setter(e.target.value)
      setSalvo(false)
    }
  }

  function alternarInteresse(c) {
    setSalvo(false)
    setInteresses((atual) => (atual.includes(c) ? atual.filter((x) => x !== c) : [...atual, c]))
  }

  /* ----- Experiências ----- */
  function editarNovaExp(campo) {
    return (e) => setNovaExp((atual) => ({ ...atual, [campo]: e.target.value }))
  }

  function adicionarExperiencia() {
    if (!novaExp.cargo.trim() || !novaExp.empresa.trim()) {
      setErroExp('Preencha pelo menos o cargo e a empresa.')
      return
    }
    setExperiencias((atual) => [...atual, { id: Date.now(), ...novaExp }])
    setNovaExp(experienciaVazia)
    setErroExp('')
    setSalvo(false)
  }

  function removerExperiencia(id) {
    setExperiencias((atual) => atual.filter((x) => x.id !== id))
    setSalvo(false)
  }

  // Enter nesses campos adiciona a experiência em vez de salvar o perfil todo
  function enterAdiciona(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      adicionarExperiencia()
    }
  }

  /* ----- Currículo em PDF ----- */
  function aoEscolherPdf(e) {
    const arquivo = e.target.files[0]
    e.target.value = ''
    if (!arquivo) return

    if (arquivo.type !== 'application/pdf') {
      setErroPdf('Envie um arquivo em PDF.')
      return
    }
    if (arquivo.size > LIMITE_PDF) {
      setErroPdf('O PDF precisa ter até 500 KB.')
      return
    }

    const leitor = new FileReader()
    leitor.onload = () => {
      setCurriculo({ nome: arquivo.name, tamanho: arquivo.size, dataUrl: leitor.result })
      setErroPdf('')
      setSalvo(false)
    }
    leitor.onerror = () => setErroPdf('Não foi possível ler o arquivo.')
    leitor.readAsDataURL(arquivo)
  }

  async function abrirCurriculo() {
    const resposta = await fetch(curriculo.dataUrl)
    const blob = await resposta.blob()
    window.open(URL.createObjectURL(blob), '_blank')
  }

  function removerCurriculo() {
    setCurriculo(null)
    setSalvo(false)
  }

  /* ----- Salvar ----- */
  function salvar(e) {
    e.preventDefault()

    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErroForm('Digite um e-mail válido (ex.: nome@email.com).')
      setSalvo(false)
      return
    }

    setErroForm('')
    atualizarPerfil({
      nome: nome.trim() || user.nome,
      email: email.trim(),
      cidade,
      escolaridade,
      interesses,
      resumo,
      experiencias,
      curriculo,
    })
    setSalvo(true)
  }

  return (
    <section className="container page">
      <h1 className="page-title">Meu Perfil</h1>
      {textoSync && <p className="muted small sync-status">{textoSync}</p>}

      <div className="profile-layout">
        <form className="profile-form" onSubmit={salvar}>
          {/* ----- Dados ----- */}
          <div className="card form">
            <h2>Meus dados</h2>

            <label>
              Nome completo
              <input type="text" value={nome} onChange={editar(setNome)} />
            </label>

            <label>
              CPF
              <input type="text" value={cpfMascarado} disabled />
            </label>

            <label>
              E-mail
              <input
                type="email"
                placeholder="nome@email.com"
                value={email}
                onChange={editar(setEmail)}
              />
            </label>

            <label>
              Cidade
              <input type="text" value={cidade} onChange={editar(setCidade)} />
            </label>

            <label>
              Escolaridade
              <select value={escolaridade} onChange={editar(setEscolaridade)}>
                <option value="">Selecione...</option>
                {escolaridades.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </label>

            <fieldset>
              <legend>Áreas de interesse</legend>
              <div className="filters">
                {categorias.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={interesses.includes(c) ? 'filter active' : 'filter'}
                    onClick={() => alternarInteresse(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {/* ----- Objetivo ----- */}
          <div className="card form">
            <h2>
              Resumo e objetivos <span className="optional">(opcional)</span>
            </h2>
            <label>
              Conte um pouco sobre você e o que busca
              <textarea
                rows={4}
                maxLength={LIMITE_RESUMO}
                placeholder="Ex.: Busco meu primeiro emprego na área administrativa. Tenho facilidade com computador e gosto de atendimento ao público."
                value={resumo}
                onChange={editar(setResumo)}
              />
            </label>
            <small className="muted counter">
              {resumo.length}/{LIMITE_RESUMO}
            </small>
          </div>

          {/* ----- Experiências ----- */}
          <div className="card form">
            <h2>
              Experiências anteriores <span className="optional">(opcional)</span>
            </h2>

            {experiencias.length === 0 ? (
              <p className="muted">
                Nenhuma experiência adicionada. Estágios, trabalhos e até serviços informais contam!
              </p>
            ) : (
              <ul className="mini-list">
                {experiencias.map((x) => (
                  <li key={x.id}>
                    <div>
                      <strong>{x.cargo}</strong>
                      <small className="muted">
                        {x.empresa}
                        {x.periodo && ` · ${x.periodo}`}
                      </small>
                      {x.descricao && <small>{x.descricao}</small>}
                    </div>
                    <button type="button" className="link-btn" onClick={() => removerExperiencia(x.id)}>
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="exp-box">
              <h3>Adicionar experiência</h3>
              <div className="exp-grid">
                <label>
                  Cargo
                  <input
                    type="text"
                    value={novaExp.cargo}
                    onChange={editarNovaExp('cargo')}
                    onKeyDown={enterAdiciona}
                  />
                </label>
                <label>
                  Empresa
                  <input
                    type="text"
                    value={novaExp.empresa}
                    onChange={editarNovaExp('empresa')}
                    onKeyDown={enterAdiciona}
                  />
                </label>
                <label className="span-2">
                  Período
                  <input
                    type="text"
                    placeholder="Ex.: Jan/2024 a Jun/2025"
                    value={novaExp.periodo}
                    onChange={editarNovaExp('periodo')}
                    onKeyDown={enterAdiciona}
                  />
                </label>
                <label className="span-2">
                  O que você fazia
                  <textarea
                    rows={2}
                    value={novaExp.descricao}
                    onChange={editarNovaExp('descricao')}
                  />
                </label>
              </div>
              {erroExp && <p className="form-error">{erroExp}</p>}
              <button type="button" className="btn btn-outline" onClick={adicionarExperiencia}>
                + Adicionar experiência
              </button>
            </div>
          </div>

          {/* ----- Currículo ----- */}
          <div className="card form">
            <h2>
              Currículo em PDF <span className="optional">(opcional)</span>
            </h2>

            {curriculo ? (
              <div className="pdf-box">
                <span className="pdf-icon" aria-hidden="true">
                  PDF
                </span>
                <div className="pdf-info">
                  <strong>{curriculo.nome}</strong>
                  <small className="muted">{Math.max(1, Math.round(curriculo.tamanho / 1024))} KB</small>
                </div>
                <div className="pdf-actions">
                  <button type="button" className="link-btn" onClick={abrirCurriculo}>
                    Visualizar
                  </button>
                  <a href={curriculo.dataUrl} download={curriculo.nome}>
                    Baixar
                  </a>
                  <button type="button" className="link-btn" onClick={removerCurriculo}>
                    Remover
                  </button>
                </div>
              </div>
            ) : (
              <p className="muted">Nenhum currículo enviado ainda.</p>
            )}

            <input
              ref={inputPdf}
              type="file"
              accept="application/pdf"
              hidden
              onChange={aoEscolherPdf}
            />
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => inputPdf.current.click()}
            >
              {curriculo ? 'Trocar currículo' : 'Enviar currículo (PDF)'}
            </button>
            <small className="muted">Apenas PDF, de até 500 KB.</small>
            {erroPdf && <p className="form-error">{erroPdf}</p>}
          </div>

          {/* ----- Salvar ----- */}
          <div className="save-bar">
            {erroForm && <p className="form-error">{erroForm}</p>}
            {salvo && <p className="form-ok">✓ Dados salvos!</p>}
            <button type="submit" className="btn btn-green btn-lg">
              Salvar alterações
            </button>
          </div>
        </form>

        {/* ----- Lateral ----- */}
        <div className="profile-side">
          <div className="card">
            <h2>Meus cursos</h2>
            {meusCursos.length === 0 ? (
              <p className="muted">
                Você ainda não se inscreveu em nenhum curso. <Link to="/cursos">Ver cursos</Link>
              </p>
            ) : (
              <ul className="mini-list">
                {meusCursos.map((c) => (
                  <li key={c.id}>
                    <div>
                      <Link to={`/cursos/${c.id}`}>
                        <strong>{c.titulo}</strong>
                      </Link>
                      <small className="muted">
                        {c.categoria} · {c.cargaHoraria}h
                      </small>
                    </div>
                    <button type="button" className="link-btn" onClick={() => toggleInscricao(c.id)}>
                      Cancelar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h2>Minhas candidaturas</h2>
            {minhasVagas.length === 0 ? (
              <p className="muted">
                Você ainda não se candidatou a nenhuma vaga. <Link to="/vagas">Ver vagas</Link>
              </p>
            ) : (
              <ul className="mini-list">
                {minhasVagas.map((v) => (
                  <li key={v.id}>
                    <div>
                      <Link to={`/vagas/${v.id}`}>
                        <strong>{v.titulo}</strong>
                      </Link>
                      <small className="muted">
                        {v.empresa} · {v.modalidade}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => toggleCandidatura(v.id)}
                    >
                      Cancelar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* "Porteira": só mostra o formulário quando a conta está carregada    */
/* ------------------------------------------------------------------ */
export default function Perfil() {
  const { user, contaPronta, erroConta } = useApp()

  if (!user) return <Navigate to="/login" state={{ from: '/perfil' }} replace />

  if (!contaPronta) {
    return (
      <Estado
        titulo="Meu Perfil"
        carregando={!erroConta}
        erro="Não foi possível carregar seus dados da nuvem."
        onTentar={() => window.location.reload()}
      />
    )
  }

  return <PerfilForm />
}