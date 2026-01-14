
import { PatientCase } from './types';

export const INITIAL_CASES: PatientCase[] = [
  {
    id: 'case-001',
    title: 'Chest Pain Crisis (วิกฤตอาการเจ็บหน้าอก)',
    difficulty: 'Intermediate',
    profile: {
      name: 'นายสมชาย รักดี',
      age: 55,
      gender: 'Male',
      chiefComplaint: 'เจ็บแน่นหน้าอกมาประมาณ 2 ชั่วโมง',
      detailedBackground: 'อดีตข้าราชการครู สูบบุหรี่จัดมา 20 ปี มีประวัติครอบครัวเป็นโรคหัวใจ เริ่มเจ็บหน้าอกขณะกำลังทำสวนหลังบ้าน',
      personality: 'วิตกกังวล พูดสั้นๆ เพราะเหนื่อยหอบ'
    },
    expectedDiagnosis: 'กล้ามเนื้อหัวใจขาดเลือดเฉียบพลัน (Acute Myocardial Infarction)',
    diagnosisRationale: 'ผู้ป่วยมีปัจจัยเสี่ยงคือเพศชาย อายุมาก และสูบบุหรี่จัด อาการเจ็บหน้าอกเกิดขึ้นขณะออกแรง และมีลักษณะเจ็บแน่นเหมือนมีอะไรทับ ร่วมกับมีอาการร้าวไปที่กรามและแขนซ้าย ซึ่งเป็นอาการคลาสสิกของโรคหัวใจขาดเลือด',
    criteria: [
      {
        id: 'crit-1',
        category: 'Present Illness',
        label: 'ลักษณะการเจ็บ (PQRST - Quality)',
        keywords: ['ลักษณะการเจ็บ', 'เจ็บแบบไหน', 'เจ็บอย่างไร', 'แน่น'],
        expectedResponse: 'มันเจ็บแน่นๆ เหมือนมีคนเอาหินมาทับหน้าอกเลยครับ หายใจลำบากด้วย'
      },
      {
        id: 'crit-2',
        category: 'Present Illness',
        label: 'การร้าวของอาการเจ็บ (PQRST - Region)',
        keywords: ['ร้าวไปไหน', 'เจ็บตรงไหนบ้าง', 'แขน', 'กราม'],
        expectedResponse: 'มันร้าวขึ้นไปที่กราม แล้วก็ลงไปที่แขนซ้ายครับ'
      },
      {
        id: 'crit-3',
        category: 'Past History',
        label: 'โรคประจำตัว',
        keywords: ['โรคประจำตัว', 'ความดัน', 'เบาหวาน'],
        expectedResponse: 'มีความดันโลหิตสูงครับ กินยาบ้างไม่กินบ้าง แล้วแต่จะนึกได้'
      },
      {
        id: 'crit-4',
        category: 'Social History',
        label: 'ประวัติการสูบบุหรี่',
        keywords: ['สูบบุหรี่', 'บุหรี่'],
        expectedResponse: 'สูบวันละซองครับ สูบมาตั้งแต่วัยรุ่นแล้ว หมอก็บอกให้เลิกแต่ยังทำไม่ได้'
      }
    ]
  },
  {
    id: 'case-002',
    title: 'Pediatric Fever (ไข้ในเด็ก)',
    difficulty: 'Beginner',
    profile: {
      name: 'คุณมะลิ (มารดาของน้องแก้ม)',
      age: 30,
      gender: 'Female',
      chiefComplaint: 'ลูกสาวตัวร้อนจัดและมีผื่นขึ้นตามตัว',
      detailedBackground: 'คุณแม่กังวลมาก น้องแก้มอายุ 5 ขวบ มีไข้สูงมา 3 วัน กินยาลดไข้แล้วไม่ดีขึ้น วันนี้เริ่มมีผื่นแดงขึ้นที่หน้าและลำตัว',
      personality: 'ขี้กังวล ตอบละเอียด รักลูกมาก'
    },
    expectedDiagnosis: 'โรคหัด (Measles)',
    diagnosisRationale: 'เด็กมีอาการไข้สูงติดต่อกันหลายวัน มีผื่นแดงเริ่มขึ้นจากใบหน้าลามไปตามลำตัว ร่วมกับมีประวัติยังได้รับวัคซีนไม่ครบตามเกณฑ์',
    criteria: [
      {
        id: 'crit-5',
        category: 'Present Illness',
        label: 'ระยะเวลาของไข้',
        keywords: ['เป็นมานานแค่ไหน', 'มีไข้กี่วัน', 'ไข้สูง'],
        expectedResponse: 'น้องมีไข้มา 3 วันแล้วค่ะ ตัวร้อนจี๋ตลอดเลย'
      },
      {
        id: 'crit-6',
        category: 'Past History',
        label: 'ประวัติการแพ้ยา',
        keywords: ['แพ้ยา', 'แพ้อะไรไหม'],
        expectedResponse: 'น้องแพ้ยาเพนิซิลลินค่ะ เคยฉีดแล้วผื่นขึ้นทั้งตัวเลย'
      }
    ]
  }
];
