import { describe, expect, it } from 'vitest'

import { leadFormSchema } from './lead.schema'

describe('leadFormSchema', () => {
  it('returns the custom message when email is invalid', () => {
    const result = leadFormSchema.safeParse({
      name: 'Jane Doe',
      email: 'invalid-email',
      phone: '3001234567',
      source: 'instagram',
      productInterest: 'Consulting',
      budget: '1000',
    })

    expect(result.success).toBe(false)

    if (result.success) {
      throw new Error('Expected invalid email input to fail validation')
    }

    expect(result.error.flatten().fieldErrors.email).toEqual([
      'Email must be valid',
    ])
  })
})
