import { useState } from 'react'
import { LocalLink } from '../App'
import type { Navigate, SessionResult } from '../App'
import { BrandMark, Icon } from '../components/Visuals'
import { months } from '../components/form-state'

export function ResultPage({ session, navigate, onReset }: { session: SessionResult | null; navigate: Navigate; onReset: () => void }) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  async function save() {
    setSaving(true)
    try { const { downloadPendingCard } = await import('../components/share-status'); await downloadPendingCard(); setMessage('บันทึกภาพสถานะแล้ว ภาพไม่มีชื่อหรือวันเกิดของคุณ') }
    catch { setMessage('ยังบันทึกภาพไม่ได้ ลองอีกครั้งได้เลย') }
    finally { setSaving(false) }
  }
  if (!session) return <section className="empty-page"><BrandMark /><h1>เริ่มต้นจากข้อมูลของคุณ</h1><p>หน้านี้ไม่เก็บข้อมูลหลังรีเฟรช<br />กรอกข้อมูลอีกครั้งเพื่อดูสถานะรหัสของคุณ</p><LocalLink to="/" navigate={navigate} className="button primary">กลับไปกรอกข้อมูล <Icon name="arrow" /></LocalLink></section>
  const { input, result } = session
  return <section className="result-page">
    <LocalLink to="/" navigate={navigate} className="back-link"><Icon name="back" /> กลับไปแก้ไขข้อมูล</LocalLink>
    <div className="result-heading"><BrandMark /><h1>ขอบคุณค่ะ คุณ<span className="user-name">{input.name}</span></h1><p>ข้อมูลของคุณพร้อมสำหรับขั้นตอนถัดไปแล้ว</p></div>
    <div className="pending-result" role="status"><span className="pending-seal" aria-hidden="true"><Icon name="leaf" /></span><h2>รอยืนยันสูตร</h2><p>{result.message}</p><p className="no-result-note">ยังไม่มีการคำนวณตัวเลขหรือแนะนำกลิ่นประจำตัว</p></div>
    <dl className="input-summary"><div><dt>วันที่คุณเลือก</dt><dd>{input.birthDate.day} {months[input.birthDate.month - 1]} {input.birthDate.year + 543}<small>ค.ศ. {input.birthDate.year}</small></dd></div><div><dt>เวลาเกิด</dt><dd>{input.birthTime ? `${String(input.birthTime.hour).padStart(2, '0')}:${String(input.birthTime.minute).padStart(2, '0')} น.` : 'ไม่ได้ระบุ'}</dd></div></dl>
    <div className="result-actions"><LocalLink to="/scents" navigate={navigate} className="button primary">สำรวจโลกของกลิ่น <Icon name="arrow" /></LocalLink><button type="button" className="button secondary" onClick={save} disabled={saving}><Icon name="download" />{saving ? 'กำลังบันทึกภาพ…' : 'บันทึกภาพสถานะ'}</button></div>
    <p className="field-hint share-note">ภาพสถานะจะระบุว่ารอยืนยันสูตร และไม่มีข้อมูลส่วนตัว</p><p className="live-notice" role="status">{message}</p><button type="button" className="reset-button" onClick={onReset}>ล้างข้อมูลและเริ่มใหม่</button>
  </section>
}
