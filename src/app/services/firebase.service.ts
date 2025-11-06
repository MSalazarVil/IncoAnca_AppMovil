import { Injectable } from '@angular/core';
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private db: any;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  async login(username: string, password: string) {
    const usuariosRef = collection(this.db, 'users');

    // Validar si el usuario existe
    const qUsuario = query(usuariosRef, where('username', '==', username));
    const usuarioSnapshot = await getDocs(qUsuario);
    if (usuarioSnapshot.empty) {
      return { error: 'usuario_no_encontrado' } as any;
    }

    // Si el usuario existe, validamos la contraseña
    const d = usuarioSnapshot.docs[0];
    const userData: any = d.data();
    if (userData['password'] !== password) {
      return { error: 'contrasena_incorrecta' } as any;
    }
    // Devolver datos con id
    return { id: d.id, ...userData } as any;
  }

  // Nuevo modelo: 'representante' guarda el userId directamente
  async getEmpresaPorRepresentante(userId: string) {
    if (!userId) return null;
    const empresasRef = collection(this.db, 'empresas');
    const qEmp = query(empresasRef, where('representante', '==', userId));
    const snap = await getDocs(qEmp);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as any;
  }

  // Acepta id tipo "1k0m4..." o ruta "/empresas/1k0m4..."
  async getEmpresaPorPath(pathOrId: string) {
    if (!pathOrId) return null;
    const id = pathOrId.includes('/') ? pathOrId.split('/').filter(Boolean)[1] : pathOrId;
    if (!id) return null;
    const ref = doc(this.db, 'empresas', id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as any;
  }
}
