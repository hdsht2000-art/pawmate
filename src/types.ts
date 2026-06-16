export interface HealthInfo {
  vaccination: string;
  neutered: string;
  dewormed: string;
}

export interface Pet {
  id: string;
  name: string;
  category: "猫咪" | "狗狗" | "小动物";
  breed: string;
  age: string;
  gender: "公" | "母";
  weight: string;
  status: "寻找领养中" | "已接种" | "已绝育" | "待领养";
  location: string;
  distance: string;
  description: string;
  tags: string[];
  image: string;
  health: HealthInfo;
  requirements: string[];
  isFavorite?: boolean;
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  phone: string;
  environment: string;
  ownership: "自有住宅" | "租赁住宅" | "集体宿舍" | string;
  experience: string;
  intent: string;
  status: "待审核" | "审核中" | "已通过" | "已拒绝";
  progressStep: number;
  dateSubmitted: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
  stationsWatched: number;
  successfulAdoptions: number;
}
