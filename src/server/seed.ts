import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';
import { INITIAL_PETS, INITIAL_PROFILE, INITIAL_APPLICATIONS } from '../initialData';

config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('开始导入初始数据到 Supabase...');

  // 1. 导入宠物数据
  console.log(`正在导入 ${INITIAL_PETS.length} 只宠物...`);
  for (const pet of INITIAL_PETS) {
    const { data, error } = await supabase
      .from('pets')
      .insert([{
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
      }])
      .select('id')
      .single();
    
    if (error) {
      console.warn(`  宠物 ${pet.name} 导入失败:`, error.message);
    } else {
      console.log(`  ✓ ${pet.name} (${pet.breed})`);
    }
  }

  // 2. 导入用户资料
  console.log('正在导入用户资料...');
  const { error: profileErr } = await supabase.from('profiles').insert([{
    name: INITIAL_PROFILE.name,
    avatar: INITIAL_PROFILE.avatar,
    bio: INITIAL_PROFILE.bio,
    stations_watched: INITIAL_PROFILE.stationsWatched,
    successful_adoptions: INITIAL_PROFILE.successfulAdoptions,
  }]);
  if (profileErr) {
    console.warn('  用户资料导入失败:', profileErr.message);
  } else {
    console.log('  ✓ 用户资料已导入');
  }

  // 3. 导入领养申请
  console.log(`正在导入 ${INITIAL_APPLICATIONS.length} 条领养申请...`);
  for (const app of INITIAL_APPLICATIONS) {
    const { error } = await supabase.from('adoption_applications').insert([{
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
    }]);
    if (error) {
      console.warn(`  申请 ${app.petName} 导入失败:`, error.message);
    } else {
      console.log(`  ✓ 申请: ${app.petName}`);
    }
  }

  console.log('\n初始数据导入完成!');
}

seed().catch(console.error);
