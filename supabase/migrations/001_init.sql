-- PawMate 数据库初始化迁移（修复版）
-- 使用 TEXT 类型的 ID 以兼容前端字符串 ID

-- 先删除现有表（如存在）
DROP TABLE IF EXISTS adoption_applications CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS pets CASCADE;

-- 1. 宠物表
CREATE TABLE pets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  breed TEXT NOT NULL DEFAULT '',
  age TEXT NOT NULL DEFAULT '',
  gender TEXT NOT NULL DEFAULT '公',
  weight TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT '寻找领养中',
  location TEXT NOT NULL DEFAULT '',
  distance TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL DEFAULT '',
  vaccination TEXT NOT NULL DEFAULT '',
  neutered TEXT NOT NULL DEFAULT '',
  dewormed TEXT NOT NULL DEFAULT '',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. 领养申请表
CREATE TABLE adoption_applications (
  id TEXT PRIMARY KEY,
  pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  pet_name TEXT NOT NULL DEFAULT '',
  pet_image TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  environment TEXT NOT NULL DEFAULT '',
  ownership TEXT NOT NULL DEFAULT '',
  experience TEXT NOT NULL DEFAULT '',
  intent TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT '待审核',
  progress_step INT NOT NULL DEFAULT 1,
  date_submitted DATE NOT NULL DEFAULT CURRENT_DATE,
  user_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. 用户资料表
CREATE TABLE profiles (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL DEFAULT '',
  avatar TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  stations_watched INT NOT NULL DEFAULT 0,
  successful_adoptions INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. 收藏表
CREATE TABLE favorites (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL,
  pet_id TEXT NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, pet_id)
);

-- 启用 Row Level Security
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 公开读写策略
CREATE POLICY "公开读取宠物" ON pets FOR SELECT USING (true);
CREATE POLICY "公开新增宠物" ON pets FOR INSERT WITH CHECK (true);
CREATE POLICY "公开更新宠物" ON pets FOR UPDATE USING (true);
CREATE POLICY "公开删除宠物" ON pets FOR DELETE USING (true);

CREATE POLICY "公开读取申请" ON adoption_applications FOR SELECT USING (true);
CREATE POLICY "公开新增申请" ON adoption_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "公开更新申请" ON adoption_applications FOR UPDATE USING (true);

CREATE POLICY "公开读取资料" ON profiles FOR SELECT USING (true);
CREATE POLICY "公开新增资料" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "公开更新资料" ON profiles FOR UPDATE USING (true);

CREATE POLICY "公开读取收藏" ON favorites FOR SELECT USING (true);
CREATE POLICY "公开新增收藏" ON favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "公开删除收藏" ON favorites FOR DELETE USING (true);

-- 索引
CREATE INDEX idx_pets_category ON pets(category);
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_applications_pet_id ON adoption_applications(pet_id);
CREATE INDEX idx_applications_user_id ON adoption_applications(user_id);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_pet_id ON favorites(pet_id);
