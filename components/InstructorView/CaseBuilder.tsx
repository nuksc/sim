
import React, { useState } from 'react';
import { PatientCase, CaseCriteria, PatientProfile } from '../../types';

interface CaseBuilderProps {
  onSave: (newCase: PatientCase) => void;
  onCancel: () => void;
  initialData?: PatientCase | null;
}

export const CaseBuilder: React.FC<CaseBuilderProps> = ({ onSave, onCancel, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [difficulty, setDifficulty] = useState<PatientCase['difficulty']>(initialData?.difficulty || 'Beginner');
  const [profile, setProfile] = useState<PatientProfile>(initialData?.profile || {
    name: '',
    age: 0,
    gender: 'Male',
    chiefComplaint: '',
    detailedBackground: '',
    personality: ''
  });
  const [criteria, setCriteria] = useState<CaseCriteria[]>(initialData?.criteria || []);
  const [expectedDiagnosis, setExpectedDiagnosis] = useState(initialData?.expectedDiagnosis || '');
  const [diagnosisRationale, setDiagnosisRationale] = useState(initialData?.diagnosisRationale || '');

  const addCriteria = () => {
    const newCrit: CaseCriteria = {
      id: `crit-${Date.now()}`,
      category: 'Present Illness',
      label: '',
      keywords: [],
      expectedResponse: ''
    };
    setCriteria([...criteria, newCrit]);
  };

  const updateCriteria = (id: string, updates: Partial<CaseCriteria>) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleSave = () => {
    if (!title || !profile.name || criteria.length === 0 || !expectedDiagnosis) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน รวมถึงการวินิจฉัยที่ถูกต้อง');
      return;
    }
    const newCase: PatientCase = {
      id: initialData?.id || `case-${Date.now()}`,
      title,
      difficulty,
      profile,
      criteria,
      expectedDiagnosis,
      diagnosisRationale
    };
    onSave(newCase);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-20">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-900">
          {initialData ? 'แก้ไขสถานการณ์' : 'สร้างสถานการณ์ใหม่'}
        </h2>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all">ยกเลิก</button>
          <button onClick={handleSave} className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">บันทึกสถานการณ์</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Basic Info & Diagnosis */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <i className="fas fa-id-card text-indigo-500"></i> ข้อมูลผู้ป่วยพื้นฐาน
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase mb-1">ชื่อสถานการณ์</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase mb-1">ชื่อผู้ป่วย</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase mb-1">อายุ</label>
                  <input type="number" value={profile.age} onChange={e => setProfile({...profile, age: parseInt(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase mb-1">อาการสำคัญ (Chief Complaint)</label>
                <textarea value={profile.chiefComplaint} onChange={e => setProfile({...profile, chiefComplaint: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl h-20 outline-none"></textarea>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3 text-emerald-600">
              <i className="fas fa-stethoscope"></i> เฉลยการวินิจฉัย (Dx Criteria)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase mb-1">การวินิจฉัยที่ถูกต้อง</label>
                <input 
                  type="text" 
                  value={expectedDiagnosis} 
                  onChange={e => setExpectedDiagnosis(e.target.value)} 
                  placeholder="เช่น MI, Pneumonia"
                  className="w-full px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl outline-none" 
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase mb-1">เหตุผลสนับสนุนทางการแพทย์</label>
                <textarea 
                  value={diagnosisRationale} 
                  onChange={e => setDiagnosisRationale(e.target.value)} 
                  placeholder="ระบุพยาธิสภาพหรือเกณฑ์ที่ใช้ตัดสิน..."
                  className="w-full px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl h-24 outline-none resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Criteria List */}
        <div className="lg:col-span-7">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm min-h-full">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-list-check text-indigo-500"></i> เกณฑ์การซักประวัติที่ต้องมี
              </h3>
              <button onClick={addCriteria} className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">+ เพิ่มข้อกำหนด</button>
            </div>
            
            <div className="space-y-4">
              {criteria.map((crit) => (
                <div key={crit.id} className="bg-slate-50 p-5 rounded-2xl relative border border-slate-100 group">
                  <div className="grid grid-cols-1 gap-3">
                    <input 
                      type="text" 
                      placeholder="หัวข้อ (เช่น ลักษณะความเจ็บปวด)" 
                      value={crit.label}
                      onChange={e => updateCriteria(crit.id, { label: e.target.value })}
                      className="text-sm font-bold bg-transparent border-b border-slate-200 outline-none pb-1 focus:border-indigo-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase">Keywords</label>
                        <input 
                          type="text" 
                          value={crit.keywords.join(', ')}
                          onChange={e => updateCriteria(crit.id, { keywords: e.target.value.split(',').map(k => k.trim()) })}
                          className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-black text-slate-400 uppercase">หมวดหมู่</label>
                        <select 
                          value={crit.category}
                          onChange={e => updateCriteria(crit.id, { category: e.target.value as any })}
                          className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded"
                        >
                          <option value="Present Illness">Present Illness</option>
                          <option value="Past History">Past History</option>
                          <option value="Family History">Family History</option>
                          <option value="Social History">Social History</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
