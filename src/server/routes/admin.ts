import { Router, Request, Response } from 'express';
import { supabase } from '../supabase';

const router = Router();

// GET /api/admin/stats - 统计数据
router.get('/admin/stats', async (_req: Request, res: Response) => {
  try {
    // 宠物总数
    const { count: petCount, error: petErr } = await supabase
      .from('pets').select('*', { count: 'exact', head: true });

    // 各分类数量
    const { data: pets, error: petsErr } = await supabase
      .from('pets').select('category');

    const byCategory: Record<string, number> = {};
    (pets || []).forEach((p: any) => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
    });

    // 申请总数
    const { count: appCount, error: appErr } = await supabase
      .from('adoption_applications').select('*', { count: 'exact', head: true });

    // 各状态申请数
    const { data: apps, error: appsErr } = await supabase
      .from('adoption_applications').select('status');

    const byStatus: Record<string, number> = {};
    (apps || []).forEach((a: any) => {
      byStatus[a.status] = (byStatus[a.status] || 0) + 1;
    });

    // 收藏总数
    const { count: favCount } = await supabase
      .from('favorites').select('*', { count: 'exact', head: true });

    res.json({
      petCount: petCount || 0,
      byCategory,
      applicationCount: appCount || 0,
      byStatus,
      favoriteCount: favCount || 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/applications/:id - 删除申请
router.delete('/applications/:id', async (req: Request, res: Response) => {
  try {
    const { error } = await supabase
      .from('adoption_applications')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
