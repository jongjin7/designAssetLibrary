"use client"

import * as React from "react"
import { Check, ChevronRight, Zap, CloudOff, Target, Sparkles, Box } from "lucide-react"
import { cn } from "../../lib/utils"
import { NVButton } from "../../atoms/NVButton"
import { NVTypography } from "../../atoms/NVTypography"
import { NVLogo } from "../../atoms/NVLogo"
import { NVDialog, NVDialogContent, NVDialogBody } from "../../atoms/NVDialog"

interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    title: "반가워요! Trove에 오신 것을 환영합니다",
    description: "Trove는 디자인 영감을 가장 빠르고 아름답게 수집하고 관리하는 공간입니다.",
    icon: <Sparkles className="w-8 h-8 text-indigo-400" />,
    color: "from-indigo-500/20 to-violet-500/20"
  },
  {
    id: "local-first",
    title: "오프라인에서도 중단 없는 수집",
    description: "로컬 라이브러리(OPFS) 기술로 대용량 에셋을 장치에 안전하게 저장합니다. 인터넷 연결 없이도 즉시 촬영하고 탐색하세요.",
    icon: <CloudOff className="w-8 h-8 text-sky-400" />,
    color: "from-sky-500/20 to-blue-500/20"
  },
  {
    id: "ai-organization",
    title: "AI가 알아서 하는 스마트 자동 분류",
    description: "수집하는 즉시 주요 추출 컬러, 구도, 객체를 AI가 분석하여 태그를 제안합니다.",
    icon: <Zap className="w-8 h-8 text-amber-400" />,
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    id: "ready",
    title: "준비가 모두 끝났습니다",
    description: "이제 영감을 현실로 바꾸는 프로젝트를 시작해 보세요.",
    icon: <Target className="w-8 h-8 text-emerald-400" />,
    color: "from-emerald-500/20 to-teal-500/20"
  }
]

interface NVOnboardingProps {
  isOpen: boolean
  onComplete: () => void
}

export function NVOnboarding({ isOpen, onComplete }: NVOnboardingProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const isLastStep = currentStep === STEPS.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const step = STEPS[currentStep]

  return (
    <NVDialog open={isOpen} onOpenChange={(open) => !open && onComplete()}>
      <NVDialogContent className="max-w-[440px] p-0 border-none bg-slate-950/90 overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)]">
        <NVDialogBody className="p-0">
          <div className="relative h-[600px] flex flex-col">
            {/* 상단 장식 구 */}
            <div className={cn(
              "absolute -top-24 -left-24 w-64 h-64 blur-[100px] rounded-full transition-all duration-1000 bg-gradient-to-br",
              step.color
            )} />
            
            <div className="relative flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div key={`logo-${currentStep}`} className="mb-12 animate-in fade-in zoom-in duration-700">
                <NVLogo size="md" />
              </div>
              
              <div key={step.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-forwards">
                <div className="mx-auto w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-2xl transition-transform duration-500 hover:scale-110">
                  {step.icon}
                </div>
                
                <NVTypography variant="header" className="text-2xl font-bold text-white mb-4 tracking-tight">
                  {step.title}
                </NVTypography>
                
                <NVTypography className="text-slate-400 text-base leading-relaxed max-w-[320px] mx-auto">
                  {step.description}
                </NVTypography>
              </div>

              {/* 스텝 인디케이터 */}
              <div className="flex gap-1.5 mt-12">
                {STEPS.map((_, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500",
                      idx === currentStep ? "w-8 bg-indigo-500" : "w-1.5 bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="p-8 pt-0 flex flex-col gap-3 relative z-10">
              <NVButton 
                size="lg" 
                className="w-full bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all active:scale-95 font-bold"
                onClick={handleNext}
              >
                {isLastStep ? "기능 시작하기" : "다음 단계"}
                {!isLastStep && <ChevronRight className="ml-2 w-4 h-4" />}
              </NVButton>
              
              {!isLastStep && (
                <button 
                  onClick={onComplete}
                  className="py-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                >
                  건너뛰기
                </button>
              )}
            </div>
          </div>
        </NVDialogBody>
      </NVDialogContent>
    </NVDialog>
  )
}
