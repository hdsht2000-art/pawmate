import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Trash2, Eye, X, Filter } from 'lucide-react';
import { AdoptionApplication } from '../types';
import { adminApi } from './api';

const statusColor: Record<string, string> = {
  '待审核': 'bg-amber-100 text-amber-700',
  '审核中': 'bg-blue-100 text-blue-700',
  '已通过': 'bg-green-100 text-green-700',
  '已拒绝': 'bg-red-100 text-red-700',
};

const allStatuses = ['全部', '待审核', '审核中', '已通过', '已拒绝'];

export default function ApplicationsView() {
  const [apps, setApps] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('全部');
  const [detail, setDetail] = useState<AdoptionApplication | null>(null);

  async function load() {
    setLoading(true);
    try {
      setApps(await adminApi.getApplications());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = filter === '全部' ? apps : apps.filter((a) => a.status === filter);

  async function handleApprove(id: string) {
    try {
      const updated = await adminApi.updateApplication(id, { status: '已通过' });
      setApps((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (e: any) {
      alert('操作失败: ' + e.message);
    }
  }

  async function handleReject(id: string) {
    try {
      const updated = await adminApi.updateApplication(id, { status: '已拒绝' });
      setApps((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (e: any) {
      alert('操作失败: ' + e.message);
    }
  }

  async function handleDelete(id: string, petName: string) {
    if (!confirm(`确定删除「${petName}」的领养申请吗？`)) return;
    try {
      await adminApi.deleteApplication(id);
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) {
      alert('删除失败: ' + e.message);
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
      {/* Header with filter */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          共 {apps.length} 条申请
          {filter !== '全部' && <span className="text-emerald-600 font-medium"> / {filter}: {filtered.length} 条</span>}
        </p>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {allStatuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors cursor-pointer ${
                filter === s
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-medium">宠物</th>
                <th className="px-4 py-3 font-medium">手机</th>
                <th className="px-4 py-3 font-medium">居住环境</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">提交日期</th>
                <th className="px-4 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">暂无符合条件的申请</td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={app.petImage} alt={app.petName} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-gray-800">{app.petName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{app.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{app.ownership}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[app.status] || 'bg-gray-100 text-gray-600'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{app.dateSubmitted}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetail(app)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {app.status === '待审核' && (
                          <>
                            <button
                              onClick={() => handleApprove(app.id)}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors cursor-pointer"
                              title="通过"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(app.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                              title="拒绝"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(app.id, app.petName)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetail(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">申请详情</h3>
              <button onClick={() => setDetail(null)} className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center gap-4">
                <img src={detail.petImage} alt={detail.petName} className="w-16 h-16 rounded-xl object-cover" />
                <div>
                  <p className="font-bold text-gray-800 text-lg">{detail.petName}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[detail.status] || 'bg-gray-100 text-gray-600'}`}>
                    {detail.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <InfoItem label="联系电话" value={detail.phone} />
                <InfoItem label="居住环境" value={detail.ownership} />
                <InfoItem label="提交日期" value={detail.dateSubmitted} />
                <InfoItem label="审核进度" value={`第 ${detail.progressStep} 步`} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">家庭环境描述</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{detail.environment || '未填写'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">养宠经验</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{detail.experience || '未填写'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-1">领养意向</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{detail.intent || '未填写'}</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              {detail.status === '待审核' && (
                <>
                  <button
                    onClick={() => { handleApprove(detail.id); setDetail(null); }}
                    className="px-4 py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                  >
                    通过
                  </button>
                  <button
                    onClick={() => { handleReject(detail.id); setDetail(null); }}
                    className="px-4 py-2 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                  >
                    拒绝
                  </button>
                </>
              )}
              <button onClick={() => setDetail(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  );
}
