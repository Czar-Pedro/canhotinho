import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db, firebaseAtivo } from './firebase.js'

const idDoUsuario = (cpf) => cpf.replace(/\D/g, '')

export async function buscarUsuario(cpf) {
  if (!firebaseAtivo) return null
  const snap = await getDoc(doc(db, 'usuarios', idDoUsuario(cpf)))
  return snap.exists() ? snap.data() : null
}

export async function salvarUsuario(cpf, dados) {
  if (!firebaseAtivo) return
  // O Firestore não aceita valores "undefined"; esse truque remove todos.
  const limpo = JSON.parse(JSON.stringify(dados))
  await setDoc(
    doc(db, 'usuarios', idDoUsuario(cpf)),
    { ...limpo, atualizadoEm: serverTimestamp() },
    { merge: true }
  )
}