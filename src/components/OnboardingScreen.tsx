import { motion } from "motion/react";
import { PawPrint, ArrowRight, ShieldCheck, Heart, Handshake, FileText } from "lucide-react";

interface OnboardingScreenProps {
  onStart: () => void;
}

export default function OnboardingScreen({ onStart }: OnboardingScreenProps) {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-start overflow-x-hidden pb-12">
      <main className="relative w-full max-w-md md:max-w-4xl mx-auto min-h-[85vh] flex flex-col lg:flex-row-reverse items-center justify-center px-5 md:px-10 gap-8 py-8">
        
        {/* Hero Image Section */}
        <div className="relative w-full lg:w-1/2 aspect-[4/5] lg:aspect-auto lg:h-[600px] overflow-hidden rounded-[2rem] shadow-2xl">
          <img
            alt="Person hugging a happy dog"
            className="w-full h-full object-cover"
            src="/images/hero.jpg"
          />
          <div className="absolute inset-0 hero-gradient"></div>
          
          {/* Animated Mood Tags */}
          <div className="absolute bottom-6 left-5 right-5 flex flex-wrap gap-2.5">
            <div className="animate-float" style={{ animationDelay: "0s" }}>
              <span className="bg-secondary-container/90 text-on-secondary-container px-4 py-2.5 rounded-full font-label-md text-sm shadow-sm backdrop-blur-md flex items-center gap-2">
                <Heart className="w-4.5 h-4.5 fill-current text-secondary" />
                温馨陪伴
              </span>
            </div>
            
            <div className="animate-float" style={{ animationDelay: "1.5s" }}>
              <span className="bg-[#cac6bd]/90 text-on-tertiary-fixed px-4 py-2.5 rounded-full font-label-md text-sm shadow-sm backdrop-blur-md flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-tertiary" />
                健康检疫
              </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center shadow-lg">
              <PawPrint className="text-white w-7 h-7 fill-current" />
            </div>
            <span className="text-2xl font-bold text-primary tracking-tight font-sans">PawMate</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl md:text-4xl font-bold text-on-background mb-4 leading-tight"
          >
            寻找你的<span className="text-primary hover:text-primary/95 transition-colors">毛茸茸伙伴</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-on-surface-variant mb-8 max-w-[340px] lg:max-w-none leading-relaxed"
          >
            让每个生命都有一个温暖的家。开启一段关于爱与陪伴的旅程，遇见那个最对的它。
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="w-full flex flex-col gap-4 items-center lg:items-start"
          >
            <button
              id="btn-discover-explore"
              onClick={onStart}
              className="w-full max-w-[280px] lg:w-auto bg-primary-container hover:bg-primary text-white font-medium text-base py-4 px-10 rounded-full shadow-lg hover:shadow-primary/30 transition-all transform active:scale-95 duration-200 flex items-center justify-center gap-2 group cursor-pointer"
            >
              开始探索
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>

            <div className="flex items-center gap-4 mt-6">
              <div className="flex -space-x-3">
                <img
                  className="w-9 h-9 rounded-full border-2 border-background object-cover"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
                  alt="User 1"
                />
                <img
                  className="w-9 h-9 rounded-full border-2 border-background object-cover"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop"
                  alt="User 2"
                />
                <img
                  className="w-9 h-9 rounded-full border-2 border-background object-cover"
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop"
                  alt="User 3"
                />
              </div>
              <p className="text-xs md:text-sm font-medium text-on-surface-variant">
                <span className="font-bold text-on-surface text-sm md:text-base">5,000+</span> 位领养者的选择
              </p>
            </div>
          </motion.div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute -top-16 -left-16 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
      </main>

      {/* Trust Badges Section */}
      <section className="w-full bg-surface-container-low py-10 px-5 mt-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center space-y-2 p-3 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm shadow-xs hover:shadow-md hover:scale-103 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary-fixed/45 flex items-center justify-center text-primary mb-1">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-on-surface">严选机构</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">合作救助站均经过实地仔细考察</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2 p-3 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm shadow-xs hover:shadow-md hover:scale-103 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center text-secondary mb-1">
              <Heart className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-bold text-sm text-on-surface">科学领养</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">提供全方位系统的宠物养护指导</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2 p-3 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm shadow-xs hover:shadow-md hover:scale-103 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed/45 flex items-center justify-center text-tertiary mb-1">
              <Handshake className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-bold text-sm text-on-surface">终身支持</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">领养后行为咨询与社群互助互看</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2 p-3 bg-white/40 rounded-2xl border border-white/50 backdrop-blur-sm shadow-xs hover:shadow-md hover:scale-103 transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary-fixed/45 flex items-center justify-center text-primary mb-1">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <h3 className="font-bold text-sm text-on-surface">透明流程</h3>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">领养申请进度实时跟进，公开明朗</p>
          </div>
        </div>
      </section>
    </div>
  );
}
