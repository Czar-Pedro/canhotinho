import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { listarCursos, listarVagas } from '../services/api.js'

const DadosContext = createContext(null)

const unicas = (lista) => [...new Set(lista)].sort((a, b) => a.localeCompare(b, 'pt-BR'))

export function DadosProvider({ children }) {
  const [cursos, setCursos] = useState([])
  const [vagas, setVagas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  const carregar = useCallback(async () => {
    setCarregando(true)
    setErro('')
    try {
      const [c, v] = await Promise.all([listarCursos(), listarVagas()])
      setCursos(c)
      setVagas(v)
    } catch {
      setErro('Não foi possível carregar os dados. Verifique sua conexão e tente novamente.')
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const categoriasCursos = useMemo(() => unicas(cursos.map((c) => c.categoria)), [cursos])
  const categoriasVagas = useMemo(() => unicas(vagas.map((v) => v.categoria)), [vagas])
  const categorias = useMemo(
    () => unicas([...categoriasCursos, ...categoriasVagas]),
    [categoriasCursos, categoriasVagas]
  )

  return (
    <DadosContext.Provider
      value={{
        cursos,
        vagas,
        categorias,
        categoriasCursos,
        categoriasVagas,
        carregando,
        erro,
        recarregar: carregar,
      }}
    >
      {children}
    </DadosContext.Provider>
  )
}

export function useDados() {
  const ctx = useContext(DadosContext)
  if (!ctx) throw new Error('useDados deve ser usado dentro de <DadosProvider>')
  return ctx
}