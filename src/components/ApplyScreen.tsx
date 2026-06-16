import React, { useState } from "react";
import { ArrowLeft, Phone, Info, GraduationCap, Send, Inbox, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Pet, AdoptionApplication } from "../types";
import { PawPrint, HeartSvg } from "./Icons";

interface ApplyScreenProps {
  selectedPet: Pet | null;
  onBack: () => void;
  onSubmit: (application: AdoptionApplication) => void;
}

export default function ApplyScreen({ selectedPet, onBack, onSubmit }: ApplyScreenProps) {
  // Active progress sub-steps state
  const [activeStep, setActiveStep] = useState(1);
  
  // Form fields
  const [phone, setPhone] = useState("");
  const [environment, setEnvironment] = useState("");
  const [ownership, setOwnership] = useState<"自有住宅" | "租赁住宅" | "集体宿舍">("自有住宅");
  const [experience, setExperience] = useState("");
  const [intent, setIntent] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto transition stepper nodes as users fill details
  const handleNextStep = () => {
    if (activeStep === 1) {
      if (!phone.trim() || !environment.trim()) {
        alert("请先填写完整的联系电话与居住环境描述。");
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (!experience.trim() || !intent.trim()) {
        alert("请先填写养宠经验与领养初衷。");
        return;
      }
      setActiveStep(3);
    }
  };

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !environment || !experience || !intent) {
      alert("请完整填写表单所有必填字段。");
      return;
    }
    if (!agreed) {
      alert("请先阅读并同意《PawMate 领养服务协议》与《动物福利承诺书》。");
      return;
    }

    const newApplication: AdoptionApplication = {
      id: "app_" + Date.now(),
      petId: selectedPet?.id || "pet_unknown",
      petName: selectedPet?.name || "未知宠物",
      petImage: selectedPet?.image || "https://images.unsplash.com/photo-1450778869180-e20ab8b55c22?w=100&h=100&fit=crop",
      phone,
      environment,
      ownership,
      experience,
      intent,
      status: "待审核",
      progressStep: 1,
      dateSubmitted: new Date().toISOString().split("T")[0]
    };

    setShowSuccess(true);
    onSubmit(newApplication);
  };

  return (
    <div className="w-full bg-surface min-h-screen pb-32">
      {/* Top Banner Bar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-5 h-16 bg-surface/80 backdrop-blur-md border-b border-surface-container-high/40">
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={handlePrevStep}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high active:scale-90 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base md:text-lg font-bold text-primary">领养申请</h1>
        </div>
        <div className="flex items-center gap-2">
          <PawPrint className="text-primary w-5 h-5 fill-current" />
          <span className="text-sm font-bold text-primary tracking-tight">PawMate</span>
        </div>
      </header>

      <main className="pt-24 px-5 max-w-2xl mx-auto">
        
        {/* Intro greeting */}
        <section className="mb-8 text-center">
          <div className="inline-block p-4 rounded-full bg-secondary-container/30 mb-4 text-secondary scale-102">
            <HeartSvg className="w-9 h-9 fill-current" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2 text-on-surface">开启一段温暖的新旅程</h2>
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed font-sans max-w-md mx-auto">
            {selectedPet 
              ? `感谢您选择领养可爱活泼的「${selectedPet.name}」，请如实填写以下信息，我们将以极尽耐心的服务协助您完成所有流程。`
              : "感谢您选择领养代替购买，请如实填写以下信息，我们将协助您完成所有领养安全对接服务。"}
          </p>
        </section>

        {/* Progress Stepper indicators */}
        <div className="flex items-center justify-between mb-10 relative px-4 select-none">
          {/* Connector bars */}
          <div className="absolute top-[18px] left-8 right-8 h-[2px] bg-surface-container-high -z-10 bg-gradient-to-r from-primary/30 to-surface-container-high" />
          
          <div 
            onClick={() => setActiveStep(1)}
            className="flex flex-col items-center gap-2 bg-surface px-2 cursor-pointer transition-all"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${activeStep >= 1 ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
              1
            </div>
            <span className={`text-[11px] font-bold ${activeStep >= 1 ? "text-primary" : "text-on-surface-variant"}`}>基础信息</span>
          </div>

          <div 
            onClick={() => {
              if (phone.trim() && environment.trim()) setActiveStep(2);
            }}
            className="flex flex-col items-center gap-2 bg-surface px-2 cursor-pointer transition-all"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${activeStep >= 2 ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
              2
            </div>
            <span className={`text-[11px] font-bold ${activeStep >= 2 ? "text-primary" : "text-on-surface-variant"}`}>详细说明</span>
          </div>

          <div 
            onClick={() => {
              if (phone.trim() && environment.trim() && experience.trim() && intent.trim()) setActiveStep(3);
            }}
            className="flex flex-col items-center gap-2 bg-surface px-2 cursor-pointer transition-all"
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${activeStep >= 3 ? "bg-primary text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
              3
            </div>
            <span className={`text-[11px] font-bold ${activeStep >= 3 ? "text-primary" : "text-on-surface-variant"}`}>审核提交</span>
          </div>
        </div>

        {/* Multi-step Forms details */}
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {activeStep === 1 && (
            <div className="bg-white p-5 rounded-2xl custom-shadow border border-surface-container space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2 pb-3 border-b border-surface-container-high">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-on-surface">个人及居住背景</h3>
              </div>

              {/* Phone text fields */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant">联系电话 *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="请输入您的手机号码"
                    className="w-full h-12 px-4 bg-surface rounded-xl border border-outline-variant outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-sans"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Phone className="w-4.5 h-4.5 text-outline-variant absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Living environment description text */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant">居住环境(有无阳台等) *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-4 bg-surface rounded-xl border border-outline-variant outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-sans resize-none"
                  placeholder="例如：三室一厅，有封闭式阳台，环境通风良好，光照极佳，安全可靠..."
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                />
              </div>

              {/* Ownership selections tags */}
              <div className="flex flex-col gap-2.5">
                <label className="text-xs font-bold text-on-surface-variant">房屋权属</label>
                <div className="flex flex-wrap gap-2">
                  {(["自有住宅", "租赁住宅", "集体宿舍"] as const).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setOwnership(tag)}
                      className={`px-5 py-2.5 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                        ownership === tag
                          ? "bg-primary-fixed border-primary-container text-on-primary-container shadow-2xs scale-98"
                          : "bg-surface border-outline-variant text-on-surface-variant hover:border-primary-container"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Helper Step Transition button */}
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full h-12 bg-primary/10 hover:bg-primary/15 text-primary font-bold text-xs rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-98 mt-2"
              >
                下一步：填写宠历与初衷
              </button>
            </div>
          )}

          {activeStep === 2 && (
            <div className="bg-white p-5 rounded-2xl custom-shadow border border-surface-container space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-2 pb-3 border-b border-surface-container-high">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-on-surface">养宠履历与初衷</h3>
              </div>

              {/* Experience detailed text */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant">养宠经验调查 *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-4 bg-surface rounded-xl border border-outline-variant outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-sans resize-none"
                  placeholder="描述您过去的养宠经历，或目前家中的宠物饲养情况(如无经验请如实说明)..."
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              {/* Intention statement text */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant">领养意向说明及期待 *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-4 bg-surface rounded-xl border border-outline-variant outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 text-sm font-sans resize-none"
                  placeholder="请告诉我们您为什么在此申请领养这只可爱的宝贝，您打算给予它怎样的承诺、陪伴和照料责任..."
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="flex-1 h-11 bg-surface border border-outline-variant text-on-surface-variant font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer active:scale-98"
                >
                  返回上一步
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 h-11 bg-primary text-white font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer hover:bg-primary-container active:scale-98"
                >
                  继续：确认提交页
                </button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6">
              {/* Stepper overview details ready for confirming submit */}
              <div className="bg-white p-5 rounded-2xl custom-shadow border border-surface-container space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-surface-container-high/60">
                  <Inbox className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-on-surface">核对您的领养申请资料</h3>
                </div>

                <div className="text-xs space-y-2.5 text-on-surface-variant">
                  {selectedPet && (
                    <div className="flex items-center gap-3 bg-surface p-3 rounded-xl border border-surface-container">
                      <img src={selectedPet.image} alt={selectedPet.name} className="w-12 h-14 object-cover rounded-lg" />
                      <div>
                        <h4 className="font-bold text-on-surface text-sm">申请领养：{selectedPet.name}</h4>
                        <p className="text-[10px] text-on-surface-variant">{selectedPet.breed} · {selectedPet.age}</p>
                      </div>
                    </div>
                  )}
                  <p><span className="font-bold text-on-surface">联系电话：</span>{phone}</p>
                  <p><span className="font-bold text-on-surface">居住环境：</span>{environment}</p>
                  <p><span className="font-bold text-on-surface">住宅权属：</span>{ownership}</p>
                  <p><span className="font-bold text-on-surface">养宠经历：</span>{experience}</p>
                  <p><span className="font-bold text-on-surface">申请初衷：</span>{intent}</p>
                </div>
              </div>

              {/* Supporting Banner Illustration card from preset */}
              <div className="w-full h-44 rounded-2xl overflow-hidden relative group shadow-xs">
                <img
                  alt="Golden puppy and kitten together"
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-103"
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=300&fit=crop"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end p-4">
                  <p className="text-white text-xs md:text-sm italic font-medium leading-relaxed drop-shadow-sm">
                    “我承诺：用一生的守候，换它一世的无邪与爱戴。”
                  </p>
                </div>
              </div>

              {/* Agreement triggers checkbox */}
              <div className="flex flex-col gap-4">
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    required
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded-full border-outline text-primary focus:ring-primary-container cursor-pointer"
                  />
                  <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors leading-relaxed">
                    我已阅读并完全同意《PawMate 领养服务协议》和《动物福利承诺书》，并郑重保证所填报的所有领养登记意向信息均真实有效、自负文责。
                  </span>
                </label>

                {/* Confirm application send CTA */}
                <button
                  type="submit"
                  disabled={!agreed}
                  className={`w-full h-14 rounded-xl font-bold text-base shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    agreed 
                      ? "bg-primary text-white hover:bg-primary-container active:scale-98" 
                      : "bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-60"
                  }`}
                >
                  <Send className="w-5 h-5" />
                  提交申请领养
                </button>
                <p className="text-center text-xs text-outline leading-snug">
                  提交成功后，工作人员将于 48 小时内为您致电或进行微信首轮初筛及评估
                </p>
              </div>
            </div>
          )}

        </form>

        {/* Success Modal overlays on submit */}
        {showSuccess && (
          <div className="fixed inset-0 z-100 flex items-center justify-center px-5">
            <div className="absolute inset-0 bg-on-surface/50 backdrop-blur-sm" />
            <div className="relative bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl scale-100 transition-transform duration-300 z-10 border border-surface-container">
              <div className="w-16 h-16 bg-secondary-container/30 rounded-full flex items-center justify-center mx-auto mb-5 text-secondary">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h2 className="text-xl font-bold mb-2 text-on-surface">领养登记提交成功！</h2>
              <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed mb-6">
                您的爱心申请已成功进入后台审核，小爱心正在闪闪发光！工作人员将竭诚在 48 小时内协助您联系与匹配。
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  onBack();
                }}
                className="w-full h-12 bg-secondary text-white font-bold rounded-xl text-xs hover:bg-secondary/95 transition-all active:scale-95 cursor-pointer"
              >
                返回列表 / 我的领养
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

