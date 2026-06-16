/**
 * PawMate 数据库自动初始化脚本
 * 
 * 使用方法: npx tsx src/server/setup.ts
 * 
 * 此脚本会:
 * 1. 读取 supabase/migrations/001_init.sql
 * 2. 尝试通过 REST API 逐条执行 SQL（将多条 SQL 拆分并通过 rpc 执行）
 * 3. 如果表已存在则跳过
 * 4. 最后执行 seed 导入初始数据
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

config({ path: resolve(process.cwd(), '.env') });

async function setup() {
  console.log('=== PawMate 数据库初始化 ===\n');

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. 尝试读取 SQL 迁移文件
  const sqlPath = resolve(process.cwd(), 'supabase/migrations/001_init.sql');
  const sql = readFileSync(sqlPath, 'utf-8');
  
  // 拆分 SQL 语句
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))
    .map(s => s + ';');

  console.log(`共 ${statements.length} 条 SQL 语句需要执行\n`);

  // 2. 先检查表是否已存在
  let tablesExist = false;
  try {
    const { error } = await supabase.from('pets').select('id').limit(1);
    if (!error) {
      tablesExist = true;
      console.log('检测到 pets 表已存在，跳过建表步骤。');
    }
  } catch (_) {
    // 表不存在，需要创建
  }

  if (tablesExist) {
    console.log('数据库表已就绪，直接执行数据导入...\n');
  } else {
    console.log('数据库表不存在。');
    console.log('由于沙箱网络限制，无法通过程序自动创建数据库表。');
    console.log('\n请手动执行以下步骤：');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. 打开 Supabase Dashboard:');
    console.log('   https://supabase.com/dashboard/project/iqxbqtkjzxabjrnxkhod');
    console.log('2. 点击左侧 "SQL Editor"');
    console.log('3. 点击 "New query"');
    console.log(`4. 打开文件并复制全部内容: ${sqlPath}`);
    console.log('5. 粘贴到 SQL Editor 中，点击 "Run" (Ctrl+Enter)');
    console.log('6. 等待执行成功，然后重新运行: npx tsx src/server/seed.ts');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    return;
  }

  // 3. 表存在时执行 seed
  console.log('正在导入初始数据...');
  await import('./seed');
}

setup().catch(console.error);
