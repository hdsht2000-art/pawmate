import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, MapPin, Plus, Heart, Dog, Cat, Layers, Bell } from "lucide-react";
import { Pet } from "../types";
import { PawPrint, PawIcon, NoPetsIcon } from "./Icons";

interface DiscoverScreenProps {
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
  onOpenAddPet: () => void;
  onNavigateToTab: (tab: "discover" | "apply" | "profile") => void;
}

export default function DiscoverScreen({ pets, onSelectPet, onOpenAddPet, onNavigateToTab }: DiscoverScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"全部" | "猫咪" | "狗狗" | "小动物">("全部");

  // Filter listings based on category selections + search terms
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchCategory = selectedCategory === "全部" || pet.category === selectedCategory;
      const matchSearch =
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [pets, selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-background min-h-screen pb-28">
      {/* Top App Bar Branding */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-white/85 backdrop-blur-md border-b border-surface-container-high/40 shadow-3xs">
        <div className="flex items-center gap-2">
          <PawPrint className="text-primary w-6 h-6 fill-current" />
          <h1 className="text-lg font-bold text-primary tracking-tight font-sans">PawMate</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            title="通知"
            onClick={() => alert("您目前暂无未读系统系统匹配通知。")}
            className="p-2 rounded-full hover:bg-surface-container-high active:scale-90 transition-all cursor-pointer relative"
          >
            <Bell className="w-5 h-5 text-on-surface-variant" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full" />
          </button>
          
          <div 
            onClick={() => onNavigateToTab("profile")}
            className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/50 cursor-pointer active:scale-95 transition-all"
          >
            <img
              alt="User Center Profile Portrait"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop"
            />
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="pt-20 px-5 max-w-4xl mx-auto">
        
        {/* Expanded Search input bar section */}
        <section className="mt-4">
          <div className="relative">
            <Search className="w-5 h-5 text-outline absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索您心仪可爱的宠物宝贝..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-12 bg-white border border-outline-variant rounded-xl font-medium text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all"
            />
            <button 
              type="button"
              title="进阶筛选"
              onClick={() => alert("为您开启智能高级个性化配对推荐，输入宠物名字即可。")}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 hover:bg-surface-container active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </button>
          </div>
        </section>

        {/* Tab categories segment filters */}
        <section className="mt-6 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {([
            { id: "全部", label: "全部", icon: Layers },
            { id: "猫咪", label: "猫咪", icon: Cat },
            { id: "狗狗", label: "狗狗", icon: Dog },
            { id: "小动物", label: "小动物", icon: PawIcon }
          ] as const).map((tab) => {
            const IconComponent = tab.icon;
            const isActive = selectedCategory === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  isActive
                    ? "bg-primary-container text-on-primary-container shadow-2xs scale-98"
                    : "bg-surface-container-high/60 text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </section>

        {/* Dynamic Grid list of pet cards */}
        <section className="mt-6">
          {filteredPets.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-surface-container">
              <NoPetsIcon className="w-16 h-16 text-outline mx-auto" />
              <h3 className="text-sm font-bold text-on-surface">未搜索到匹配项</h3>
              <p className="text-xs text-on-surface-variant max-w-[240px] mx-auto">请尝试更换检索关键字，或切换上方其他分类查找哦！</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {filteredPets.map((pet) => {
                const isDaimale = pet.gender === "公";

                return (
                  <div
                    key={pet.id}
                    onClick={() => onSelectPet(pet)}
                    className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md border border-surface-container/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col group relative"
                  >
                    {/* Visual Photo wrapper */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-surface-container">
                      <img
                        className="w-full h-full object-cover group-hover:scale-104 transition-all duration-700"
                        src={pet.image}
                        alt={pet.name}
                      />
                      {pet.status && (
                        <div className="absolute top-2.5 right-2.5 bg-secondary/85 text-white text-[10px] px-2.5 py-1 rounded-full font-bold backdrop-blur-xs">
                          {pet.status}
                        </div>
                      )}
                    </div>

                    {/* Meta values detail body */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-bold text-sm text-on-surface truncate pr-1 group-hover:text-primary transition-colors">
                            {pet.name}
                          </h3>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${isDaimale ? "text-blue-500 bg-blue-50" : "text-rose-505 bg-rose-50"}`}>
                            {pet.gender}
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-[11px] truncate">
                          {pet.breed} · {pet.age}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 mt-3.5 text-outline text-[10px] font-sans">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span>{pet.distance}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Primary FAB lists pet trigger modal */}
      <button
        id="fab-add-pet"
        onClick={onOpenAddPet}
        title="发布领养"
        className="fixed bottom-24 right-5 w-14 h-14 bg-primary-container text-white rounded-full shadow-lg hover:shadow-primary/30 flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all duration-200 z-40 cursor-pointer"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
}

