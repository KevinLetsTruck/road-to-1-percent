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
          // Financial Foundation Assessment
          financial_foundation_completed: boolean
          financial_foundation_score?: number | null
          // Market Intelligence Assessment
          market_intelligence_completed: boolean
          market_intelligence_score?: number | null
          // Personal Strengths Assessment
          personal_strengths_completed: boolean
          personal_strengths_score?: number | null
          // Risk Management Assessment
          risk_management_completed: boolean
          risk_management_score?: number | null
          // Support Systems Assessment
          support_systems_completed: boolean
          support_systems_score?: number | null
          // Legacy fields (keeping for backward compatibility)
          spi_completed: boolean
          spi_score?: number | null
          strength_combination?: string | null
          standout_completed: boolean
          standout_role_1?: string | null
          standout_role_2?: string | null
          standout_score?: number | null
          industry_knowledge_completed?: boolean | null
          industry_knowledge_score?: number | null
          leadership_completed: boolean
          leadership_score?: number | null
          customer_service_completed: boolean
          customer_service_score?: number | null
          operational_completed: boolean
          operational_score?: number | null
          health_completed: boolean
          health_score?: number | null
          business_track_progress: number
          personal_track_progress: number
          health_track_progress: number
          milestones_achieved: unknown[]
          program_start_date: string
          last_assessment_date?: string | null
          next_quarterly_assessment_date?: string | null
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
      comprehensive_assessments: {
        Row: {
          id: string
          user_id: string
          net_worth: number
          monthly_savings: number
          emergency_fund_months: number
          debt_to_income_ratio: number
          business_capital: number
          credit_score: number
          rate_understanding: number
          cost_analysis: number
          customer_knowledge: number
          industry_trends: number
          strategic_planning: number
          pioneer_strength: number
          creator_strength: number
          innovator_strength: number
          connector_strength: number
          advisor_strength: number
          contingency_planning: number
          insurance_optimization: number
          business_continuity: number
          risk_assessment: number
          family_alignment: number
          professional_network: number
          mentorship: number
          industry_reputation: number
          total_spi_score: number
          tier: string
          strength_combination: string
          assessment_date: string
          created_at: string
        }
      }
    }
  }
}