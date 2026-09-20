import type { LifeCodeInput } from '../engine'
import { months } from './form-state'

/** Hormhormshop LINE Official Account. */
export const LINE_OA_ID = '@493micst'

/** Text the customer sends to the OA from the result page. Kept short so it reads well in chat. */
export function lineOaMessageText(input: LifeCodeInput) {
  const { name, birthDate, birthTime } = input
  const time = birthTime ? `${String(birthTime.hour).padStart(2, '0')}:${String(birthTime.minute).padStart(2, '0')} น.` : 'ไม่ได้ระบุ'
  return [
    '🔮 ขอคำแนะนำ Life Code',
    `ชื่อ: ${name}`,
    `เกิด: ${birthDate.day} ${months[birthDate.month - 1]} ${birthDate.year + 543} (ค.ศ. ${birthDate.year})`,
    `เวลาเกิด: ${time}`,
    '(ส่งจากเว็บ Life Code)',
  ].join('\n')
}

/**
 * LINE URL scheme that opens the OA chat with a prefilled message; the customer still taps send.
 * https://line.me/R/oaMessage/{LINE_ID}/?{text}
 */
export function lineOaMessageUrl(input: LifeCodeInput) {
  return `https://line.me/R/oaMessage/${encodeURIComponent(LINE_OA_ID)}/?${encodeURIComponent(lineOaMessageText(input))}`
}
