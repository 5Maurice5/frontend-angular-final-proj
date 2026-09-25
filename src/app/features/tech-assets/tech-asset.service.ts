import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  TechAsset,
  CreateTechAssetRequest,
  UpdateTechAssetRequest,
  AssignTechAssetRequest,
} from '../../core/models/tech-asset.model';

@Injectable({ providedIn: 'root' })
export class TechAssetService {
  private readonly baseUrl = '/api/techassets';

  private assetsSignal = signal<TechAsset[]>([]);
  private loadingSignal = signal(false);

  assets = computed(() => this.assetsSignal());
  loading = computed(() => this.loadingSignal());
  totalCount = computed(() => this.assetsSignal().length);

  constructor(private http: HttpClient) {}

  loadAll() {
    this.loadingSignal.set(true);
    this.http.get<TechAsset[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.assetsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: () => this.loadingSignal.set(false),
    });
  }

  create(request: CreateTechAssetRequest) {
    return this.http.post<TechAsset>(this.baseUrl, request);
  }

  update(id: string, request: UpdateTechAssetRequest) {
    return this.http.put<TechAsset>(`${this.baseUrl}/${id}`, request);
  }

  assign(id: string, request: AssignTechAssetRequest) {
    return this.http.post<void>(`${this.baseUrl}/${id}/assign`, request);
  }

  release(id: string) {
    return this.http.post<void>(`${this.baseUrl}/${id}/release`, {});
  }

  softDelete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  getById(id: string) {
    return this.http.get<TechAsset>(`${this.baseUrl}/${id}`);
  }
}
