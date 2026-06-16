import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// POST /api/applications - 提交领养申请
router.post('/applications', async (req: Request, res: Response) => {
  try {
    const application = req.body;
    const { data, error } = await supabase
      .from('adoption_applications')
      .insert([application])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications - 获取申请列表
router.get('/applications', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('adoption_applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/applications/:id - 更新申请状态
router.put('/applications/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('adoption_applications')
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

export default router;
