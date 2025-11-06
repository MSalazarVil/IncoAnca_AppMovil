import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "login",
    loadComponent: () =>
      import("./pages/login/login.page").then((m) => m.LoginPage),
  },
  {
    path: "home",
    loadComponent: () =>
      import("./pages/home/home.page").then((m) => m.HomePage),
  },
  {
    path: "perfil",
    loadComponent: () =>
      import("./pages/perfil/perfil.page").then((m) => m.PerfilPage),
  },
  {
    path: "add-cliente",
    loadComponent: () =>
      import("./pages/empleado/add-cliente/add-cliente.page").then(
        (m) => m.AddClientePage
      ),
  },
  {
    path: "clientes",
    loadComponent: () =>
      import("./pages/empleado/clientes/clientes.page").then(
        (m) => m.ClientesPage
      ),
  },
  {
    path: "detalle-proyecto/:id",
    loadComponent: () =>
      import("./pages/detalle-proyecto/detalle-proyecto.page").then(
        (m) => m.DetalleProyectoPage
      ),
  },
];
