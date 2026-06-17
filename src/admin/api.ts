import { Pet, AdoptionApplication } from '../types';

const API_BASE = '/api';

// ---- Data mapping (Supabase flat → frontend nested) ----

function mapPet(row: any): Pet {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    breed: row.breed || '',
    age: row.age || '',
    gender: row.gender || '公',
    weight: row.weight || '',
    status: row.status || '寻找领养中',
    location: row.location || '',
    distance: row.distance || '',
    description: row.description || '',
    tags: row.tags || [],
    image: row.image || '',
    health: {
      vaccination: row.vaccination || '',
      neutered: row.neutered || '',
      dewormed: row.dewormed || '',
    },
    requirements: row.requirements || [],
    isFavorite: row.is_favorite ?? false,
  };
}

function mapApplication(row: any): AdoptionApplication {
  return {
    id: row.id,
    petId: row.pet_id,
    petName: row.pet_name,
    petImage: row.pet_image,
    phone: row.phone || '',
    environment: row.environment || '',
    ownership: row.ownership || '',
    experience: row.experience || '',
    intent: row.intent || '',
    status: row.status,
    progressStep: row.progress_step ?? 1,
    dateSubmitted: row.date_submitted,
  };
}

// ---- HTTP helper ----

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `请求失败: ${res.status}`);
  }
  return res.json();
}

// ---- Admin API ----

export interface AdminStats {
  petCount: number;
  byCategory: Record<string, number>;
  applicationCount: number;
  byStatus: Record<string, number>;
  favoriteCount: number;
}

export const adminApi = {
  // 统计
  getStats: (): Promise<AdminStats> =>
    request<AdminStats>('/admin/stats'),

  // 宠物 CRUD
  getPets: async (): Promise<Pet[]> => {
    const rows = await request<any[]>('/pets');
    return rows.map(mapPet);
  },

  addPet: async (pet: Pet): Promise<Pet> => {
    const body: any = {
      id: pet.id,
      name: pet.name,
      category: pet.category,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      weight: pet.weight,
      status: pet.status,
      location: pet.location,
      distance: pet.distance,
      description: pet.description,
      tags: pet.tags,
      image: pet.image,
      vaccination: pet.health.vaccination,
      neutered: pet.health.neutered,
      dewormed: pet.health.dewormed,
      requirements: pet.requirements,
      is_favorite: pet.isFavorite || false,
    };
    const row = await request<any>('/pets', { method: 'POST', body: JSON.stringify(body) });
    return mapPet(row);
  },

  updatePet: async (pet: Pet): Promise<Pet> => {
    const body: any = {
      name: pet.name,
      category: pet.category,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      weight: pet.weight,
      status: pet.status,
      location: pet.location,
      distance: pet.distance,
      description: pet.description,
      tags: pet.tags,
      image: pet.image,
      vaccination: pet.health.vaccination,
      neutered: pet.health.neutered,
      dewormed: pet.health.dewormed,
      requirements: pet.requirements,
      is_favorite: pet.isFavorite || false,
    };
    const row = await request<any>(`/pets/${pet.id}`, { method: 'PUT', body: JSON.stringify(body) });
    return mapPet(row);
  },

  deletePet: (id: string): Promise<{ success: boolean }> =>
    request(`/pets/${id}`, { method: 'DELETE' }),

  // 申请 CRUD
  getApplications: async (): Promise<AdoptionApplication[]> => {
    const rows = await request<any[]>('/applications');
    return rows.map(mapApplication);
  },

  updateApplication: async (id: string, updates: Partial<AdoptionApplication>): Promise<AdoptionApplication> => {
    const body: any = {};
    if (updates.status !== undefined) body.status = updates.status;
    if (updates.progressStep !== undefined) body.progress_step = updates.progressStep;
    const row = await request<any>(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(body) });
    return mapApplication(row);
  },

  deleteApplication: (id: string): Promise<{ success: boolean }> =>
    request(`/applications/${id}`, { method: 'DELETE' }),
};
