import { createContext, useContext, useEffect, useState } from 'react'
import { firebaseAtivo } from '../services/firebase.js'
import { buscarUsuario, salvarUsuario } from '../services/usuarios.js'

const AppContext = createContext(null)

function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      if (value === null) localStorage.removeItem(key)
      else localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* localStorage indisponível: segue sem persistir */
    }
  }, [key, value])

  return [value, setValue]
}

function alternar(lista, id) {
  return lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]
}

export function AppProvider({ children }) {
  const [user, setUser] = usePersistentState('canhotinho:user', null)
  const [inscricoes, setInscricoes] = usePersistentState('canhotinho:inscricoes', [])
  const [candidaturas, setCandidaturas] = usePersistentState('canhotinho:candidaturas', [])

  // "pronto" = os dados da conta já foram conferidos na nuvem.
  // Sem Firebase não há o que esperar, então já começa pronto.
  const [pronto, setPronto] = useState(!firebaseAtivo)
  const [sincronizacao, setSincronizacao] = useState(firebaseAtivo ? 'ocioso' : 'local')

  const cpf = user?.cpf ?? null

  // 1) Ao entrar (ou reabrir o site já logado): busca os dados da pessoa na nuvem.
  useEffect(() => {
    if (!firebaseAtivo) return
    if (!cpf) {
      setPronto(false)
      setSincronizacao('ocioso')
      return
    }

    let cancelado = false
    setPronto(false)
    setSincronizacao('carregando')

    buscarUsuario(cpf)
      .then((remoto) => {
        if (cancelado) return
        if (remoto) {
          setUser((atual) => (atual ? { ...atual, ...remoto.perfil } : atual))
          setInscricoes(remoto.inscricoes ?? [])
          setCandidaturas(remoto.candidaturas ?? [])
        }
        setPronto(true)
        setSincronizacao('salvo')
      })
      .catch(() => {
        // Não marca como pronto: assim nada do navegador sobrescreve a nuvem por engano.
        if (!cancelado) setSincronizacao('erro')
      })

    return () => {
      cancelado = true
    }
  }, [cpf])

  // 2) Sempre que algo mudar (e a conta estiver pronta): grava na nuvem.
  useEffect(() => {
    if (!firebaseAtivo || !pronto || !cpf) return

    setSincronizacao('salvando')
    const espera = setTimeout(() => {
      salvarUsuario(cpf, { perfil: user, inscricoes, candidaturas })
        .then(() => setSincronizacao('salvo'))
        .catch(() => setSincronizacao('erro'))
    }, 500)

    return () => clearTimeout(espera)
  }, [pronto, cpf, user, inscricoes, candidaturas])

  const login = (data) => setUser(data)

  const logout = () => {
    setUser(null)
    // Com banco, as inscrições pertencem à pessoa e ficam guardadas lá.
    if (firebaseAtivo) {
      setInscricoes([])
      setCandidaturas([])
    }
  }

  const atualizarPerfil = (dados) => setUser((atual) => ({ ...atual, ...dados }))

  // Enquanto a conta não estiver pronta, ignora cliques (evita perder a ação).
  const toggleInscricao = (id) => {
    if (!pronto) return
    setInscricoes((atual) => alternar(atual, id))
  }
  const toggleCandidatura = (id) => {
    if (!pronto) return
    setCandidaturas((atual) => alternar(atual, id))
  }

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        atualizarPerfil,
        inscricoes,
        toggleInscricao,
        candidaturas,
        toggleCandidatura,
        contaPronta: pronto,
        erroConta: sincronizacao === 'erro' && !pronto,
        sincronizacao,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de <AppProvider>')
  return ctx
}