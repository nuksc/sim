
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { CaseSelection } from './components/StudentView/CaseSelection';
import { ChatInterface } from './components/StudentView/ChatInterface';
import { DiagnosisPhase } from './components/StudentView/DiagnosisPhase';
import { FeedbackSummary } from './components/StudentView/FeedbackSummary';
import { Dashboard as InstructorDashboard } from './components/InstructorView/Dashboard';
import { CaseBuilder } from './components/InstructorView/CaseBuilder';
import { PatientCase, ChatMessage } from './types';
import { INITIAL_CASES } from './constants';
import { evaluateSession } from './services/geminiService';

type AppRole = 'student' | 'instructor' | null;
type StudentStep = 'selection' | 'chat' | 'diagnosis' | 'feedback';
type InstructorStep = 'dashboard' | 'builder';

const App: React.FC = () => {
  const [role, setRole] = useState<AppRole>(null);
  const [studentStep, setStudentStep] = useState<StudentStep>('selection');
  const [instructorStep, setInstructorStep] = useState<InstructorStep>('dashboard');
  
  const [cases, setCases] = useState<PatientCase[]>(() => {
    const saved = localStorage.getItem('nursesim_cases');
    return saved ? JSON.parse(saved) : INITIAL_CASES;
  });
  
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);
  const [sessionHistory, setSessionHistory] = useState<ChatMessage[]>([]);
  const [sessionResult, setSessionResult] = useState<any | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  useEffect(() => {
    localStorage.setItem('nursesim_cases', JSON.stringify(cases));
  }, [cases]);

  const resetAll = () => {
    setRole(null);
    setStudentStep('selection');
    setInstructorStep('dashboard');
    setSelectedCase(null);
    setSessionResult(null);
    setSessionHistory([]);
  };

  const handleSaveCase = (newCase: PatientCase) => {
    setCases(prev => {
      const exists = prev.find(c => c.id === newCase.id);
      if (exists) {
        return prev.map(c => c.id === newCase.id ? newCase : c);
      }
      return [...prev, newCase];
    });
    setInstructorStep('dashboard');
    setSelectedCase(null);
  };

  const handleDeleteCase = (id: string) => {
    if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสถานการณ์นี้?')) {
      setCases(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSubmitDiagnosis = async (diagnosis: string, rationale: string) => {
    if (!selectedCase) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateSession(selectedCase, sessionHistory, { diagnosis, rationale });
      setSessionResult(result);
      setStudentStep('feedback');
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการประเมินผล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!role) {
    return (
      <Layout role={null} onReset={resetAll}>
        <div className="flex flex-col items-center justify-center py-12 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block p-4 bg-indigo-100 rounded-2xl mb-6 shadow-xl shadow-indigo-100">
              <i className="fas fa-stethoscope text-5xl text-indigo-600"></i>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">NurseSim AI</h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">
              แพลตฟอร์มจำลองการซักประวัติและวินิจฉัยทางการพยาบาลด้วย AI <br className="hidden md:block" />
              เปลี่ยนการเรียนรู้แบบท่องจำ ให้เป็นประสบการณ์การดูแลผู้ป่วยจริง
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-20">
            <button 
              onClick={() => setRole('student')}
              className="bg-white group hover:bg-indigo-600 hover:text-white border-2 border-indigo-100 hover:border-indigo-600 p-10 rounded-3xl transition-all duration-300 shadow-xl shadow-indigo-100/50 flex flex-col items-center gap-6"
            >
              <div className="w-24 h-24 bg-indigo-50 group-hover:bg-white/20 rounded-2xl flex items-center justify-center transition-colors">
                <i className="fas fa-user-graduate text-4xl text-indigo-600 group-hover:text-white"></i>
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-3">Student Portal</h2>
                <p className="text-slate-500 group-hover:text-indigo-100">ฝึกซักประวัติ ฟังเสียงผู้ป่วย และส่งข้อวินิจฉัย</p>
              </div>
            </button>

            <button 
              onClick={() => setRole('instructor')}
              className="bg-white group hover:bg-amber-600 hover:text-white border-2 border-amber-100 hover:border-amber-600 p-10 rounded-3xl transition-all duration-300 shadow-xl shadow-amber-100/50 flex flex-col items-center gap-6"
            >
              <div className="w-24 h-24 bg-amber-50 group-hover:bg-white/20 rounded-2xl flex items-center justify-center transition-colors">
                <i className="fas fa-chalkboard-teacher text-4xl text-amber-600 group-hover:text-white"></i>
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-3">Instructor Portal</h2>
                <p className="text-slate-500 group-hover:text-amber-100">สร้างเคสจำลอง และกำหนดเกณฑ์การวินิจฉัย</p>
              </div>
            </button>
          </div>

          {/* Quick Guide Section */}
          <div className="w-full bg-white rounded-[40px] p-8 md:p-12 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <i className="fas fa-info-circle text-indigo-500"></i> ขั้นตอนการใช้งานระบบ
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">1</div>
                <h4 className="font-bold text-lg text-slate-800">อาจารย์เตรียม Case</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  อาจารย์สร้างสถานการณ์ (Case Builder) กำหนดข้อมูลพื้นฐาน คีย์เวิร์ดที่ต้องการให้ถาม และเฉลยการวินิจฉัยที่ถูกต้อง
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">2</div>
                <h4 className="font-bold text-lg text-slate-800">นักศึกษาฝึกปฏิบัติ</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  นักศึกษาพูดคุยกับผู้ป่วย AI (ใช้ไมค์หรือพิมพ์) ฟังเสียงตอบโต้ และพยายามรวบรวมข้อมูลให้ครบตามหลักการพยาบาล
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg">3</div>
                <h4 className="font-bold text-lg text-slate-800">ประเมินและสรุปผล</h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  นักศึกษาส่งข้อวินิจฉัย ระบบ AI จะประเมินคะแนนแยกเป็นส่วนการรวบรวมข้อมูล และส่วนการคิดวิเคราะห์ (Diagnosis) ทันที
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role={role} onReset={resetAll}>
      {role === 'student' && (
        <>
          {studentStep === 'selection' && (
            <CaseSelection 
              cases={cases} 
              onSelect={(c) => {
                setSelectedCase(c);
                setStudentStep('chat');
              }} 
            />
          )}
          {studentStep === 'chat' && selectedCase && (
            <ChatInterface 
              currentCase={selectedCase} 
              onFinish={(history) => {
                setSessionHistory(history);
                setStudentStep('diagnosis');
              }}
            />
          )}
          {studentStep === 'diagnosis' && selectedCase && (
            <DiagnosisPhase 
              currentCase={selectedCase}
              history={sessionHistory}
              onSubmit={handleSubmitDiagnosis}
              isEvaluating={isEvaluating}
            />
          )}
          {studentStep === 'feedback' && selectedCase && sessionResult && (
            <FeedbackSummary 
              caseData={selectedCase} 
              result={sessionResult} 
              onClose={() => setStudentStep('selection')} 
            />
          )}
        </>
      )}

      {role === 'instructor' && (
        <>
          {instructorStep === 'dashboard' && (
            <InstructorDashboard 
              cases={cases} 
              onCreateNew={() => {
                setSelectedCase(null);
                setInstructorStep('builder');
              }}
              onEditCase={(c) => {
                setSelectedCase(c);
                setInstructorStep('builder');
              }}
              onDeleteCase={handleDeleteCase}
            />
          )}
          {instructorStep === 'builder' && (
            <CaseBuilder 
              initialData={selectedCase}
              onSave={handleSaveCase}
              onCancel={() => {
                setInstructorStep('dashboard');
                setSelectedCase(null);
              }}
            />
          )}
        </>
      )}
    </Layout>
  );
};

export default App;
