import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Pet } from '../types';
import { adminApi } from './api';

const emptyPet: Pet = {
  id: '', name: '', category: '猫咪', breed: '', age: '', gender: '公', weight: '',
  status: '寻找领养中', location: '', distance: '', description: '', tags: [],
  image: '', health: { vaccination: '', neutered: '', dewormed: '' }, requirements: [],
};

const statusColor: Record<string, string> = {
  '寻找领养中': 'bg-emerald-100 text-emerald-700',
  '已接种': 'bg-blue-100 text-blue-700',
  '已绝育': 'bg-purple-100 text-purple-700',
  '待领养': 'bg-amber-100 text-amber-700',
};

export default function PetsView() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Pet | null>(null);
  const [isNew, setIsNew] = useState(false);

  async function loadPets() {
    setLoading(true);
    try {
      setPets(await adminApi.getPets());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPets(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`确定删除宠物「${name}」吗？此操作不可恢复。`)) return;
    try {
      await adminApi.deletePet(id);
      setPets((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      alert('删除失败: ' + e.message);
    }
  }

  async function handleSave(pet: Pet) {
    try {
      if (isNew) {
        const saved = await adminApi.addPet(pet);
        setPets((prev) => [saved, ...prev]);
      } else {
        const saved = await adminApi.updatePet(pet);
        setPets((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      }
      setEditing(null);
    } catch (e: any) {
      alert('保存失败: ' + e.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">共 {pets.length} 只宠物</p>
        <button
          onClick={() => { setIsNew(true); setEditing({ ...emptyPet, id: `pet_${Date.now()}` }); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          新增宠物
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-medium">宠物</th>
                <th className="px-4 py-3 font-medium">分类</th>
                <th className="px-4 py-3 font-medium">品种</th>
                <th className="px-4 py-3 font-medium">年龄</th>
                <th className="px-4 py-3 font-medium">性别</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pets.map((pet) => (
                <tr key={pet.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={pet.image} alt={pet.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-medium text-gray-800">{pet.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{pet.category}</td>
                  <td className="px-4 py-3 text-gray-600">{pet.breed}</td>
                  <td className="px-4 py-3 text-gray-600">{pet.age}</td>
                  <td className="px-4 py-3 text-gray-600">{pet.gender}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[pet.status] || 'bg-gray-100 text-gray-600'}`}>
                      {pet.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setIsNew(false); setEditing({ ...pet }); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-emerald-600 transition-colors cursor-pointer"
                        title="编辑"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id, pet.name)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <PetEditModal
          pet={editing}
          isNew={isNew}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

/* ---- Pet Edit Modal ---- */

function PetEditModal({ pet: initial, isNew, onClose, onSave }: {
  pet: Pet; isNew: boolean; onClose: () => void; onSave: (pet: Pet) => void;
}) {
  const [pet, setPet] = useState<Pet>(initial);
  const [tagInput, setTagInput] = useState(pet.tags.join(', '));
  const [reqInput, setReqInput] = useState(pet.requirements.join('\n'));
  const [saving, setSaving] = useState(false);

  function update(field: string, value: any) {
    setPet((prev) => ({ ...prev, [field]: value }));
  }

  function updateHealth(field: string, value: string) {
    setPet((prev) => ({ ...prev, health: { ...prev.health, [field]: value } }));
  }

  async function handleSave() {
    const final = {
      ...pet,
      tags: tagInput.split(',').map((s) => s.trim()).filter(Boolean),
      requirements: reqInput.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    setSaving(true);
    try {
      await onSave(final);
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';
  const labelCls = 'block text-xs font-medium text-gray-600 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{isNew ? '新增宠物' : '编辑宠物'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>名称</label>
              <input className={inputCls} value={pet.name} onChange={(e) => update('name', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>ID</label>
              <input className={inputCls} value={pet.id} onChange={(e) => update('id', e.target.value)} disabled={!isNew} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>分类</label>
              <select className={inputCls} value={pet.category} onChange={(e) => update('category', e.target.value)}>
                <option value="猫咪">猫咪</option>
                <option value="狗狗">狗狗</option>
                <option value="小动物">小动物</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>品种</label>
              <input className={inputCls} value={pet.breed} onChange={(e) => update('breed', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>状态</label>
              <select className={inputCls} value={pet.status} onChange={(e) => update('status', e.target.value)}>
                <option value="寻找领养中">寻找领养中</option>
                <option value="已接种">已接种</option>
                <option value="已绝育">已绝育</option>
                <option value="待领养">待领养</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>年龄</label>
              <input className={inputCls} value={pet.age} onChange={(e) => update('age', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>性别</label>
              <select className={inputCls} value={pet.gender} onChange={(e) => update('gender', e.target.value)}>
                <option value="公">公</option>
                <option value="母">母</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>体重</label>
              <input className={inputCls} value={pet.weight} onChange={(e) => update('weight', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>距离</label>
              <input className={inputCls} value={pet.distance} onChange={(e) => update('distance', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>所在地</label>
            <input className={inputCls} value={pet.location} onChange={(e) => update('location', e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>图片 URL</label>
            <input className={inputCls} value={pet.image} onChange={(e) => update('image', e.target.value)} />
            {pet.image && (
              <img src={pet.image} alt="预览" className="mt-2 w-20 h-20 object-cover rounded-lg border border-gray-200" />
            )}
          </div>

          <div>
            <label className={labelCls}>描述</label>
            <textarea className={inputCls + ' h-20 resize-none'} value={pet.description} onChange={(e) => update('description', e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>标签 (逗号分隔)</label>
            <input className={inputCls} value={tagInput} onChange={(e) => setTagInput(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>疫苗接种</label>
              <input className={inputCls} value={pet.health.vaccination} onChange={(e) => updateHealth('vaccination', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>绝育状态</label>
              <input className={inputCls} value={pet.health.neutered} onChange={(e) => updateHealth('neutered', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>驱虫</label>
              <input className={inputCls} value={pet.health.dewormed} onChange={(e) => updateHealth('dewormed', e.target.value)} />
            </div>
          </div>

          <div>
            <label className={labelCls}>领养要求 (每行一条)</label>
            <textarea className={inputCls + ' h-24 resize-none'} value={reqInput} onChange={(e) => setReqInput(e.target.value)} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 text-sm bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-colors"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
