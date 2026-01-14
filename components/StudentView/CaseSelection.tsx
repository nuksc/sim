
import React from 'react';
import { PatientCase } from '../../types';

interface CaseSelectionProps {
  cases: PatientCase[];
  onSelect: (c: PatientCase) => void;
}

export const CaseSelection: React.FC<CaseSelectionProps> = ({ cases, onSelect }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">เลือกสถานการณ์ผู้ป่วย</h2>
        <p className="text-slate-600 font-medium">เลือกผู้ป่วยจำลองเพื่อเริ่มฝึกทักษะการซักประวัติทางการพยาบาล แต่ละสถานการณ์มีความยากและประเด็นสำคัญที่แตกต่างกัน</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((c) => (
          <div 
            key={c.id} 
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col"
            onClick={() => onSelect(c)}
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                  c.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-700' :
                  c.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  ระดับ: {c.difficulty === 'Beginner' ? 'เริ่มต้น' : c.difficulty === 'Intermediate' ? 'ปานกลาง' : 'ขั้นสูง'}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                  <i className="fas fa-play text-xs"></i>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{c.title}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2 italic font-medium">
                "อาการ: {c.profile.chiefComplaint}"
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  เพศ{c.profile.gender === 'Male' ? 'ชาย' : 'หญิง'}
                </span>
                <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  อายุ {c.profile.age} ปี
                </span>
              </div>
            </div>
            <div className="bg-slate-50/50 px-6 py-4 rounded-b-3xl border-t border-slate-100 flex justify-between items-center group-hover:bg-indigo-50/50 transition-colors">
              <span className="text-xs text-slate-400 font-bold">
                <i className="fas fa-bullseye mr-1 text-indigo-400"></i> {c.criteria.length} หัวข้อสำคัญ
              </span>
              <button className="text-indigo-600 text-sm font-black flex items-center gap-1.5">
                เริ่มทำภารกิจ <i className="fas fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          </div>
        ))}

        {cases.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <i className="fas fa-folder-open text-4xl text-slate-200 mb-4"></i>
            <p className="text-slate-400 font-bold">ยังไม่มีสถานการณ์ที่ถูกสร้างไว้</p>
          </div>
        )}
      </div>
    </div>
  );
};
