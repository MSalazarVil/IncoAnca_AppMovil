import { Component, OnInit, OnDestroy } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { FirebaseService } from "../../services/firebase.service";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class HomePage implements OnInit, OnDestroy {
  nombreUsuario = "";
  rol = "";
  segmentoSeleccionado: string = "activos";
  proyectosActivos: any[] = [];
  proyectosTerminados: any[] = [];
  private userSubscription: Subscription | undefined;
  private responsableId: string | undefined;
  searchTerm: string = '';
  allProyectos: any[] = [];

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
      const employeeDocId = localStorage.getItem("userId");
      if (!employeeDocId) {
        console.warn(
          "No se encontró ID de documento del empleado en localStorage."
        );
        return;
      }
      this.allProyectos =
        await this.firebaseService.getProyectosPorResponsable(employeeDocId);
      console.log(
        "Proyectos obtenidos de Firebase para el empleado con ID de documento:",
        employeeDocId,
        this.allProyectos
      );
      this.filterProyectos();
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
    }
  }

  filterProyectos() {
    const searchTermLower = this.searchTerm.toLowerCase();
    const filteredProyectos = this.allProyectos.filter((proyecto: any) =>
      proyecto.nombre.toLowerCase().includes(searchTermLower)
    );

    this.proyectosActivos = filteredProyectos.filter(
      (proyecto: any) => proyecto.estado === "activo"
    );
    this.proyectosTerminados = filteredProyectos.filter(
      (proyecto: any) => proyecto.estado === "finalizado"
    );
    console.log("Proyectos activos filtrados:", this.proyectosActivos);
    console.log("Proyectos terminados filtrados:", this.proyectosTerminados);
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
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  get isCliente() {
    return this.rol === "cliente";
  }
}
