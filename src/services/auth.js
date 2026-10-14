const CHAVE_PEDIDO = 'canhotinho:login-pedido'
const CHAVE_CODIGOS = 'canhotinho:login-codigos'

function aleatorio() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()
}

function ler(chave) {
  try {
    return JSON.parse(sessionStorage.getItem(chave))
  } catch {
    return null
  }
}

function gravar(chave, valor) {
  try {
    sessionStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    /* sessionStorage indisponível */
  }
}

/* 1) O site começa o login e devolve o endereço do provedor de identidade. */
export function iniciarLogin(destino = '/perfil') {
  const state = aleatorio()
  gravar(CHAVE_PEDIDO, { state, destino })
  return `/acesso-simulado?state=${state}`
}

export function lerPedido() {
  return ler(CHAVE_PEDIDO)
}

export function limparPedido() {
  try {
    sessionStorage.removeItem(CHAVE_PEDIDO)
  } catch {
    /* ignora */
  }
}

/* 2) O provedor autoriza e devolve um código temporário no endereço de retorno. */
export function autorizar({ nome, cpf }) {
  const pedido = lerPedido()
  const code = aleatorio()
  const codigos = ler(CHAVE_CODIGOS) ?? {}
  codigos[code] = { nome, cpf }
  gravar(CHAVE_CODIGOS, codigos)
  return `/auth/callback?code=${code}&state=${pedido.state}`
}

/* 3) O site troca o código pelos dados da pessoa (no real, isso é feito no servidor). */
export function trocarCodigoPorUsuario(code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const codigos = ler(CHAVE_CODIGOS) ?? {}
      const dados = codigos[code]
      if (!dados) {
        reject(new Error('Código inválido ou já utilizado.'))
        return
      }
      delete codigos[code] // o código só vale uma vez
      gravar(CHAVE_CODIGOS, codigos)
      resolve(dados)
    }, 700) // simula o tempo de uma chamada de rede
  })
}