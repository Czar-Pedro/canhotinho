import { cursos as cursosLocais } from '../data/cursos.js'
import { vagas as vagasLocais } from '../data/vagas.js'
import { normalizarCurso, normalizarVaga } from './adaptadores.js'

// Se existir VITE_API_URL (arquivo .env), busca da API oficial.
// Se não existir, usa os dados de exemplo da pasta src/data.
const API_URL = import.meta.env.VITE_API_URL

export const usandoApi = Boolean(API_URL)

async function pegar(caminho) {
  const resposta = await fetch(`${API_URL}${caminho}`)
  if (!resposta.ok) throw new Error(`Erro ${resposta.status} ao buscar ${caminho}`)
  return resposta.json()
}

export async function listarCursos() {
  if (!usandoApi) return cursosLocais.map(normalizarCurso)
  const dados = await pegar('/cursos')
  return dados.map(normalizarCurso)
}

export async function listarVagas() {
  if (!usandoApi) return vagasLocais.map(normalizarVaga)
  const dados = await pegar('/vagas')
  return dados.map(normalizarVaga)
}