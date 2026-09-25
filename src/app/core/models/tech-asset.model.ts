export type AssetStatus = 'Disponible' | 'Asignado' | 'EnReparacion' | 'DadoDeBaja';

export interface TechAsset {
  id: string;
  assetTag: string;
  brand: string;
  model: string;
  serialNumber: string;
  status: AssetStatus;
  purchasePrice: number;
  assignedTo: string | null;
  createdAt: string;
  createdBy: string;
}

export interface CreateTechAssetRequest {
  assetTag: string;
  brand: string;
  model: string;
  serialNumber: string;
  purchasePrice: number;
}

export interface UpdateTechAssetRequest {
  brand: string;
  model: string;
  purchasePrice: number;
}

export interface AssignTechAssetRequest {
  employeeName: string;
}
