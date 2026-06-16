import React, { useState } from "react";
import { ArrowLeft, Heart, MessageSquare, ShieldCheck, Milestone, CheckCircle2, ChevronRight, Home, HeartHandshake, Watch, BookOpen } from "lucide-react";
import { Pet } from "../types";
import { PawPrint } from "./Icons";

interface DetailsScreenProps {
  pet: Pet;
  onBack: () => void;
  onToggleFavorite: (petId: string) => void;
  onApply: (pet: Pet) => void;
}

export default function DetailsScreen({ pet, onBack, onToggleFavorite, onApply }: DetailsScreenProps) {
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultationText, setConsultationText] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "advisor"; text: string }>>([
    { sender: "advisor", text: `您好！我是PawMate金牌领养顾问，请问您对可爱的 ${pet.name} 有什么问题想咨询，或者想提前确认什么领养要求呢？` }
  ]);

  const sendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationText.trim()) return;

    const userMsg = consultationText;
    setChatLog((prev) => [...prev, { sender: "user", text: userMsg }]);
    setConsultationText("");

    setTimeout(() => {
      let response = `关于可爱的 ${pet.name}，它是我们这里公认的极度懂事乖巧、招人怜爱的好宝贝，健康档案很齐备！建议您尽早点击[立即申请领养]填写资料，排队进入审核，能增加和它配对成功的机会哦！`;
      if (userMsg.includes("疫苗") || userMsg.includes("健康")) {
        response = `可爱的 ${pet.name} 目前接种情况是「${pet.health.vaccination}」，且它的体内外驱虫都是「${pet.health.dewormed}」哦，非常干净健壮、活泼好养。`;
      } else if (userMsg.includes("阳台") || userMsg.includes("环境")) {
        response = `是的！ ${pet.name} 对家庭环境的主要期望是：${pet.requirements[0] || "有温暖的抚摸、不离不弃。"} 阳台安装防盗网可以让猫狗宝贝更健康安全。`;
      }
      setChatLog((prev) => [...prev, { sender: "advisor", text: response }]);
    }, 1000);
  };

  const currentGenderIcon = pet.gender === "公" ? "♂" : "♀";
  const currentGenderColor = pet.gender === "公" ? "text-blue-500 bg-blue-50" : "text-rose-500 bg-rose-50";

  return (
    <div className="w-full bg-background pb-32">
      {/* Top Header Floating controls */}
      <header className="fixed top-0 left-0 w-full z-50 px-5 h-16 flex items-center justify-between pointer-events-none">
        <button
          onClick={onBack}
          className="pointer-events-auto h-10 w-10 flex items-center justify-center rounded-full bg-white/95 text-on-surface shadow-xs hover:bg-white active:scale-90 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => onToggleFavorite(pet.id)}
          className={`pointer-events-auto h-10 w-10 flex items-center justify-center rounded-full bg-white/95 shadow-xs active:scale-90 transition-all cursor-pointer ${
            pet.isFavorite ? "text-red-500" : "text-on-surface-variant hover:text-red-500"
          }`}
        >
          <Heart className={`w-5 h-5 ${pet.isFavorite ? "fill-current" : ""}`} />
        </button>
      </header>

      {/* Hero Section Banner */}
      <section className="relative w-full h-[460px] md:h-[500px] overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={pet.image}
          alt={pet.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-5">
          <span className="inline-block px-3.5 py-1 rounded-full bg-secondary text-white font-medium text-xs mb-2">
            寻找领养中
          </span>
          <h1 className="text-3xl font-bold text-white drop-shadow-md">
            {pet.name}
          </h1>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="px-5 -mt-6 relative z-10 max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-xl shadow-xs custom-shadow border border-surface-container flex flex-col items-center">
            <span className="text-primary font-bold text-lg md:text-xl">
              {pet.age}
            </span>
            <span className="text-on-surface-variant text-xs mt-1">年龄</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-xs custom-shadow border border-surface-container flex flex-col items-center">
            <span className="text-primary font-bold text-lg md:text-xl">
              {pet.gender}
            </span>
            <span className="text-on-surface-variant text-xs mt-1">性别</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-xs custom-shadow border border-surface-container flex flex-col items-center">
            <span className="text-primary font-bold text-lg md:text-xl">
              {pet.weight}
            </span>
            <span className="text-on-surface-variant text-xs mt-1">体重</span>
          </div>
        </div>
      </section>

      {/* Core Profile body elements */}
      <main className="px-5 mt-8 space-y-8 max-w-2xl mx-auto">
        
        {/* Character Bio Section */}
        <div>
          <h2 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
            <Watch className="w-5 h-5 text-primary" />
            性格档案
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-sans">
            {pet.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {pet.tags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-medium text-xs shadow-3xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Health status section */}
        <div className="bg-surface-container-low rounded-xl p-5 border border-surface-container-high/40 shadow-3xs">
          <div className="flex items-center gap-2 mb-4 text-secondary">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-base font-bold text-on-surface">健康说明</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant text-sm font-medium">疫苗接种</span>
              <span className="text-secondary font-semibold text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {pet.health.vaccination}
              </span>
            </div>
            
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
              <span className="text-on-surface-variant text-sm font-medium">绝育状态</span>
              <span className="text-secondary font-semibold text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {pet.health.neutered}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant text-sm font-medium">体内外驱虫</span>
              <span className="text-secondary font-semibold text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {pet.health.dewormed}
              </span>
            </div>
          </div>
        </div>

        {/* Adoption requirements */}
        <div>
          <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-primary" />
            领养要求
          </h2>
          <ul className="space-y-4">
            {pet.requirements.map((req, index) => {
              // Custom requirement icons for enhanced visuals
              let iconElement = <Home className="w-5 h-5 text-primary/80 flex-shrink-0 mt-0.5" />;
              if (index === 1) iconElement = <Heart className="w-5 h-5 text-primary/80 flex-shrink-0 mt-0.5" />;
              if (index === 2) iconElement = <Watch className="w-5 h-5 text-primary/80 flex-shrink-0 mt-0.5" />;
              if (index >= 3) iconElement = <BookOpen className="w-5 h-5 text-primary/80 flex-shrink-0 mt-0.5" />;

              return (
                <li key={index} className="flex gap-3.5 bg-white/40 p-3 rounded-xl border border-surface-container shadow-4xs">
                  {iconElement}
                  <p className="text-sm text-on-surface-variant font-sans md:text-base leading-relaxed">
                    {req}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </main>

      {/* Bottom Sticky Action Panel Drawer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md px-5 py-4 safe-bottom z-50 border-t border-surface-container-high/60 shadow-lg">
        <div className="max-w-xl mx-auto flex gap-4">
          <button
            onClick={() => setIsConsulting(true)}
            title="在线顾问"
            className="w-14 h-14 rounded-xl border-2 border-outline-variant hover:border-primary-container hover:bg-primary-fixed/20 flex items-center justify-center text-on-surface-variant active:scale-95 transition-all cursor-pointer flex-shrink-0"
          >
            <MessageSquare className="w-6 h-6 text-primary" />
          </button>
          <button
            onClick={() => onApply(pet)}
            className="flex-1 h-14 bg-primary-container hover:bg-primary text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg active:scale-99 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            立即申请领养
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Consultant Support Drawer Overlay */}
      {isConsulting && (
        <div className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-on-surface/50 backdrop-blur-xs cursor-pointer" 
            onClick={() => setIsConsulting(false)} 
          />
          <div className="relative bg-white w-full max-w-md h-[480px] rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-surface-container z-10">
            {/* Header */}
            <div className="bg-primary px-5 py-4 text-white flex justify-between items-center bg-gradient-to-r from-primary to-primary-container">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/25 flex items-center justify-center">
                  <PawPrint className="w-4 h-4 text-white fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">领养专家咨询顾问</h4>
                  <p className="text-[10px] text-white/80">在线1对1为您耐心解答</p>
                </div>
              </div>
              <button 
                onClick={() => setIsConsulting(false)}
                className="text-white/80 hover:text-white font-bold cursor-pointer text-sm"
              >
                关闭
              </button>
            </div>

            {/* Chat Messages Logs */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface-container-lowest">
              {chatLog.map((log, idx) => (
                <div key={idx} className={`flex ${log.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] text-xs md:text-sm p-3.5 rounded-2xl leading-relaxed ${
                    log.sender === "user" 
                      ? "bg-primary-container text-on-primary-container rounded-tr-xs" 
                      : "bg-surface-container text-on-surface shadow-4xs rounded-tl-xs"
                  }`}>
                    {log.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Form Input */}
            <form onSubmit={sendQuery} className="p-3 border-t border-surface-container bg-surface-container-low flex gap-2">
              <input
                type="text"
                placeholder="发送你的疑问，如[疫苗接种完吗]..."
                value={consultationText}
                onChange={(e) => setConsultationText(e.target.value)}
                className="flex-1 h-10 px-3 bg-white rounded-lg border border-outline-variant outline-none focus:border-primary text-xs"
              />
              <button
                type="submit"
                className="h-10 px-4 bg-primary text-white rounded-lg font-medium text-xs hover:bg-primary-container cursor-pointer transition-colors active:scale-95"
              >
                发送
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

