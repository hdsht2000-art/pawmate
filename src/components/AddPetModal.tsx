import React, { useState } from "react";
import { X, PawPrint, Check } from "lucide-react";
import { Pet } from "../types";

interface AddPetModalProps {
  onClose: () => void;
  onAdd: (newPet: Pet) => void;
}

const PRESET_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=200&h=250&fit=crop",
    label: "金色金毛/混血犬"
  },
  {
    url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=250&fit=crop",
    label: "英短蓝猫/蓬松猫咪"
  },
  {
    url: "https://images.unsplash.com/photo-1587300003388-59205cc962cb?w=200&h=250&fit=crop",
    label: "金毛幼犬"
  },
  {
    url: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=250&fit=crop",
    label: "超萌垂耳兔"
  }
];

export default function AddPetModal({ onClose, onAdd }: AddPetModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<"猫咪" | "狗狗" | "小动物">("狗狗");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"公" | "母">("公");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState(PRESET_IMAGES[0].url);
  const [vaccination, setVaccination] = useState("已完成");
  const [neutered, setNeutered] = useState("已绝育");
  const [dewormed, setDewormed] = useState("定期进行中");
  const [requirementText, setRequirementText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed || !age || !weight) return;

    const requirements = requirementText
      ? requirementText.split("\n").filter((r) => r.trim() !== "")
      : [
          "在本地有固定看护并同意妥善养护。",
          "能够提供充足运动时间，给予必要的医疗关怀。",
          "签订正式领养承诺书，接受适当回访。"
        ];

    const newPet: Pet = {
      id: "pet_" + Date.now(),
      name,
      category,
      breed,
      age,
      gender,
      weight,
      status: "寻找领养中",
      location: "同城个人救助",
      distance: "0.5km",
      description: description || `${name}是一只非常亲切、极具亲和力的${breed}。性格好且懂事，期待一位温暖的家人带它回家共度美好时光。`,
      tags: [category + "宝宝", "温和亲近", breed],
      image: selectedImageUrl,
      health: {
        vaccination,
        neutered,
        dewormed
      },
      requirements
    };

    onAdd(newPet);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-on-surface/50 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      <div className="relative bg-surface rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl scale-100 transition-all border border-surface-container-high z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <PawPrint className="w-5 h-5 fill-current" />
            </div>
            <h3 className="text-xl font-bold text-on-surface">发布待领养宠物</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest active:scale-90 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Pet Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface-variant">宠物名字 *</label>
            <input
              type="text"
              required
              placeholder="请输入宠物可爱的名字，如：小白"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 bg-white rounded-xl border border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all text-sm font-sans"
            />
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface-variant">宠物分类 *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="h-12 px-3 bg-white rounded-xl border border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all text-sm font-sans"
              >
                <option value="狗狗">狗狗</option>
                <option value="猫咪">猫咪</option>
                <option value="小动物">小动物</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface-variant">品种 *</label>
              <input
                type="text"
                required
                placeholder="例如：金毛混血儿"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="h-12 px-4 bg-white rounded-xl border border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all text-sm font-sans"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface-variant">年龄 *</label>
              <input
                type="text"
                required
                placeholder="例如：3个月 或 2岁"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="h-12 px-4 bg-white rounded-xl border border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all text-sm font-sans"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-on-surface-variant">体况重量 *</label>
              <input
                type="text"
                required
                placeholder="例如：12kg 或 150g"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="h-12 px-4 bg-white rounded-xl border border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all text-sm font-sans"
              />
            </div>
          </div>

          {/* Gender selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface-variant">性别 *</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="gender"
                  value="公"
                  checked={gender === "公"}
                  onChange={() => setGender("公")}
                  className="w-4 h-4 text-primary focus:ring-primary-container border-outline-variant"
                />
                男孩 (公)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                <input
                  type="radio"
                  name="gender"
                  value="母"
                  checked={gender === "母"}
                  onChange={() => setGender("母")}
                  className="w-4 h-4 text-primary focus:ring-primary-container border-outline-variant"
                />
                女孩 (母)
              </label>
            </div>
          </div>

          {/* Select Avatar / Image Presets */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface-variant">选择形象照片 *</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_IMAGES.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImageUrl(img.url)}
                  className={`relative aspect-[4/5] rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selectedImageUrl === img.url ? "border-primary-container scale-98" : "border-outline-variant/30 hover:border-outline-variant"}`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  {selectedImageUrl === img.url && (
                    <div className="absolute inset-0 bg-primary-container/20 flex items-center justify-center">
                      <div className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-surface-container-high p-4 rounded-2xl bg-surface-container-low/50 space-y-3">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">健康状况设置</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-on-surface-variant font-medium">疫苗接种</label>
                <input 
                  type="text" 
                  value={vaccination} 
                  onChange={(e) => setVaccination(e.target.value)}
                  className="h-9 px-2 bg-white rounded-lg border border-outline-variant focus:border-primary text-xs outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-on-surface-variant font-medium">绝育状态</label>
                <input 
                  type="text" 
                  value={neutered} 
                  onChange={(e) => setNeutered(e.target.value)}
                  className="h-9 px-2 bg-white rounded-lg border border-outline-variant focus:border-primary text-xs outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-on-surface-variant font-medium">体内外驱虫</label>
                <input 
                  type="text" 
                  value={dewormed} 
                  onChange={(e) => setDewormed(e.target.value)}
                  className="h-9 px-2 bg-white rounded-lg border border-outline-variant focus:border-primary text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Detail Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface-variant">性格档案描述</label>
            <textarea
              rows={3}
              placeholder="说点好玩的或者描述它平时可爱的举动（性格、喜好、口令等）..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white rounded-xl border border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all text-sm resize-none font-sans"
            />
          </div>

          {/* Adoption Requirements */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface-variant">领养要求 (每行一条规则，留空则自动生成预设规则)</label>
            <textarea
              rows={2}
              placeholder="例如：在本地有固定住所，房东同意养犬。&#13;愿意喂食中高端粮食。"
              value={requirementText}
              onChange={(e) => setRequirementText(e.target.value)}
              className="w-full p-3 bg-white rounded-xl border border-outline-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none transition-all text-sm resize-none font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-primary hover:bg-primary-container text-white font-medium rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-[0.99] mt-2 shadow-md hover:shadow-lg"
          >
            发布领养
          </button>
        </form>
      </div>
    </div>
  );
}
