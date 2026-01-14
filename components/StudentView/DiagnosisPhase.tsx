
import React, { useState } from 'react';
import { PatientCase, ChatMessage } from '../../types';

interface DiagnosisPhaseProps {
  currentCase: PatientCase;
  history: ChatMessage[];
  onSubmit: (diagnosis: string, rationale: string) => void;
  isEvaluating: boolean;
}

export const DiagnosisPhase: React.FC<DiagnosisPhaseProps> = ({ currentCase, history, onSubmit, isEvaluating }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [rationale, setRationale] = useState('');

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn space-y-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 p-6 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <i className="fas fa-user-md text-2xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold">ขั้นตอนการวินิจฉัยเบื้องต้น</h2>
            <p className="text-indigo-100 text-xs">วิเคราะห์ข้อมูลจากการซักประวัติเพื่อสรุปปัญหาของผู้ป่วย</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-clipboard-list text-indigo-500"></i> สรุปข้อมูลผู้ป่วย
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm space-y-2">
                <p><span className="font-bold">ผู้ป่วย:</span> {currentCase.profile.name} ({currentCase.profile.age} ปี)</p>
                <p><span className="font-bold">อาการสำคัญ:</span> {currentCase.profile.chiefComplaint}</p>
                <p><span className="font-bold">บทสนทนา:</span> {history.filter(m => m.role === 'user').length} คำถาม</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-pen-nib text-emerald-500"></i> การวิเคราะห์ของคุณ
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase mb-1">การวินิจฉัยโรค / ปัญหาทางการพยาบาล</label>
                  <input 
                    type="text" 
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="เช่น กล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน"
                    className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase mb-1">เหตุผลสนับสนุน (Rationale)</label>
                  <textarea 
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="ระบุอาการหรือข้อมูลที่นำมาสู่การวินิจฉัยนี้..."
                    className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl focus:border-indigo-500 outline-none h-24 resize-none transition-all"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => onSubmit(diagnosis, rationale)}
              disabled={!diagnosis.trim() || isEvaluating}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-3"
            >
              {isEvaluating ? (
                <><i className="fas fa-spinner fa-spin"></i> กำลังส่งประเมินผล...</>
              ) : (
                <><i className="fas fa-paper-plane"></i> ส่งผลการวินิจฉัยและดูคะแนน</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
