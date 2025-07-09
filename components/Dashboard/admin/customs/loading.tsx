import { RefreshCw } from 'lucide-react'
import React from 'react'

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <RefreshCw className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
    )
}

export default Loading