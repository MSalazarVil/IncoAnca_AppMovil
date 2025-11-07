import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class EditProfileComponent implements OnInit {
  userId: string | null = null;
  nombre: string = '';
  email: string = '';
  cargo: string = '';
  telefono: string = '';
  usuario: string = '';
  rol: string = '';
  empresa: any = null;

  originalNombre: string = '';
  originalEmail: string = '';
  originalCargo: string = '';
  originalTelefono: string = '';
  originalUsuario: string = '';

  isEditing: boolean = false;
  passwordToAuthenticate: string = '';
  showPasswordPrompt: boolean = false;
  passwordError: string = '';

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    this.userId = this.authService.getUserIdSnapshot();
    this.nombre = this.authService.getNameSnapshot() ?? '';
    this.email = this.authService.getEmailSnapshot() ?? '';
    this.cargo = this.authService.getCargoSnapshot() ?? '';
    this.telefono = this.authService.getTelefonoSnapshot() ?? '';
    this.usuario = this.authService.getUsuarioSnapshot() ?? '';
    this.rol = this.authService.getRoleSnapshot() ?? '';

    const empresaId = this.authService.getUserEmpresaAsociadaSnapshot();
    if (empresaId) {
      this.firebaseService.getCompanyData(empresaId).then(empresa => {
        this.empresa = empresa;
      });
    } else {
      this.empresa = null;
    }

    this.saveOriginalUserData();
  }

  saveOriginalUserData() {
    this.originalNombre = this.nombre;
    this.originalEmail = this.email;
    this.originalCargo = this.cargo;
    this.originalTelefono = this.telefono;
    this.originalUsuario = this.usuario;
  }

  toggleEditMode() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.isEditing = !this.isEditing;
    this.showPasswordPrompt = true;
    this.passwordError = '';
    this.passwordToAuthenticate = '';
  }

  async authenticateAndEdit() {
    if (!this.passwordToAuthenticate) {
      this.passwordError = 'Por favor, ingresa tu contraseña.';
      return;
    }

    // Aquí deberías tener un método en AuthService o FirebaseService para verificar la contraseña
    // Por ahora, simularemos una verificación simple.
    // En un entorno real, NUNCA se debe verificar la contraseña en el cliente de esta manera.
    // Deberías llamar a un servicio de backend que verifique la contraseña de forma segura.
    const isAuthenticated = await this.firebaseService.verifyPassword(this.userId!, this.passwordToAuthenticate);

    if (isAuthenticated) {
      this.isEditing = true;
      this.showPasswordPrompt = false;
      this.passwordError = '';
    } else {
      this.passwordError = 'Contraseña incorrecta.';
    }
  }

  cancelAuthentication() {
    this.showPasswordPrompt = false;
    this.passwordError = '';
    this.passwordToAuthenticate = '';
  }

  cancelEdit() {
    this.isEditing = false;
    this.nombre = this.originalNombre;
    this.email = this.originalEmail;
    this.cargo = this.originalCargo;
    this.telefono = this.originalTelefono;
    this.usuario = this.originalUsuario;
  }

  async saveChanges() {
    if (!this.userId) {
      console.error('User ID is null. Cannot save changes.');
      return;
    }

    const updatedData = {
      nombre: this.nombre,
      email: this.email,
      cargo: this.cargo,
      telefono: this.telefono,
      user: this.usuario // 'user' es el campo en Firestore para el nombre de usuario
    };

    try {
      await this.firebaseService.updateUserData(this.userId, updatedData);
      this.authService.refreshUserData({
        nombre: this.nombre,
        email: this.email,
        cargo: this.cargo,
        telefono: this.telefono,
        usuario: this.usuario,
        // No se actualiza el rol ni la empresa asociada desde aquí, pero se podría añadir si fuera necesario
      });
      this.isEditing = false;
      this.saveOriginalUserData(); // Actualizar los datos originales después de guardar
      console.log('Perfil actualizado exitosamente.');
      // Opcional: Mostrar un mensaje de éxito al usuario
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      // Opcional: Mostrar un mensaje de error al usuario
    }
  }
}