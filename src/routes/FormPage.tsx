import { useRef, useState } from 'react'
import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { LocalLink } from '../App'
import type { Navigate } from '../App'
import { BrandMark, Icon } from '../components/Visuals'
import site from '../content/site.json'
import type { LifeCodeInput } from '../engine'
import { convertYear, localCalendarDate, validateBirthDate, validateBirthTime } from '../lib/dates'
import type { CalendarEra } from '../lib/dates'

import { emptyDraft, months } from '../components/form-state'
import type { FormDraft } from '../components/form-state'

type FieldName = 'name' | 'day' | 'month' | 'year' | 'time'
type FormErrors = Partial<Record<FieldName, string>>

type FormPageProps = {
  draft: FormDraft
  setDraft: Dispatch<SetStateAction<FormDraft>>
  onSubmit: (input: LifeCodeInput) => void
  onReset: () => void
  notice: string
  navigate: Navigate
}

export function FormPage({ draft, setDraft, onSubmit, onReset, notice, navigate }: FormPageProps) {
  const [errors, setErrors] = useState<FormErrors>({})
  const formRef = useRef<HTMLFormElement>(null)
  const today = localCalendarDate()
  const selectedDate = validateBirthDate(draft, today)
  const years = Array.from({ length: today.year - 1900 + 1 }, (_, index) => today.year - index)

  function updateField(field: FieldName, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      const next = { ...current }
      delete next[field]
      if (field === 'day' || field === 'month' || field === 'year') {
        delete next.day
        delete next.month
        delete next.year
      }
      return next
    })
  }

  function changeEra(era: CalendarEra) {
    setDraft((current) => ({
      ...current,
      era,
      year: current.year === '' ? '' : String(convertYear(Number(current.year), current.era, era)),
    }))
    setErrors((current) => ({ ...current, year: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: FormErrors = {}
    const name = draft.name.trim()
    if (!name) nextErrors.name = 'กรอกชื่อที่ต้องการใช้'
    else if (name.length > 80) nextErrors.name = 'ใช้ชื่อไม่เกิน 80 ตัวอักษร'

    if (!draft.day) nextErrors.day = 'เลือกวันเกิด'
    if (!draft.month) nextErrors.month = 'เลือกเดือนเกิด'
    if (!draft.year) nextErrors.year = 'เลือกปีเกิด'

    const dateResult = validateBirthDate(draft, today)
    if (!dateResult.ok && !nextErrors[dateResult.field]) nextErrors[dateResult.field] = dateResult.error
    const timeResult = validateBirthTime(draft.time)
    if (!timeResult.ok) nextErrors.time = timeResult.error
    const timeField = formRef.current?.querySelector<HTMLInputElement>('[name="time"]')
    if (timeField?.validity.badInput) nextErrors.time = 'กรอกเวลาเกิดให้ครบทั้งชั่วโมงและนาที หรือเว้นว่างหากไม่ทราบ'

    setErrors(nextErrors)
    const firstInvalid = (['name', 'day', 'month', 'year', 'time'] as const).find((field) => nextErrors[field])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${firstInvalid}"]`)?.focus()
      return
    }
    if (!dateResult.ok || !timeResult.ok) return

    const timeParts = timeResult.time?.split(':').map(Number)
    onSubmit({
      name,
      birthDate: dateResult.date,
      birthTime: timeParts ? { hour: timeParts[0], minute: timeParts[1] } : null,
    })
  }

  function handleReset() {
    setErrors({})
    setDraft({ ...emptyDraft })
    onReset()
    formRef.current?.querySelector<HTMLInputElement>('[name="name"]')?.focus()
  }

  return (
    <>
      <section id="begin" tabIndex={-1} className="welcome-layout" aria-labelledby="welcome-title">
        <div className="welcome-story">
          <h2 id="welcome-title">Your own<br /><em>universe.</em></h2>
          <p className="hero-thai">เริ่มทำความรู้จัก<br />เรื่องราวในแบบของคุณ</p>
          <p className="hero-description">กรอกข้อมูลเพื่อทดลองขั้นตอนของ Life Code<br />ใช้เวลาเพียงช่วงสั้น ๆ และไม่ต้องสมัครสมาชิก</p>
          <BrandMark />
          <p className="wheel-caption">ชื่อและวันเกิดอยู่ในหน้านี้ชั่วคราว<br />คุณเลือกเริ่มใหม่ได้ทุกเมื่อ</p>
        </div>

        <div className="form-panel">
          <div className="form-heading">
            <h2>ทำความรู้จักรหัสของคุณ</h2>
            <p>ลองกรอกข้อมูลเพื่อดูสถานะของรหัส ไม่ต้องสมัครสมาชิก</p>
          </div>
          <p className="prototype-note"><span className="status-dot" aria-hidden="true" />{site.pendingFormula}</p>

          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="birth-name">ชื่อของคุณ <span aria-hidden="true">*</span></label>
              <input
                id="birth-name"
                name="name"
                type="text"
                autoComplete="off"
                maxLength={80}
                required
                placeholder="ชื่อที่ต้องการใช้"
                value={draft.name}
                onChange={(event) => updateField('name', event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
            </div>

            <fieldset className="birth-fields">
              <legend>วันเดือนปีเกิด <span aria-hidden="true">*</span></legend>
              <div className="calendar-toggle" role="group" aria-label="รูปแบบปีเกิด">
                <button type="button" aria-pressed={draft.era === 'BE'} onClick={() => changeEra('BE')}>พ.ศ.</button>
                <button type="button" aria-pressed={draft.era === 'CE'} onClick={() => changeEra('CE')}>ค.ศ.</button>
              </div>
              <div className="date-grid">
                <div>
                  <label className="sr-only" htmlFor="birth-day">วันเกิด</label>
                  <select
                    id="birth-day" name="day" value={draft.day} required
                    onChange={(event) => updateField('day', event.target.value)}
                    aria-invalid={Boolean(errors.day)}
                    aria-describedby={errors.day ? 'day-error' : undefined}
                  >
                    <option value="">วัน</option>
                    {Array.from({ length: 31 }, (_, index) => index + 1).map((day) => <option key={day} value={day}>{day}</option>)}
                  </select>
                  {errors.day && <p className="field-error" id="day-error">{errors.day}</p>}
                </div>
                <div>
                  <label className="sr-only" htmlFor="birth-month">เดือนเกิด</label>
                  <select
                    id="birth-month" name="month" value={draft.month} required
                    onChange={(event) => updateField('month', event.target.value)}
                    aria-invalid={Boolean(errors.month)}
                    aria-describedby={errors.month ? 'month-error' : undefined}
                  >
                    <option value="">เดือน</option>
                    {months.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
                  </select>
                  {errors.month && <p className="field-error" id="month-error">{errors.month}</p>}
                </div>
                <div>
                  <label className="sr-only" htmlFor="birth-year">ปีเกิด ({draft.era === 'BE' ? 'พ.ศ.' : 'ค.ศ.'})</label>
                  <select
                    id="birth-year" name="year" value={draft.year} required
                    onChange={(event) => updateField('year', event.target.value)}
                    aria-invalid={Boolean(errors.year)}
                    aria-describedby={errors.year ? 'year-error' : undefined}
                  >
                    <option value="">ปี</option>
                    {years.map((year) => {
                      const displayYear = convertYear(year, 'CE', draft.era)
                      return <option key={year} value={displayYear}>{displayYear}</option>
                    })}
                  </select>
                  {errors.year && <p className="field-error" id="year-error">{errors.year}</p>}
                </div>
              </div>
              <p className="field-hint date-confirmation" aria-live="polite" aria-atomic="true">
                {selectedDate.ok
                  ? `คุณเลือก: ${selectedDate.date.day} ${months[selectedDate.date.month - 1]} พ.ศ. ${selectedDate.date.year + 543} (ค.ศ. ${selectedDate.date.year})`
                  : 'เลือกวัน เดือน และปีเกิด โดยสลับ พ.ศ. หรือ ค.ศ. ได้'}
              </p>
            </fieldset>

            <div className="field time-field">
              <label htmlFor="birth-time">เวลาเกิด <span className="field-hint">(ไม่บังคับ)</span></label>
              <input
                id="birth-time" name="time" type="time" step="60" autoComplete="off"
                value={draft.time}
                onChange={(event) => updateField('time', event.target.value)}
                aria-invalid={Boolean(errors.time)}
                aria-describedby={errors.time ? 'time-hint time-error' : 'time-hint'}
              />
              <p className="field-hint" id="time-hint">เว้นว่างได้ หากไม่ทราบเวลาเกิด</p>
              {errors.time && <p className="field-error" id="time-error">{errors.time}</p>}
            </div>

            <button className="button primary submit-button" type="submit">ดูสถานะรหัสของฉัน <Icon name="arrow" /></button>
            <button className="reset-button" type="button" onClick={handleReset}>ล้างข้อมูล</button>
            <p className="privacy-hint"><Icon name="lock" /><span>ข้อมูลอยู่ในหน้านี้ชั่วคราวเท่านั้น <LocalLink to="/privacy" navigate={navigate}>ความเป็นส่วนตัว</LocalLink></span></p>
            <p className="live-notice" role="status" aria-live="polite">{notice}</p>
          </form>
        </div>
      </section>

      <section className="discovery-strip" aria-labelledby="discovery-title">
        <div>
          <Icon name="leaf" />
          <h2 id="discovery-title">เรื่องราวของตัวเลขและความหอม</h2>
          <p>เริ่มจากชื่อกลิ่นที่คุณอยากรู้จัก</p>
        </div>
        <LocalLink className="text-link" to="/scents" navigate={navigate}>สำรวจกลิ่นทั้งหมด <Icon name="arrow" /></LocalLink>
      </section>
      <section id="numbers" tabIndex={-1} className="number-index" aria-labelledby="numbers-heading">
        <h2 id="numbers-heading">เรื่องราวของตัวเลข</h2>
        <p>ความหมายและการจับคู่กลิ่นจะปรากฏเมื่อเจ้าของแบรนด์ยืนยันแล้ว</p>
        <div>
          {Array.from({ length: 9 }, (_, index) => index + 1).map((number) => (
            <LocalLink key={number} to={`/numbers/${number}`} navigate={navigate}><span className="sr-only">เรื่องราวเลข </span>{number}</LocalLink>
          ))}
        </div>
      </section>
    </>
  )
}
