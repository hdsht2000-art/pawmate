import { Pet, AdoptionApplication, UserProfile } from '../types';

const API_BASE = '/api';

// Supabase → Frontend 数据转换
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

function mapProfile(row: any): UserProfile {
  return {
    name: row.name || '',
    avatar: row.avatar || '',
    bio: row.bio || '',
    stationsWatched: row.stations_watched ?? 0,
    successfulAdoptions: row.successful_adoptions ?? 0,
  };
}

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

export const api = {
  // 宠物
  getPets: async (category?: string): Promise<Pet[]> => {
    const query = category && category !== '全部' ? `?category=${encodeURIComponent(category)}` : '';
    const rows = await request<any[]>(`/pets${query}`);
    return rows.map(mapPet);
  },

  getPet: async (id: string): Promise<Pet> => {
    const row = await request<any>(`/pets/${id}`);
    return mapPet(row);
  },

  addPet: async (pet: Pet): Promise<Pet> => {
    // Frontend → Supabase 转换
    const body = {
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

  // 领养申请
  getApplications: async (): Promise<AdoptionApplication[]> => {
    const rows = await request<any[]>('/applications');
    return rows.map(mapApplication);
  },

  addApplication: async (app: AdoptionApplication): Promise<AdoptionApplication> => {
    // Frontend → Supabase 转换
    const body = {
      id: app.id,
      pet_id: app.petId,
      pet_name: app.petName,
      pet_image: app.petImage,
      phone: app.phone,
      environment: app.environment,
      ownership: app.ownership,
      experience: app.experience,
      intent: app.intent,
      status: app.status,
      progress_step: app.progressStep,
      date_submitted: app.dateSubmitted,
    };
    const row = await request<any>('/applications', { method: 'POST', body: JSON.stringify(body) });
    return mapApplication(row);
  },

  // 用户资料
  getProfile: async (): Promise<UserProfile | null> => {
    const row = await request<any>('/profile');
    return row ? mapProfile(row) : null;
  },

  updateProfile: async (profile: UserProfile): Promise<UserProfile> => {
    // Frontend → Supabase 转换
    const body = {
      name: profile.name,
      avatar: profile.avatar,
      bio: profile.bio,
      stations_watched: profile.stationsWatched,
      successful_adoptions: profile.successfulAdoptions,
    };
    const row = await request<any>('/profile', { method: 'PUT', body: JSON.stringify(body) });
    return mapProfile(row);
  },

  // 收藏
  toggleFavorite: (petId: string): Promise<{ favorited: boolean }> =>
    request<{ favorited: boolean }>(`/favorites/${petId}`, { method: 'POST' }),

  getFavorites: async (): Promise<Pet[]> => {
    const rows = await request<any[]>('/favorites');
    return rows.map(mapPet);
  },
};
