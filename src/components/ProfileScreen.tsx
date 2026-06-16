import React, { useState } from "react";
import { User, ClipboardList, Heart, BookOpen, Settings, Phone, ChevronRight, Edit3, MessageCircle, Info, Check } from "lucide-react";
import { UserProfile, AdoptionApplication, Pet } from "../types";
import { PawPrint } from "./Icons";

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  applications: AdoptionApplication[];
  favoritePets: Pet[];
  onSelectPet: (pet: Pet) => void;
}

export default function ProfileScreen({
  profile,
  onUpdateProfile,
  applications,
  favoritePets,
  onSelectPet
}: ProfileScreenProps) {
  // Edit mode details
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);
  const [editedBio, setEditedBio] = useState(profile.bio);

  // Active view subsets within profile screen
  const [selectedSubView, setSelectedSubView] = useState<"menu" | "applications" | "favorites" | "guide" | "settings">("menu");

  const [contactAdvisor, setContactAdvisor] = useState(false);

  // Submit profile edits
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedName.trim()) return;

    onUpdateProfile({
      ...profile,
      name: editedName,
      bio: editedBio
    });
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-background min-h-screen pb-28">
      {/* Top Banner Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-white/85 backdrop-blur-md border-b border-surface-container-high/40">
        <div className="flex items-center gap-2">
          <PawPrint className="text-primary w-5 h-5 fill-current" />
          <h1 className="text-base font-bold text-primary tracking-tight">PawMate - 个人中心</h1>
        </div>
        <span className="text-xs bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 rounded-full font-bold">
          {selectedSubView === "menu" ? "我的" : selectedSubView === "applications" ? "我的申请" : selectedSubView === "favorites" ? "收藏的宠物" : selectedSubView === "guide" ? "领养指南" : "系统设置"}
        </span>
      </header>

      <main className="pt-20 px-5 max-w-xl mx-auto">
        {selectedSubView === "menu" && (
          <div className="space-y-6 animate-fade-in">
            {/* User Profile Header section */}
            <section className="text-center mt-4">
              <div className="relative inline-block group">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-surface-container-highest transition-transform duration-300 group-hover:scale-104">
                  <img
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                    src={profile.avatar}
                  />
                </div>
                {/* Edit trigger overlay bubble */}
                <button
                  type="button"
                  title="编辑资料"
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-1 right-1 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center border border-white shadow-sm cursor-pointer active:scale-90 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Editing form vs static details representation */}
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="mt-4 max-w-xs mx-auto bg-white p-4 rounded-xl border border-surface-container shadow-xs space-y-3">
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full h-9 px-3 border border-outline-variant rounded-lg text-sm text-center"
                    placeholder="编辑大名"
                  />
                  <input
                    type="text"
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full h-9 px-3 border border-outline-variant rounded-lg text-xs text-center text-on-surface-variant"
                    placeholder="编辑个性签名"
                  />
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 bg-surface-container-high rounded-md text-xs font-semibold cursor-pointer"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-primary text-white rounded-md text-xs font-semibold cursor-pointer"
                    >
                      保存
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-3">
                  <h2 className="text-lg font-bold text-on-surface flex items-center justify-center gap-1">
                    {profile.name}
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-1">{profile.bio}</p>
                </div>
              )}
            </section>

            {/* Stats grid display */}
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl custom-shadow border border-surface-container flex flex-col items-center justify-center">
                <span className="text-primary font-bold text-lg md:text-xl">
                  {profile.stationsWatched}
                </span>
                <span className="text-on-surface-variant text-[11px] font-medium mt-1">关注的救助站</span>
              </div>
              <div className="bg-white p-4 rounded-xl custom-shadow border border-surface-container flex flex-col items-center justify-center">
                <span className="text-secondary font-bold text-lg md:text-xl">
                  {profile.successfulAdoptions}
                </span>
                <span className="text-on-surface-variant text-[11px] font-medium mt-1 font-sans">已成功领养</span>
              </div>
            </section>

            {/* List Navigation Menu Items */}
            <nav className="space-y-3">
              {/* Item 1: 我的申请 */}
              <button
                type="button"
                onClick={() => setSelectedSubView("applications")}
                className="w-full group flex items-center justify-between p-4 bg-white rounded-xl custom-shadow border border-surface-container hover:bg-surface-container-low transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-container">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-semibold text-on-surface">我的申请</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-error text-white text-[10px] px-2 py-0.5 rounded-full mr-2 font-bold">
                    {applications.length}
                  </span>
                  <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:translate-x-1.5 transition-transform" />
                </div>
              </button>

              {/* Item 2: 收藏的宠物 */}
              <button
                type="button"
                onClick={() => setSelectedSubView("favorites")}
                className="w-full group flex items-center justify-between p-4 bg-white rounded-xl custom-shadow border border-surface-container hover:bg-surface-container-low transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/40 flex items-center justify-center text-on-secondary-container">
                    <Heart className="w-5 h-5 fill-current text-secondary" />
                  </div>
                  <span className="text-sm font-semibold text-on-surface">收藏的宠物</span>
                </div>
                <div className="flex items-center">
                  {favoritePets.length > 0 && (
                    <span className="bg-secondary text-white text-[10px] px-2 py-0.5 rounded-full mr-2 font-bold">
                      {favoritePets.length}
                    </span>
                  )}
                  <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:translate-x-1.5 transition-transform" />
                </div>
              </button>

              {/* Item 3: 领养指南 */}
              <button
                type="button"
                onClick={() => setSelectedSubView("guide")}
                className="w-full group flex items-center justify-between p-4 bg-white rounded-xl custom-shadow border border-surface-container hover:bg-surface-container-low transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-container">
                    <BookOpen className="w-5 h-5 text-tertiary" />
                  </div>
                  <span className="text-sm font-semibold text-on-surface">领养指南</span>
                </div>
                <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:translate-x-1.5 transition-transform" />
              </button>

              {/* Item 4: 系统设置 */}
              <button
                type="button"
                onClick={() => setSelectedSubView("settings")}
                className="w-full group flex items-center justify-between p-4 bg-white rounded-xl custom-shadow border border-surface-container hover:bg-surface-container-low transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant animate-spin-hover">
                    <Settings className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <span className="text-sm font-semibold text-on-surface">设置</span>
                </div>
                <ChevronRight className="w-5 h-5 text-on-surface-variant group-hover:translate-x-1.5 transition-transform" />
              </button>
            </nav>

            {/* Help Prompt Card expert advisor */}
            <div className="mt-8 p-6 bg-primary-container/10 border border-primary-container/20 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative z-10 space-y-2">
                <h3 className="font-bold text-base text-on-primary-container">领养遇到困难？</h3>
                <p className="text-xs text-on-primary-container/80 leading-normal max-w-[280px]">
                  联系我们的专家顾问团队，获取 1对1 的专业及免审条件评估建议指导。
                </p>
                <button
                  type="button"
                  onClick={() => setContactAdvisor(true)}
                  className="mt-3 px-5 py-2.5 bg-primary text-white font-semibold text-xs rounded-xl active:scale-95 transition-all transform cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-white/90" />
                  联系顾问
                </button>
              </div>
              <div className="absolute right-0 -bottom-4 w-28 h-28 text-primary/10 select-none pointer-events-none">
                <PawPrint className="w-full h-full fill-current" />
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Applications management list sub-view */}
        {selectedSubView === "applications" && (
          <div className="space-y-4 animate-fade-in">
            <button
              onClick={() => setSelectedSubView("menu")}
              className="text-xs text-primary font-bold hover:underline mb-1 cursor-pointer flex items-center gap-1"
            >
              ← 返回个人中心
            </button>

            {applications.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border text-center text-on-surface-variant text-xs font-medium">
                您目前尚未提交任何领养意向书。
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="bg-white p-4 rounded-xl border border-surface-container custom-shadow space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={app.petImage} alt={app.petName} className="w-11 h-11 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-on-surface">{app.petName} 领养申请书</h4>
                        <p className="text-[10px] text-on-surface-variant font-medium">提交于 {app.dateSubmitted}</p>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] rounded-full font-bold bg-primary-fixed text-on-primary-fixed-variant">
                        {app.status}
                      </span>
                    </div>
                    <div className="text-xs border-t border-surface-container pt-3 space-y-1.5 text-on-surface-variant">
                      <p><span className="font-semibold text-on-surface">联系电话：</span>{app.phone}</p>
                      <p><span className="font-semibold text-on-surface">居住保障：</span>{app.environment}</p>
                      <p><span className="font-semibold text-on-surface">申请动机：</span>{app.intent}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dynamic Favorites detailed list sub-view */}
        {selectedSubView === "favorites" && (
          <div className="space-y-4 animate-fade-in">
            <button
              onClick={() => setSelectedSubView("menu")}
              className="text-xs text-primary font-bold hover:underline mb-1 cursor-pointer flex items-center gap-1"
            >
              ← 返回个人中心
            </button>

            {favoritePets.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border text-center text-on-surface-variant text-xs font-medium">
                您还没有点击收藏任何心仪的宠物。
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {favoritePets.map((pet) => (
                  <div
                    key={pet.id}
                    onClick={() => onSelectPet(pet)}
                    className="bg-white rounded-xl overflow-hidden border border-surface-container custom-shadow cursor-pointer hover:scale-102 transition-all"
                  >
                    <img src={pet.image} alt={pet.name} className="w-full h-32 object-cover" />
                    <div className="p-3">
                      <h4 className="font-bold text-sm text-on-surface">{pet.name}</h4>
                      <p className="text-[10px] text-on-surface-variant">{pet.category} · {pet.breed}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Educational PDF/Booklet style "领养指南" */}
        {selectedSubView === "guide" && (
          <div className="space-y-5 animate-fade-in">
            <button
              onClick={() => setSelectedSubView("menu")}
              className="text-xs text-primary font-bold hover:underline mb-1 cursor-pointer flex items-center gap-1"
            >
              ← 返回个人中心
            </button>

            <div className="bg-white p-5 rounded-2xl border border-surface-container custom-shadow space-y-5">
              <div className="text-center pb-4 border-b">
                <h3 className="font-bold text-base text-on-surface">新手必读：科学饲育知识手册</h3>
                <p className="text-[10px] text-on-surface-variant mt-1">用心爱护生命的正确方式</p>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-on-surface-variant">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-on-surface text-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    新手养狗须知
                  </h4>
                  <p>1. 必备硬件点检：牵引绳（工字或防冲爆安全型）、防静音跑针、科学品质粮食垫高盆架。</p>
                  <p>2. 注意饮食毒物：绝对严禁接触酒精、洋葱、巧克力、木糖醇，有致命急性衰竭危险！</p>
                  <p>3. 基础社交：幼犬期接种疫苗前不宜接触野鸟或外部未知犬只，保证每日充足遛弯脱敏。</p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-on-surface text-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                    科学养猫原则
                  </h4>
                  <p>1. 稳固安全第一：阳台必须装置金属加粗钢丝网！猫咪具备高空坠落天生习惯风险。</p>
                  <p>2. 主粮与蛋白质：高品质无谷深海鱼或冻干营养餐，切忌高淀粉杂牌劣质粮产生肾结石。</p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-bold text-on-surface text-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full text-xs" />
                    仓鼠与兔子饲养
                  </h4>
                  <p>1. 金丝雄仓鼠必单笼：仓鼠是不折不扣、极端主权化的独居小兽，交配繁育后必须立即分笼，否则会悲惨互伤。</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Simple settings menu triggers */}
        {selectedSubView === "settings" && (
          <div className="space-y-4 animate-fade-in">
            <button
              onClick={() => setSelectedSubView("menu")}
              className="text-xs text-primary font-bold hover:underline mb-1 cursor-pointer flex items-center gap-1"
            >
              ← 返回个人中心
            </button>

            <div className="bg-white p-5 rounded-2xl border border-surface-container custom-shadow space-y-4">
              <h3 className="font-bold text-sm text-on-surface pb-2 border-b">PawMate 系统设置</h3>
              <div className="space-y-3.5 text-xs text-on-surface-variant">
                <div className="flex justify-between items-center bg-surface p-3 rounded-xl border">
                  <span>暗黑夜间模式</span>
                  <span className="font-semibold text-outline">已适配系统自动调节</span>
                </div>
                <div className="flex justify-between items-center bg-surface p-3 rounded-xl border">
                  <span>推送新匹配提醒通知</span>
                  <span className="font-semibold text-secondary flex items-center gap-1">
                    <Check className="w-4.5 h-4.5" />
                    默认启用
                  </span>
                </div>
                <div className="flex justify-between items-center bg-surface p-3 rounded-xl border">
                  <span>清理应用本地缓存</span>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.clear();
                      alert("系统本地缓存已成功清理，请刷新重新运行以加载出厂默认数据。");
                      window.location.reload();
                    }}
                    className="px-3 py-1.5 bg-error text-white font-bold rounded-lg cursor-pointer"
                  >
                    重置缓存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Virtual Advisor Support */}
        {contactAdvisor && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-on-surface/50 backdrop-blur-xs cursor-pointer" onClick={() => setContactAdvisor(false)} />
            <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl z-10 border border-surface-container animate-scale-up">
              <div className="w-14 h-14 bg-primary-fixed flex items-center justify-center rounded-full mx-auto mb-4 text-primary">
                <Phone className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="font-bold text-base text-on-surface">已呼叫 PawMate 专家座席</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed mt-2 mb-6">
                金牌顾问顾问“林阿暖”正在紧急为您接入！由于目前在线咨询领养的人数较多，系统将为您配发VIP优先跟进序列号，保持电话状态，座席即刻为您致电。
              </p>
              <button
                type="button"
                onClick={() => setContactAdvisor(false)}
                className="w-full h-11 bg-primary text-white font-bold rounded-xl text-xs cursor-pointer hover:bg-primary-container transition-colors"
              >
                好的，我知道了
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

