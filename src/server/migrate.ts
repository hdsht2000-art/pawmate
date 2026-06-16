import { readFileSync } from 'fs';
import { Pool } from 'pg';
import { config } from 'dotenv';
import { resolve } from 'path';

// 加载环境变量
config({ path: resolve(process.cwd(), '.env') });

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('正在连接 Supabase 数据库...');
    
    // 读取 SQL 文件
    const sqlPath = resolve(process.cwd(), 'supabase/migrations/001_init.sql');
    const sql = readFileSync(sqlPath, 'utf-8');
    
    console.log('正在执行数据库迁移...');
    await pool.query(sql);
    
    console.log('数据库迁移执行成功!');
  } catch (err) {
    console.error('迁移失败:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
