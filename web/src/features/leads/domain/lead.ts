export const leadSources = [
  'instagram',
  'facebook',
  'landing_page',
  'referido',
  'otro',
] as const

export type LeadSource = (typeof leadSources)[number]

export type Lead = {
  id: string
  name: string
  email: string
  phone: string
  source: LeadSource
  productInterest: string
  budget: number | null
  createdAt: string
}

export type LeadFilters = {
  query: string
  source: LeadSource | 'all'
  startDate: string
  endDate: string
}
