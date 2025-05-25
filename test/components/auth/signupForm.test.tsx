import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SignupForm } from '@/components/auth/signupForm'
import { signup } from '@/actions/auth'
import '@testing-library/jest-dom'

jest.mock('@/actions/auth', () => ({
    signup: jest.fn(),
}))

describe('SignupForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        render(<SignupForm />)
    })

    it('renders form fields correctly', () => {
        const emailInput = screen.getByPlaceholderText(/enter your email/i)
        const passwordInput = screen.getByPlaceholderText(/create a password/i)
        const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(confirmPasswordInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
    })

    it('shows validation errors on empty submit', async () => {
        const submitButton = screen.getByRole('button', { name: /create account/i })
        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument()
            expect(screen.getByText(/password is required/i)).toBeInTheDocument()
            expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument()
        })
    })

    it('shows invalid email error', async () => {
        const emailInput = screen.getByPlaceholderText(/enter your email/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await userEvent.type(emailInput, 'not-an-email')
        await userEvent.click(submitButton)

        await waitFor(() => {
            const errorEl = screen.getByText(/please enter a valid email address/i)
            expect(errorEl).toBeInTheDocument()
        })

    })

    it('shows password length error', async () => {
        const passwordInput = screen.getByPlaceholderText(/create a password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await userEvent.type(passwordInput, 'abc')
        await userEvent.click(submitButton)

        await waitFor(() => {
            const errorEl = screen.getByText(/password must be at least 8 characters long/i)
            expect(errorEl).toBeInTheDocument()
        })
    })

    it('shows password strength lowercase error', async () => {
        const passwordInput = screen.getByPlaceholderText(/create a password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await userEvent.type(passwordInput, 'ABCD1234')
        await userEvent.click(submitButton)

        await waitFor(() => {
            const errorEl = screen.getByText(/password must contain at least one lowercase letter/i)
            expect(errorEl).toBeInTheDocument()
        })
    })

    it('shows password strength uppercase error', async () => {
        const passwordInput = screen.getByPlaceholderText(/create a password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await userEvent.type(passwordInput, 'abcdefg1')
        await userEvent.click(submitButton)

        await waitFor(() => {
            const errorEl = screen.getByText(/password must contain at least one uppercase letter/i)
            expect(errorEl).toBeInTheDocument()
        })
    })

    it('shows password strength number error', async () => {
        const passwordInput = screen.getByPlaceholderText(/create a password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await userEvent.type(passwordInput, 'Abcdefgh')
        await userEvent.click(submitButton)

        await waitFor(() => {
            const errorEl = screen.getByText(/password must contain at least one number/i)
            expect(errorEl).toBeInTheDocument()
        })
    })

    it("shows confirm password mismatch error", async () => {
        const passwordInput = screen.getByPlaceholderText(/create a password/i)
        const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await userEvent.type(passwordInput, 'Password123')
        await userEvent.type(confirmPasswordInput, 'password321')
        await userEvent.click(submitButton)

        await waitFor(() => {
            const errorEl = screen.getByText(/passwords don't match/i)
            expect(errorEl).toBeInTheDocument()
        })
    })

    it('disables button and shows loader on submit', async () => {
        const mockLogin = signup as jest.Mock
        mockLogin.mockImplementation(() =>
            new Promise((resolve) => setTimeout(() => resolve({}), 1000))
        )

        const emailInput = screen.getByPlaceholderText(/enter your email/i)
        const passwordInput = screen.getByPlaceholderText(/create a password/i)
        const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i)
        const submitButton = screen.getByRole('button', { name: /create account/i })

        await userEvent.type(emailInput, 'test@example.com')
        await userEvent.type(passwordInput, 'Password123')
        await userEvent.type(confirmPasswordInput, 'Password123')
        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(submitButton).toBeDisabled()
            expect(submitButton.textContent?.toLowerCase()).toContain('creating account')
        }, { timeout: 2000 })
    })

})