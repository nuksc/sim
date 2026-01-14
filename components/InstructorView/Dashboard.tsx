
import React from 'react';
import { PatientCase } from '../../types';

interface DashboardProps {
  cases: PatientCase[];
  onCreateNew: () => void;
  onEditCase: (c: PatientCase) => void;
  onDeleteCase: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ cases, onCreateNew, onEditCase, onDeleteCase }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">แผงควบคุมสำหรับอาจารย์</h2>
          <p className="text-slate-600">จัดการสถานการณ์จำลองและติดตามความคืบหน้าของนักศึกษา</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all"
        >
          <i className="fas fa-plus"></i> สร้างสถานการณ์ใหม่
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'สถานการณ์ทั้งหมด', value: cases.length, icon: 'fa-folder-open', color: 'bg-indigo-500' },
          { label: 'จำนวนการเข้าเล่น', value: '128', icon: 'fa-user-graduate', color: 'bg-emerald-500' },
          { label: 'คะแนนเฉลี่ย', value: '84%', icon: 'fa-star', color: 'bg-amber-500' },
          { label: 'ความยากเฉลี่ย', value: '72%', icon: 'fa-brain', color: 'bg-rose-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.02]">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Cases Management List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-900">รายการสถานการณ์</h3>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="ค้นหาสถานการณ์..." 
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4">ชื่อสถานการณ์ / อาการสำคัญ</th>
                <th className="px-6 py-4">ระดับความยาก</th>
                <th className="px-6 py-4">หัวข้อประเมิน</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{c.title}</div>
                    <div className="text-xs text-slate-400">{c.profile.chiefComplaint}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                      c.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      c.difficulty === 'Intermediate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {c.difficulty === 'Beginner' ? 'เริ่มต้น' : c.difficulty === 'Intermediate' ? 'ปานกลาง' : 'ขั้นสูง'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {c.criteria.length} หัวข้อ
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> เปิดใช้งาน
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button 
                      onClick={() => onEditCase(c)}
                      className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all inline-flex items-center justify-center"
                      title="แก้ไข"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      onClick={() => onDeleteCase(c.id)}
                      className="w-8 h-8 rounded-lg bg-rose-50 text-rose-400 hover:bg-rose-600 hover:text-white transition-all inline-flex items-center justify-center"
                      title="ลบ"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
