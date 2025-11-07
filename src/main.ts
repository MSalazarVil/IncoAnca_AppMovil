import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom } from '@angular/core';
import { addIcons } from 'ionicons';
import { idCardOutline, pencilOutline, lockClosedOutline } from 'ionicons/icons';

import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { environment } from './environments/environment';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Iniciar firebase manualmente
const firebaseApp = initializeApp(environment.firebaseConfig);
const firestore = getFirestore(firebaseApp);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // registro manual de las instancias de firebase
    { provide: 'firebaseApp', useValue: firebaseApp },
    { provide: 'firestore', useValue: firestore }
  ],
}).then(() => {
  addIcons({ idCardOutline, pencilOutline, lockClosedOutline });
});