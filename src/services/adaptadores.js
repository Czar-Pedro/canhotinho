// ÚNICO lugar que conhece o formato dos dados "de fora".
// Se a fonte oficial usar outros nomes de campo, ajuste aqui e nada mais.
// Tudo que sai daqui tem formato garantido, então as páginas não quebram com dados faltando.

const texto = (v, padrao = '') => (v == null || v === '' ? padrao : String(v))
const lista = (v) => (Array.isArray(v) ? v.map(String) : [])
const numero = (v) => Number(v) || 0

export function normalizarCurso(d) {
  return {
    id: d.id,
    titulo: texto(d.titulo ?? d.nome, 'Curso sem título'),
    descricao: texto(d.descricao),
    categoria: texto(d.categoria ?? d.area, 'Outros'),
    cargaHoraria: numero(d.cargaHoraria ?? d.carga_horaria),
    vagas: numero(d.vagas),
    inscritos: numero(d.inscritos),
    inicio: texto(d.inicio, 'A definir'),
    horario: texto(d.horario, 'A definir'),
    local: texto(d.local, 'A definir'),
    instrutor: texto(d.instrutor, 'Não informado'),
    publico: texto(d.publico),
    requisitos: lista(d.requisitos),
    conteudo: lista(d.conteudo),
  }
}

export function normalizarVaga(d) {
  return {
    id: d.id,
    titulo: texto(d.titulo ?? d.cargo, 'Vaga sem título'),
    empresa: texto(d.empresa, 'Empresa não informada'),
    descricao: texto(d.descricao),
    categoria: texto(d.categoria ?? d.area, 'Outros'),
    modalidade: texto(d.modalidade, 'Presencial'),
    tipo: texto(d.tipo, 'Emprego'),
    local: texto(d.local, 'Canhotinho'),
    salario: texto(d.salario, 'A combinar'),
    jornada: texto(d.jornada, 'A combinar'),
    prazo: texto(d.prazo, 'Não informado'),
    atividades: lista(d.atividades),
    requisitos: lista(d.requisitos),
    beneficios: lista(d.beneficios),
  }
}