import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// POST /api/favorites/:petId - 收藏/取消收藏宠物
router.post('/favorites/:petId', async (req: Request, res: Response) => {
  try {
    const { petId } = req.params;
    const userId = 'default_user'; // 简单用户标识
    
    // 检查是否已收藏
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('pet_id', petId)
      .single();
    
    if (existing) {
      // 取消收藏
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      
      if (error) throw error;
      
      // 更新宠物的 is_favorite 标记
      await supabase.from('pets').update({ is_favorite: false }).eq('id', petId);
      
      res.json({ favorited: false });
    } else {
      // 添加收藏
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, pet_id: petId }]);
      
      if (error) throw error;
      
      // 更新宠物的 is_favorite 标记
      await supabase.from('pets').update({ is_favorite: true }).eq('id', petId);
      
      res.json({ favorited: true });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/favorites - 获取收藏列表
router.get('/favorites', async (_req: Request, res: Response) => {
  try {
    const userId = 'default_user';
    const { data, error } = await supabase
      .from('favorites')
      .select('pet_id, pets(*)')
      .eq('user_id', userId);
    
    if (error) throw error;
    const pets = data?.map(f => f.pets).filter(Boolean) || [];
    res.json(pets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
