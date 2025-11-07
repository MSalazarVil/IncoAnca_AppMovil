import { Injectable } from '@angular/core';
import { getFirestore, collection, getDocs, query, where, doc, getDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';
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

  async getUserById(userId: string) {
    if (!userId) return null;
    const ref = doc(this.db, 'users', userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as any;
  }

  async getPerfilCompleto(userId: string) {
    const user = await this.getUserById(userId);
    if (!user) return null;
    let empresa: any = null;
    try {
      if (user.rol === 'cliente') {
        empresa = await this.getEmpresaDeCliente(user);
      }
    } catch {
      empresa = null;
    }
    return { user, empresa } as any;
  }

  async updateUser(userId: string, data: any) {
    if (!userId || !data) return false;
    const ref = doc(this.db, 'users', userId);
    // Usamos set con merge para no pisar campos no editados
    try {
      await setDoc(ref, data, { merge: true });
      return true;
    } catch {
      return false;
    }
  }

  async createCliente(data: { nombre: string; email: string; username: string; password: string; empresaAsociada?: string }) {
    const usersCol = collection(this.db, 'users');
    const payload: any = {
      nombre: data.nombre,
      email: data.email,
      username: data.username,
      password: data.password,
      rol: 'cliente',
      createdAt: serverTimestamp()
    };
    if (data.empresaAsociada) payload.empresaAsociada = data.empresaAsociada;
    const ref = await addDoc(usersCol, payload);
    return { id: ref.id, ...payload } as any;
  }

  async createEmpresaAsociadaForCliente(clienteId: string, empresa: { razonSocial: string; ruc: string; direccion?: string; telefono?: string; tipoEntidad?: string }) {
    if (!clienteId) throw new Error('clienteId requerido');
    const empresasCol = collection(this.db, 'empresas');
    const payload: any = {
      razonSocial: empresa.razonSocial,
      ruc: empresa.ruc,
      representante: clienteId,
      estado: 'activo',
      fechaRegistro: serverTimestamp(),
    };
    if (empresa.direccion) payload.direccion = empresa.direccion; // usamos 'direccion' (sin acento) para coincidir con la UI
    if (empresa.telefono) payload.telefono = empresa.telefono;
    if (empresa.tipoEntidad) payload.tipoEntidad = empresa.tipoEntidad;
    const ref = await addDoc(empresasCol, payload);
    // guardar referencia en el usuario
    await this.updateUser(clienteId, { empresaAsociada: ref.id });
    return { id: ref.id, ...payload } as any;
  }

  async listEmpresas() {
    const empresasRef = collection(this.db, 'empresas');
    const snap = await getDocs(empresasRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
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

  // Listar usuarios con rol 'cliente'
  async listClientes() {
    const usuariosRef = collection(this.db, 'users');
    const qCli = query(usuariosRef, where('rol', '==', 'cliente'));
    const snap = await getDocs(qCli);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  // Obtener empresa asociada a un cliente por path/id o por representante
  async getEmpresaDeCliente(cliente: any) {
    if (!cliente) return null;
    const path = cliente?.empresaAsociada || '';
    if (path) {
      try { return await this.getEmpresaPorPath(path); } catch { /* ignore */ }
    }
    try { return await this.getEmpresaPorRepresentante(cliente.id); } catch { return null; }
  }

  // Proyectos
  async listProyectos() {
    const proyectosRef = collection(this.db, 'proyectos');
    const snap = await getDocs(proyectosRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async listProyectosPorEmpresa(empresaId: string) {
    if (!empresaId) return [] as any[];
    const proyectosRef = collection(this.db, 'proyectos');
    // Algunos documentos pueden guardar el path completo, otros solo el id
    const qById = query(proyectosRef, where('empresaAsociada', '==', empresaId));
    const qByPath = query(proyectosRef, where('empresaAsociada', '==', `empresas/${empresaId}`));
    const [snapId, snapPath] = await Promise.all([getDocs(qById), getDocs(qByPath)]);
    const all = [...snapId.docs, ...snapPath.docs];
    const uniq = new Map<string, any>();
    all.forEach(d => {
      if (!uniq.has(d.id)) uniq.set(d.id, { id: d.id, ...d.data() });
    });
    return Array.from(uniq.values());
  }
}
