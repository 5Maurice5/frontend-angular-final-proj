// features/tech-assets/tech-asset-form/tech-asset-form.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TechAssetService } from '../tech-asset.service';

@Component({
  selector: 'app-tech-asset-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tech-asset-form.html',
})
export class TechAssetForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly assetService = inject(TechAssetService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEditMode = signal(false);
  assetId = signal<string | null>(null);
  submitting = signal(false);

  form = this.fb.group({
    assetTag: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}-\d{4}-\d{3}$/)]],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    serialNumber: ['', [Validators.required, Validators.maxLength(50)]],
    purchasePrice: [0, [Validators.required, Validators.min(0.01)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.assetId.set(id);

      this.form.get('assetTag')?.disable();
      this.form.get('serialNumber')?.disable();

      this.loadAsset(id);
    }
  }

  private loadAsset(id: string): void {
    this.assetService.getById(id).subscribe({
      next: (asset) => {
        this.form.patchValue({
          assetTag: asset.assetTag,
          brand: asset.brand,
          model: asset.model,
          serialNumber: asset.serialNumber,
          purchasePrice: asset.purchasePrice,
        });
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar el activo.', 'error');
        this.router.navigate(['/tech-assets']);
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const raw = this.form.getRawValue(); // getRawValue incluye los campos disabled

    if (this.isEditMode()) {
      this.assetService
        .update(this.assetId()!, {
          brand: raw.brand!,
          model: raw.model!,
          purchasePrice: raw.purchasePrice!,
        })
        .subscribe({
          next: () => {
            Swal.fire('Actualizado', 'El activo se actualizó correctamente.', 'success');
            this.router.navigate(['/tech-assets']);
          },
          error: (err) => this.handleError(err),
        });
    } else {
      this.assetService
        .create({
          assetTag: raw.assetTag!,
          brand: raw.brand!,
          model: raw.model!,
          serialNumber: raw.serialNumber!,
          purchasePrice: raw.purchasePrice!,
        })
        .subscribe({
          next: () => {
            Swal.fire('Creado', 'El activo se registró correctamente.', 'success');
            this.router.navigate(['/tech-assets']);
          },
          error: (err) => this.handleError(err),
        });
    }
  }

  private handleError(err: any): void {
    this.submitting.set(false);
    const message = err?.error?.detail ?? 'Ocurrió un error inesperado.';
    Swal.fire('Error', message, 'error');
  }

  cancel(): void {
    this.router.navigate(['/tech-assets']);
  }
}
