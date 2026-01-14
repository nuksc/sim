
export interface CaseCriteria {
  id: string;
  category: 'Present Illness' | 'Past History' | 'Family History' | 'Social History';
  label: string;
  keywords: string[];
  expectedResponse: string;
}

export interface PatientProfile {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  chiefComplaint: string;
  avatarUrl?: string;
  detailedBackground: string;
  personality: string;
}

export interface PatientCase {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  profile: PatientProfile;
  criteria: CaseCriteria[];
  expectedDiagnosis?: string; // การวินิจฉัยที่ถูกต้อง
  diagnosisRationale?: string; // คำอธิบาย/เหตุผลสนับสนุน
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface SessionResult {
  sessionId: string;
  caseId: string;
  studentName: string;
  score: number;
  criteriaMet: string[];
  studentDiagnosis: string;
  diagnosisScore: number;
  feedback: string;
  history: ChatMessage[];
  timestamp: number;
}
