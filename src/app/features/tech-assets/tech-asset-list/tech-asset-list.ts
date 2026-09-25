import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TechAssetService } from '../tech-asset.service';
import { CurrentUserService } from '../../../core/auth/current-user.service';
import { TechAsset, AssetStatus } from '../../../core/models/tech-asset.model';

@Component({
  selector: 'app-tech-asset-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './tech-asset-list.html',
})
export class TechAssetListComponent implements OnInit {
  private readonly assetService = inject(TechAssetService);
  private statusFilterSignal = signal<AssetStatus | 'Todos'>('Todos');

  assets = this.assetService.assets;
  loading = this.assetService.loading;
  statusFilter = computed(() => this.statusFilterSignal());

  filteredAssets = computed(() => {
    const filter = this.statusFilterSignal();
    const all = this.assetService.assets();
    return filter === 'Todos' ? all : all.filter((a) => a.status === filter);
  });

  statuses: (AssetStatus | 'Todos')[] = [
    'Todos',
    'Disponible',
    'Asignado',
    'EnReparacion',
    'DadoDeBaja',
  ];

  constructor(
    private router: Router,
    public currentUser: CurrentUserService,
  ) {}

  ngOnInit(): void {
    this.assetService.loadAll();
  }

  setFilter(status: AssetStatus | 'Todos') {
    this.statusFilterSignal.set(status);
  }

  goToCreate() {
    this.router.navigate(['/tech-assets/new']);
  }

  goToEdit(id: string) {
    this.router.navigate(['/tech-assets', id, 'edit']);
  }

  async release(asset: TechAsset) {
    const result = await Swal.fire({
      title: `¿Liberar ${asset.assetTag}?`,
      text: `Actualmente asignado a ${asset.assignedTo}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, liberar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    this.assetService.release(asset.id).subscribe({
      next: () => {
        Swal.fire('Liberado', `${asset.assetTag} ya está disponible.`, 'success');
        this.assetService.loadAll();
      },
      error: (err) => this.showError(err),
    });
  }

  async softDelete(asset: TechAsset) {
    const result = await Swal.fire({
      title: `¿Dar de baja ${asset.assetTag}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, dar de baja',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    });

    if (!result.isConfirmed) return;

    this.assetService.softDelete(asset.id).subscribe({
      next: () => {
        Swal.fire('Dado de baja', `${asset.assetTag} fue dado de baja.`, 'success');
        this.assetService.loadAll();
      },
      error: (err) => this.showError(err),
    });
  }

  private showError(err: any) {
    // El backend devuelve RFC 7807 (ProblemDetails): err.error.detail trae el mensaje de negocio
    const message = err?.error?.detail ?? 'Ocurrió un error inesperado.';
    Swal.fire('Error', message, 'error');
  }

  statusBadgeClass(status: AssetStatus): string {
    const classes: Record<AssetStatus, string> = {
      Disponible: 'bg-green-100 text-green-800',
      Asignado: 'bg-blue-100 text-blue-800',
      EnReparacion: 'bg-yellow-100 text-yellow-800',
      DadoDeBaja: 'bg-gray-200 text-gray-600',
    };
    return classes[status];
  }
}
