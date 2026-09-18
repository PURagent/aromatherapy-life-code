import type { LifeCodeEngine, PendingLifeCodeResult } from './types'

const pendingResult: PendingLifeCodeResult = Object.freeze({
  status: 'pending-confirmation',
  engineId: 'pending-confirmation',
  title: 'รหัสของคุณอยู่ระหว่างรอการยืนยัน',
  message:
    'กำลังรอสูตรและตัวอย่างที่ยืนยันโดยหมอเน่ จึงยังไม่แสดงรหัสหรือแนะนำกลิ่นเฉพาะบุคคล ข้อมูลที่กรอกไม่ได้ถูกนำไปสร้างผลลัพธ์ชั่วคราว',
})

/**
 * Q1–Q4 in _plan/00-requirements.md remain unresolved.
 * An empty fixture file is missing evidence, not approval of an algorithm.
 * This engine performs no calculation, I/O, logging, or input retention.
 */
export const pendingConfirmationEngine: LifeCodeEngine = Object.freeze({
  id: 'pending-confirmation',
  calculate: () => pendingResult,
})
