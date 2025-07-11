import { useState, useEffect } from "react";

export function useResetProgress() {
    const [inProgress, setInProgress] = useState<boolean>(false);

    useEffect(() => {
        const checkProgress = async () => {
            try {
                const res = await fetch("/api/reset/in-progress");
                const json = await res.json();
                setInProgress(Boolean(json.inProgress));
            } catch (err) {
                console.error("Failed to check reset progress");
            }
        };

        checkProgress();
        const interval = setInterval(checkProgress, 10_000);

        return () => clearInterval(interval);
    }, []);

    return inProgress;
}
