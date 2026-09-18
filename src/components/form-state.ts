import type { CalendarEra } from '../lib/dates'

export type FormDraft = { name: string; day: string; month: string; year: string; era: CalendarEra; time: string }
export const emptyDraft: FormDraft = { name: '', day: '', month: '', year: '', era: 'BE', time: '' }
export const months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
