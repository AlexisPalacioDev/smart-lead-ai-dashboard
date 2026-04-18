import { nanoid } from 'nanoid'
import { HttpResponse, http } from 'msw'

import type { LeadInput } from '../features/leads/application/lead-ports'
import { readStoredLeads, writeStoredLeads } from '../features/leads/infrastructure/leads-storage'

/**
 * MSW handlers back browser-only lead persistence with localStorage.
 */
export const handlers = [
  http.get('/api/leads', () => {
    return HttpResponse.json(readStoredLeads())
  }),
  http.post('/api/leads', async ({ request }) => {
    const input = (await request.json()) as LeadInput
    const lead = {
      id: nanoid(),
      createdAt: new Date().toISOString(),
      ...input,
    }

    writeStoredLeads([lead, ...readStoredLeads()])

    return HttpResponse.json(lead, { status: 201 })
  }),
  http.put('/api/leads/:leadId', async ({ params, request }) => {
    const input = (await request.json()) as LeadInput
    let updatedLead = null

    const nextLeads = readStoredLeads().map((lead) => {
      if (lead.id !== params.leadId) {
        return lead
      }

      updatedLead = { ...lead, ...input }

      return updatedLead
    })

    if (!updatedLead) {
      return HttpResponse.json({ message: 'Lead not found' }, { status: 404 })
    }

    writeStoredLeads(nextLeads)

    return HttpResponse.json(updatedLead)
  }),
  http.delete('/api/leads/:leadId', ({ params }) => {
    const nextLeads = readStoredLeads().filter((lead) => lead.id !== params.leadId)

    writeStoredLeads(nextLeads)

    return new HttpResponse(null, { status: 204 })
  }),
]
