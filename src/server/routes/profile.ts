import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// GET /api/profile - 获取用户资料（默认返回第一条）
router.get('/profile', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || null);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/profile - 更新或创建用户资料
router.put('/profile', async (req: Request, res: Response) => {
  try {
    const profile = req.body;
    
    // 先检查是否存在
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
      .single();
    
    let result;
    if (existing) {
      result = await supabase
        .from('profiles')
        .update({ ...profile, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('profiles')
        .insert([profile])
        .select()
        .single();
    }
    
    if (result.error) throw result.error;
    res.json(result.data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
