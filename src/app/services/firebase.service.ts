import { Injectable } from '@angular/core';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  private db;

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
      return { error: 'usuario_no_encontrado' };
    }

    // Si el usuario existe, validamos la contraseña
    const userData = usuarioSnapshot.docs[0].data();
    if (userData['password'] !== password) {
      return { error: 'contrasena_incorrecta' };
    }

    // Si todo es validado, se retornan los datos
    return userData;
  }
}