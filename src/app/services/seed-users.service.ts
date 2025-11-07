import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';

type HashedPassword = {
  saltB64: string;
  hashB64: string;
  iterations: number;
  algo: 'PBKDF2-SHA256';
};

@Injectable({ providedIn: 'root' })
export class SeedUsersService {
  private db: any;

  constructor() {
    const app = initializeApp(environment.firebaseConfig);
    this.db = getFirestore(app);
  }

  // Deriva un hash con PBKDF2 + SHA-256 y sal aleatoria
  private async hashPassword(plain: string, iterations = 200_000): Promise<HashedPassword> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(plain), { name: 'PBKDF2' }, false, [
      'deriveBits'
    ]);
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
      keyMaterial,
      256 // 256 bits = 32 bytes
    );
    const hashBytes = new Uint8Array(bits);
    return {
      saltB64: this.toBase64(salt),
      hashB64: this.toBase64(hashBytes),
      iterations,
      algo: 'PBKDF2-SHA256'
    };
  }

  private toBase64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    // btoa acepta strings Latin1; los bytes 0-255 son válidos
    return btoa(binary);
  }

  // Crea los usuarios de ejemplo con contraseña hasheada.
  // Uso sugerido (temporal): inyectar este servicio y llamar a seedUsers() manualmente en un entorno de desarrollo.
  async seedUsers(): Promise<void> {
    const users = [
      {
        id: 't93T0xB9mbkxDlZVsjrz',
        email: 'inge@incoanca.com',
        nombre: 'Carlos Torres',
        password: 'inge123',
        rol: 'empleado',
        username: 'ingeniero',
        createdAt: '31 de octubre de 2025, 2:30:07 a.m. UTC-5'
      },
      {
        id: 'wMpIRmKoYzcTI24rtbFt',
        email: 'cliente@correo.com',
        empresaAsociada: '1k0m4T0cxTb1bz8urLdQ',
        nombre: 'Juan Pérez',
        password: 'cliente123',
        rol: 'cliente',
        username: 'cliente',
        createdAt: '31 de octubre de 2025, 2:31:57 a.m. UTC-5'
      },
      // Nuevo usuario empleado con contraseña 123456 (se guarda hasheada)
      {
        email: 'empleado@correo.com',
        nombre: 'Empleado Demo',
        password: '123456',
        rol: 'empleado',
        username: 'empleado',
        createdAt: new Date().toISOString()
      }
    ];

    const usersCol = collection(this.db, 'users');
    for (const u of users) {
      const hp = await this.hashPassword(u.password);
      const data: any = {
        email: u.email,
        nombre: u.nombre,
        rol: u.rol,
        username: u.username,
        createdAt: u.createdAt,
        // Compatibilidad temporal con el login actual (usa password plano):
        password: u.password,
        // Nuevos campos hasheados para migración segura:
        passwordHash: hp.hashB64,
        passwordSalt: hp.saltB64,
        passwordAlgo: hp.algo,
        passwordIterations: hp.iterations,
        passwordUpdatedToHashed: true
      };
      if (u.empresaAsociada) data.empresaAsociada = u.empresaAsociada;

      if ((u as any).id) {
        await setDoc(doc(this.db, 'users', (u as any).id), data, { merge: true });
      } else {
        await addDoc(usersCol, data);
      }
    }
  }
}
