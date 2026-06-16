import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// GET /api/pets - 获取所有宠物（支持分类筛选）
router.get('/pets', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let query = supabase.from('pets').select('*').order('created_at', { ascending: false });
    
    if (category && category !== '全部') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pets/:id - 获取单个宠物详情
router.get('/pets/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: '宠物不存在' });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/pets - 新增宠物
router.post('/pets', async (req: Request, res: Response) => {
  try {
    const pet = req.body;
    const { data, error } = await supabase
      .from('pets')
      .insert([pet])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/pets/:id - 更新宠物
router.put('/pets/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('pets')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/pets/:id - 删除宠物
router.delete('/pets/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
