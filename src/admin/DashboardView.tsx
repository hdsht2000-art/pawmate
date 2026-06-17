import React, { useEffect, useState } from 'react';
import { PawPrint, ClipboardList, CheckCircle, Clock, Heart } from 'lucide-react';
import { adminApi, AdminStats } from './api';
import { AdoptionApplication } from '../types';

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[color] || colors.emerald}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardView() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentApps, setRecentApps] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, apps] = await Promise.all([
          adminApi.getStats(),
          adminApi.getApplications(),
        ]);
        setStats(s);
        setRecentApps(apps.slice(0, 5));
      } catch (err) {
        console.error('加载统计数据失败', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-red-500 text-center py-12">加载失败，请刷新重试</p>;
  }

  const statusColor: Record<string, string> = {
    '待审核': 'bg-amber-100 text-amber-700',
    '审核中': 'bg-blue-100 text-blue-700',
    '已通过': 'bg-green-100 text-green-700',
    '已拒绝': 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<PawPrint className="w-6 h-6" />} label="宠物总数" value={stats.petCount} color="emerald" />
        <StatCard icon={<ClipboardList className="w-6 h-6" />} label="申请总数" value={stats.applicationCount} color="blue" />
        <StatCard icon={<CheckCircle className="w-6 h-6" />} label="已通过" value={stats.byStatus['已通过'] || 0} color="green" />
        <StatCard icon={<Clock className="w-6 h-6" />} label="待审核" value={stats.byStatus['待审核'] || 0} color="amber" />
      </div>

      {/* Category distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">宠物分类分布</h3>
          <div className="space-y-3">
            {Object.entries(stats.byCategory).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-16 flex-shrink-0">{cat}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${stats.petCount ? ((count as number) / stats.petCount) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
            <Heart className="w-3.5 h-3.5" />
            收藏总数: {stats.favoriteCount}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">申请状态分布</h3>
          <div className="space-y-3">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full w-20 text-center ${statusColor[status] || 'bg-gray-100 text-gray-600'}`}>
                  {status}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${stats.applicationCount ? ((count as number) / stats.applicationCount) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent applications */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">最近申请</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 bg-gray-50">
                <th className="px-6 py-3 font-medium">宠物</th>
                <th className="px-6 py-3 font-medium">申请人手机</th>
                <th className="px-6 py-3 font-medium">状态</th>
                <th className="px-6 py-3 font-medium">提交日期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentApps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">暂无申请记录</td>
                </tr>
              ) : (
                recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img src={app.petImage} alt={app.petName} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-medium text-gray-800">{app.petName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-600">{app.phone}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[app.status] || 'bg-gray-100 text-gray-600'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{app.dateSubmitted}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
