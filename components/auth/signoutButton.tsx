import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {}

const SignOut = (props: Props) => {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/auth/signout', { method: 'POST' })
        router.push('/auth')
    }
    return (
        <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto text-accent-foreground bg-accent hover:bg-accent/70">
            Sign out
        </Button>
    )
}

export default SignOut