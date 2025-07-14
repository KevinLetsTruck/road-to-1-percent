export type UserTier = '90%' | '9%' | '1%'
export type RelationshipStatus = 'pending' | 'active' | 'completed' | 'declined'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          is_admin?: boolean
        }
        Update: {
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          is_admin?: boolean
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          current_tier: UserTier
          spi_completed: boolean
          standout_completed: boolean
          standout_role_1?: string | null
          standout_role_2?: string | null
          standout_score?: number | null
          industry_knowledge_completed?: boolean | null
          industry_knowledge_score?: number | null
          leadership_completed: boolean
          customer_service_completed: boolean
          operational_completed: boolean
          health_completed: boolean
          business_track_progress: number
          personal_track_progress: number
          health_track_progress: number
          milestones_achieved: any[]
          program_start_date: string
          created_at: string
          updated_at: string
        }
      }
      spi_assessments: {
        Row: {
          id: string
          user_id: string
          cash_checking: number
          savings: number
          investments: number
          retirement: number
          real_estate: number
          vehicles: number
          equipment: number
          other_assets: number
          credit_cards: number
          auto_loans: number
          mortgage: number
          equipment_loans: number
          personal_loans: number
          other_debts: number
          monthly_income: number
          monthly_expenses: number
          emergency_fund_months: number
          overall_spi_score: number
          category: string | null
          assessment_date: string
          created_at: string
        }
      }
    }
  }
}