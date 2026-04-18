import type { Lead } from '../domain/lead'

type LeadInput = Omit<Lead, 'id' | 'createdAt'>

/**
 * Reads JSON response or throws stable request error.
 */
async function readJson<T>(response: Response, message: string): Promise<T> {
  if (!response.ok) {
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

/**
 * Fetches full lead collection from mocked API.
 */
export function fetchLeads() {
  return fetch('/api/leads').then((response) =>
    readJson<Lead[]>(response, 'Lead request failed'),
  )
}

/**
 * Creates lead through mocked API.
 */
export function createLeadRequest(input: LeadInput) {
  return fetch('/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }).then((response) => readJson<Lead>(response, 'Lead create failed'))
}

/**
 * Updates lead through mocked API.
 */
export function updateLeadRequest(id: string, input: LeadInput) {
  return fetch(`/api/leads/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  }).then((response) => readJson<Lead>(response, 'Lead update failed'))
}

/**
 * Deletes lead through mocked API.
 */
export function deleteLeadRequest(id: string) {
  return fetch(`/api/leads/${id}`, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Lead delete failed')
    }
  })
}
