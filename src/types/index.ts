export * from './database'

export interface SPIFormData {
  cashChecking: number
  savings: number
  investments: number
  retirement: number
  realEstate: number
  vehicles: number
  equipment: number
  otherAssets: number
  creditCards: number
  autoLoans: number
  mortgage: number
  equipmentLoans: number
  personalLoans: number
  otherDebts: number
  monthlyIncome: number
  monthlyExpenses: number
  emergencyFundMonths: number
}

export interface AssessmentQuestion {
  id: string
  text: string
  type: 'radio' | 'scale' | 'text' | 'multiselect'
  options?: string[]
  required: boolean
  category?: string
}

export interface DashboardStats {
  currentTier: UserTier
  completedAssessments: number
  totalAssessments: number
  businessProgress: number
  personalProgress: number
  healthProgress: number
  nextMilestone: string
  daysInProgram: number
}