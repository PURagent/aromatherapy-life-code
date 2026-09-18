/** Input stays in memory. Birth dates must use the Gregorian calendar. */
export type LifeCodeInput = Readonly<{
  name: string
  birthDate: Readonly<{ year: number; month: number; day: number }>
  birthTime: Readonly<{ hour: number; minute: number }> | null
}>

/** No personal code or recommendation exists while the owner's rule is missing. */
export type PendingLifeCodeResult = Readonly<{
  status: 'pending-confirmation'
  engineId: 'pending-confirmation'
  title: string
  message: string
}>

// Add a confirmed result variant only after the owner defines its shape and rule.
export type LifeCodeResult = PendingLifeCodeResult

export interface LifeCodeEngine {
  readonly id: string
  calculate(input: LifeCodeInput): LifeCodeResult
}
