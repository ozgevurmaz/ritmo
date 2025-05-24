import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '@/components/auth/loginForm'
import { login } from '@/actions/auth'
import '@testing-library/jest-dom'

jest.mock('@/actions/auth', () => ({
    login: jest.fn(),
}))

describe("LoginForm", () => {
    beforeEach(() => {
        jest.clearAllMocks()
        render(<LoginForm />)
    })

    it('renders form fields correctly', () => {
        const emailInput = screen.getByPlaceholderText(/enter your email/i)
        const passwordInput = screen.getByPlaceholderText(/enter your password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        expect(emailInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
    })

    it('shows validation errors on empty submit', async () => {
        const submitButton = screen.getByRole('button', { name: /sign in/i })
        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        })
    })

    it('calls login with correct data', async () => {
        const mockLogin = login as jest.Mock
        const emailInput = screen.getByPlaceholderText(/enter your email/i)
        const passwordInput = screen.getByPlaceholderText(/enter your password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await userEvent.type(emailInput, 'test@example.com')
        await userEvent.type(passwordInput, 'Password123')
        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledTimes(1)

            const formData = mockLogin.mock.calls[0][0]
            expect(formData.get('email')).toBe('test@example.com')
            expect(formData.get('password')).toBe('Password123')
        })
    })

    it('disables button and shows loader on submit', async () => {
        const mockLogin = login as jest.Mock
        mockLogin.mockImplementation(() =>
            new Promise((resolve) => setTimeout(() => resolve({}), 500))
        )

        const emailInput = screen.getByPlaceholderText(/enter your email/i)
        const passwordInput = screen.getByPlaceholderText(/enter your password/i)
        const submitButton = screen.getByRole('button', { name: /sign in/i })

        await userEvent.type(emailInput, 'test@example.com')
        await userEvent.type(passwordInput, 'Password123')
        await userEvent.click(submitButton)

        await waitFor(() => {
            expect(submitButton).toBeDisabled()
            expect(submitButton.textContent?.toLowerCase()).toContain('signing in')
        }, { timeout: 2000 })
    })
})