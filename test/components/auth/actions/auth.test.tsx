import { login, signup } from '@/actions/auth'

jest.mock('next/navigation', () => ({
    redirect: jest.fn(),
}))
jest.mock('next/cache', () => ({
    revalidatePath: jest.fn(),
}))

jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn(() => ({
        auth: {
            signInWithPassword: jest.fn().mockResolvedValue({ data: {}, error: null }),
            signUp: jest.fn().mockResolvedValue({ data: { user: { id: 'test-id' } }, error: null }),
        },
        from: jest.fn(() => ({
            insert: jest.fn().mockResolvedValue({ error: null }),
        })),
    })),
}))

describe('login action', () => {
    it('returns validation error if email is invalid', async () => {
        const formData = new FormData()
        formData.set('email', 'invalid-email')
        formData.set('password', '123456')

        const result = await login(formData)

        expect(result?.error).toBe('Invalid data')
        expect(result?.issues?.email).toContain('Please enter a valid email address')
    })
})

describe('signup action', () => {
    it('returns validation error if password too short', async () => {
        const formData = new FormData()
        formData.set('email', 'test@example.com')
        formData.set('password', 'Aa1')

        const result = await signup(formData)

        expect(result?.error).toBe('Invalid data')
        expect(result?.issues?.password).toContain('Password must be at least 8 characters long')
    })

    it('calls Supabase and inserts profile on success', async () => {
        const formData = new FormData()
        formData.set('email', 'test@example.com')
        formData.set('password', 'Aa123456')
        formData.set('confirmPassword', 'Aa123456')

        const result = await signup(formData)

        expect(result).toBeUndefined()
    })
})
