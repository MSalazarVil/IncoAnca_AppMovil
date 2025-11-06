import { Injectable } from "@angular/core";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: "root" })
export class FirebaseService {
  private db: any;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  async login(username: string, password: string) {
    const usuariosRef = collection(this.db, "Empleados");

    // Validar si el usuario existe
    const qUsuario = query(usuariosRef, where("user", "==", username));
    const usuarioSnapshot = await getDocs(qUsuario);
    if (usuarioSnapshot.empty) {
      return { error: "usuario_no_encontrado" } as any;
    }

    // Si el usuario existe, validamos la contraseña
    const d = usuarioSnapshot.docs[0];
    const userData: any = d.data();
    if (userData["password"] !== password) {
      return { error: "contrasena_incorrecta" } as any;
    }
    // Devolver datos con id
    return { id: d.id, ...userData } as any;
  }

  // Nuevo modelo: 'representante' guarda el userId directamente
  async getEmpresaPorRepresentante(userId: string) {
    if (!userId) return null;
    const empresasRef = collection(this.db, "empresas");
    const qEmp = query(empresasRef, where("representante", "==", userId));
    const snap = await getDocs(qEmp);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...d.data() } as any;
  }

  // Acepta id tipo "1k0m4..." o ruta "/empresas/1k0m4..."
  async getEmpresaPorPath(pathOrId: string) {
    if (!pathOrId) return null;
    const id = pathOrId.includes("/")
      ? pathOrId.split("/").filter(Boolean)[1]
      : pathOrId;
    if (!id) return null;
    const ref = doc(this.db, "empresas", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as any;
  }

  // Listar usuarios con rol 'cliente'
  async listClientes() {
    const usuariosRef = collection(this.db, "users");
    const qCli = query(usuariosRef, where("rol", "==", "cliente"));
    const snap = await getDocs(qCli);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  // Obtener empresa asociada a un cliente por path/id o por representante
  async getEmpresaDeCliente(cliente: any) {
    if (!cliente) return null;
    const path = cliente?.empresaAsociada || "";
    if (path) {
      try {
        return await this.getEmpresaPorPath(path);
      } catch {
        /* ignore */
      }
    }
    try {
      return await this.getEmpresaPorRepresentante(cliente.id);
    } catch {
      return null;
    }
  }

  async getDocumentByRef(docRef: any): Promise<any | null> {
    if (!docRef) {
      return null;
    }
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() || {}) };
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document by reference:", error);
      return null;
    }
  }

  async getProyectoById(proyectoId: string): Promise<any | null> {
    if (!proyectoId) return null;
    const docRef = doc(this.db, "proyectos", proyectoId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as any;
  }

  async getProyectosPorResponsable(userId: string) {
    if (!userId) return [];
    try {
      const proyectosRef = collection(this.db, "proyectos");
      // Crear referencia al documento del empleado responsable
      const responsableRef = doc(this.db, "Empleados", userId);
      // Filtrar proyectos por referencia de responsable
      const qProyectos = query(proyectosRef, where("responsable", "==", responsableRef));
      const snap = await getDocs(qProyectos);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    } catch (error) {
      console.error("Error al obtener proyectos por responsable:", error);
      return [];
    }
  }

  async getAllProyectos() {
    try {
      const proyectosRef = collection(this.db, "proyectos");
      const snap = await getDocs(proyectosRef);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    } catch (error) {
      console.error("Error al obtener todos los proyectos:", error);
      return [];
    }
  }

  async createProject(projectData: any) {
    try {
      const proyectosRef = collection(this.db, "proyectos");
      await addDoc(proyectosRef, projectData);
      console.log("Proyecto añadido a Firestore:", projectData);
    } catch (error) {
      console.error("Error al añadir proyecto a Firestore:", error);
      throw error;
    }
  }
}
