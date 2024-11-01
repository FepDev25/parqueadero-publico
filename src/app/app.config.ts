import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-publico-f1ecd","appId":"1:150151900838:web:5e3d783055ff00a67e8e67","storageBucket":"parqueadero-publico-f1ecd.appspot.com","apiKey":"AIzaSyDjtvakfWRS7oBOQq66Det_C0_kzUz88BU","authDomain":"parqueadero-publico-f1ecd.firebaseapp.com","messagingSenderId":"150151900838"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
