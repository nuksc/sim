
import React from 'react';
import { PatientCase } from '../../types';

interface FeedbackSummaryProps {
  caseData: PatientCase;
  result: { 
    score: number; 
    criteriaMet: string[]; 
    feedback: string; 
    diagnosisScore: number; 
    diagnosisFeedback: string;
  };
  onClose: () => void;
}

export const FeedbackSummary: React.FC<FeedbackSummaryProps> = ({ caseData, result, onClose }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slideUp pb-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-10 text-center text-white relative">
          <div className="absolute top-6 left-6 opacity-20">
            <i className="fas fa-award text-6xl"></i>
          </div>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 mb-4 shadow-inner">
            <span className="text-4xl font-black">{result.score}%</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">สรุปผลการปฏิบัติการ</h2>
          <p className="opacity-80 font-medium">ทำได้ดีมาก! มาดูรายละเอียดการวิเคราะห์ของคุณกันค่ะ</p>
        </div>

        <div className="p-8 space-y-10">
          {/* Section 1: Diagnosis Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 bg-emerald-50 rounded-3xl p-6 border border-emerald-100 flex flex-col items-center justify-center text-center">
              <div className="text-emerald-600 font-black text-4xl mb-2">{result.diagnosisScore}%</div>
              <div className="text-emerald-800 font-bold text-sm uppercase tracking-wider">คะแนนการวินิจฉัย</div>
              <div className="mt-4 text-emerald-700/70 text-xs italic">
                เปรียบเทียบกับเกณฑ์: <br/> 
                <span className="font-bold text-emerald-800">{caseData.expectedDiagnosis}</span>
              </div>
            </div>
            <div className="md:col-span-8 bg-slate-50 rounded-3xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <i className="fas fa-stethoscope text-indigo-500"></i> วิเคราะห์ข้อวินิจฉัยของคุณ
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm">
                {result.diagnosisFeedback}
              </p>
            </div>
          </div>

          {/* Section 2: General Feedback */}
          <div className="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5 text-indigo-600 transform -rotate-12">
              <i className="fas fa-comment-medical text-8xl"></i>
            </div>
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2 relative z-10">
              <i className="fas fa-brain text-amber-500"></i> ข้อเสนอแนะเชิงคลินิก
            </h3>
            <p className="text-indigo-800 leading-relaxed italic relative z-10 font-medium">
              "{result.feedback}"
            </p>
          </div>

          {/* Section 3: Criteria Checklist */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 px-2">
              <i className="fas fa-tasks text-emerald-500"></i> รายการข้อมูลที่รวบรวมได้ (Assessment Checklist)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseData.criteria.map((crit) => {
                const isMet = result.criteriaMet.includes(crit.id);
                return (
                  <div key={crit.id} className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
                    isMet ? 'bg-white border-emerald-200 shadow-sm shadow-emerald-50' : 'bg-slate-50/50 border-slate-100 grayscale opacity-70'
                  }`}>
                    <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                      isMet ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-white'
                    }`}>
                      <i className={`fas ${isMet ? 'fa-check' : 'fa-times'}`}></i>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isMet ? 'text-slate-800' : 'text-slate-400'}`}>
                        {crit.label}
                      </h4>
                      <p className="text-[10px] text-slate-400 uppercase font-black mt-1 tracking-wider">{crit.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onClose}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-100"
            >
              กลับหน้าเลือกสถานการณ์
            </button>
            <button 
              onClick={() => window.print()}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <i className="fas fa-file-pdf"></i> บันทึกผลรายงาน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
