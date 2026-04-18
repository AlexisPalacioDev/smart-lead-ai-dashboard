import type { Lead } from '../domain/lead'

export type LeadInput = Omit<Lead, 'id' | 'createdAt'>

export interface LeadRepositoryPort {
  list(): Promise<Lead[]>
  create(input: LeadInput): Promise<Lead>
  update(id: string, input: LeadInput): Promise<Lead>
  remove(id: string): Promise<void>
}
