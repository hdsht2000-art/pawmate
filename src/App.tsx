import { useState, useEffect } from "react";
import { ClipboardList, User, Home } from "lucide-react";
import { Pet, UserProfile, AdoptionApplication } from "./types";
import { api } from "./services/api";

// Components imports
import OnboardingScreen from "./components/OnboardingScreen";
import DiscoverScreen from "./components/DiscoverScreen";
import DetailsScreen from "./components/DetailsScreen";
import ApplyScreen from "./components/ApplyScreen";
import ProfileScreen from "./components/ProfileScreen";
import AddPetModal from "./components/AddPetModal";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"onboarding" | "discover" | "details" | "apply" | "profile">("onboarding");
  
  const [pets, setPets] = useState<Pet[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);

  // 从 API 加载数据
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [petsData, profileData, appsData] = await Promise.all([
          api.getPets(),
          api.getProfile(),
          api.getApplications(),
        ]);
        setPets(petsData || []);
        setProfile(profileData);
        setApplications(appsData || []);
      } catch (err: any) {
        console.error('加载数据失败:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 新增宠物
  const handleAddPet = async (newPet: Pet) => {
    try {
      const created = await api.addPet(newPet);
      setPets((prev) => [created, ...prev]);
      setIsAddPetOpen(false);
    } catch (err: any) {
      alert('添加宠物失败: ' + err.message);
    }
  };

  // 收藏切换
  const handleToggleFavorite = async (petId: string) => {
    try {
      await api.toggleFavorite(petId);
      setPets((prev) =>
        prev.map((pet) =>
          pet.id === petId ? { ...pet, isFavorite: !pet.isFavorite } : pet
        )
      );
      if (selectedPet && selectedPet.id === petId) {
        setSelectedPet((prev) => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
      }
    } catch (err: any) {
      console.error('收藏操作失败:', err);
    }
  };

  // 更新用户资料
  const handleUpdateProfile = async (updatedProfile: UserProfile) => {
    try {
      const result = await api.updateProfile(updatedProfile);
      setProfile(result);
    } catch (err: any) {
      alert('更新资料失败: ' + err.message);
    }
  };

  // 提交领养申请
  const handleAddApplication = async (newApp: AdoptionApplication) => {
    try {
      const created = await api.addApplication(newApp);
      setApplications((prev) => [created, ...prev]);
    } catch (err: any) {
      alert('提交申请失败: ' + err.message);
    }
  };

  // 收藏列表
  const favoritePets = pets.filter((p) => p.isFavorite);

  // 渲染屏幕
  const renderActiveScreen = () => {
    // 加载状态
    if (loading && currentScreen !== "onboarding") {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-on-surface-variant font-medium">正在加载数据...</p>
          </div>
        </div>
      );
    }

    // 错误状态
    if (error && currentScreen !== "onboarding") {
      return (
        <div className="flex items-center justify-center min-h-screen px-5">
          <div className="text-center space-y-4 max-w-sm">
            <p className="text-sm text-error font-medium">加载失败: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold"
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    switch (currentScreen) {
      case "onboarding":
        return <OnboardingScreen onStart={() => setCurrentScreen("discover")} />;
      
      case "discover":
        return (
          <DiscoverScreen
            pets={pets}
            onSelectPet={(pet) => {
              setSelectedPet(pet);
              setCurrentScreen("details");
            }}
            onOpenAddPet={() => setIsAddPetOpen(true)}
            onNavigateToTab={(tab) => {
              setCurrentScreen(tab === "discover" ? "discover" : tab === "apply" ? "apply" : "profile");
            }}
          />
        );

      case "details":
        return selectedPet ? (
          <DetailsScreen
            pet={selectedPet}
            onBack={() => setCurrentScreen("discover")}
            onToggleFavorite={handleToggleFavorite}
            onApply={(pet) => {
              setSelectedPet(pet);
              setCurrentScreen("apply");
            }}
          />
        ) : (
          <div className="p-8 text-center text-sm font-semibold text-on-surface">请选择欲看护的宠物</div>
        );

      case "apply":
        return (
          <ApplyScreen
            selectedPet={selectedPet}
            onBack={() => setCurrentScreen("discover")}
            onSubmit={handleAddApplication}
          />
        );

      case "profile":
        return profile ? (
          <ProfileScreen
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            applications={applications}
            favoritePets={favoritePets}
            onSelectPet={(pet) => {
              setSelectedPet(pet);
              setCurrentScreen("details");
            }}
          />
        ) : null;

      default:
        return <OnboardingScreen onStart={() => setCurrentScreen("discover")} />;
    }
  };

  const isTabVisible = currentScreen === "discover" || currentScreen === "profile";

  return (
    <div className="w-full min-h-screen bg-background relative selection:bg-primary-fixed selection:text-on-primary-fixed">
      {renderActiveScreen()}

      {isAddPetOpen && (
        <AddPetModal
          onClose={() => setIsAddPetOpen(false)}
          onAdd={handleAddPet}
        />
      )}

      {isTabVisible && (
        <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-4 pt-2 bg-white/90 backdrop-blur-md rounded-t-2xl shadow-xl border-t border-surface-container-high max-w-md mx-auto right-0">
          <button
            onClick={() => setCurrentScreen("discover")}
            className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              currentScreen === "discover"
                ? "bg-primary-container text-white rounded-full px-5 py-1.5 transform scale-102"
                : "text-on-surface-variant hover:text-primary active:scale-90"
            }`}
          >
            <Home className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-bold mt-1">发现</span>
          </button>

          <button
            onClick={() => {
              const harveyPet = pets.find((p) => p.id === "pet_harvey") || pets[0] || null;
              setSelectedPet(harveyPet);
              setCurrentScreen("apply");
            }}
            className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary active:scale-90 transition-all duration-200 cursor-pointer"
          >
            <ClipboardList className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-bold mt-1">申请</span>
          </button>

          <button
            onClick={() => setCurrentScreen("profile")}
            className={`flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
              currentScreen === "profile"
                ? "bg-primary-container text-white rounded-full px-5 py-1.5 transform scale-102"
                : "text-on-surface-variant hover:text-primary active:scale-90"
            }`}
          >
            <User className="w-5 h-5 stroke-[2]" />
            <span className="text-[10px] font-bold mt-1 font-sans">我的</span>
          </button>
        </nav>
      )}
    </div>
  );
}
