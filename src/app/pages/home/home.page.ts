import { Component, OnInit } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { FirebaseService } from "../../services/firebase.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class HomePage implements OnInit {
  nombreUsuario = "";
  rol = "";
  segmentoSeleccionado: string = "activos";
  proyectosActivos: any[] = [];
  proyectosTerminados: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.authService.getUserName().subscribe((name) => {
      this.nombreUsuario = name || "";
      console.log("Nombre de usuario cargado:", this.nombreUsuario);
    });
    this.authService.getUserRole().subscribe((role) => {
      this.rol = role || "";
      console.log("Rol de usuario cargado:", this.rol);
    });
    this.loadProyectos();
  }

  async loadProyectos() {
    console.log("Cargando proyectos...");
    try {
      // Obtener ID de documento del empleado logueado (asegurarse que sea el ID del documento en Firebase)
      const employeeDocId = localStorage.getItem("userId");
      if (!employeeDocId) {
        console.warn("No se encontró ID de documento del empleado en localStorage.");
        return;
      }
      const allProyectos = await this.firebaseService.getProyectosPorResponsable(employeeDocId);
      console.log("Proyectos obtenidos de Firebase para el empleado con ID de documento:", employeeDocId, allProyectos);
      // Process each project to determine the number of observations
      const proyectosConObservaciones = allProyectos.map((proyecto: any) => {
        // Assuming 'observacion' is a single DocumentReference or undefined
        const numObservaciones = proyecto.observacion ? 1 : 0;
        return { ...proyecto, numObservaciones };
      });

      // Filtrar proyectos según el estado registrado en Firebase (minúsculas)
      this.proyectosActivos = proyectosConObservaciones.filter(
        (proyecto: any) => proyecto.estado === "activo"
      );
      this.proyectosTerminados = proyectosConObservaciones.filter(
        (proyecto: any) => proyecto.estado === "finalizado"
      );
      console.log("Proyectos activos:", this.proyectosActivos);
      console.log("Proyectos terminados:", this.proyectosTerminados);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  }

  navigateAndBlur(path: string | any[]) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    if (Array.isArray(path)) {
      this.router.navigate(path, { replaceUrl: true });
    } else {
      this.router.navigateByUrl(path, { replaceUrl: true });
    }
  }

  cerrarSesion() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.authService.logout();
    this.router.navigateByUrl("/login", { replaceUrl: true });
  }

  get isEmpleado() {
    return this.rol === "empleado";
  }
  get isCliente() {
    return this.rol === "cliente";
  }
}
