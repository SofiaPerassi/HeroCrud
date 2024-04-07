import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CreateHeroComponent } from './pages/create-hero/create-hero.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/landing-page',
        pathMatch: 'full'
    },
    {
        path: 'landing-page',
        component: LandingPageComponent
    },
    {
        path: 'create',
        component: CreateHeroComponent
    }
    
];
