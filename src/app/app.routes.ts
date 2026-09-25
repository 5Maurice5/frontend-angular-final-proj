import { Routes } from '@angular/router';
import { TechAssetListComponent } from './features/tech-assets/tech-asset-list/tech-asset-list';
import { TechAssetForm } from './features/tech-assets/tech-asset-form/tech-asset-form';

export const routes: Routes = [
  { path: '', redirectTo: 'tech-assets', pathMatch: 'full' },
  { path: 'tech-assets', component: TechAssetListComponent },
  { path: 'tech-assets/new', component: TechAssetForm },
  { path: 'tech-assets/:id/edit', component: TechAssetForm },
];
