export interface SwapAction {
  (left: number, right: number): Promise<void>
}

export interface CompareAction {
  (left: number, right: number): Promise<boolean>
}

export type DelayOption = 'slow' | 'normal' | 'fast' | 'fastest'
