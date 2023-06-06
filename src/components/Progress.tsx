import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const Progress = () => {
    const progressRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [widthPercent, setWidthPercent] = useState(0);
    const router = useRouter();

    const routeChangeStartListener = () => {
        if (!progressRef.current) {
            return;
        }

        setWidthPercent(75);
        setIsLoading(true);
    };

    const routeChangeCompleteListener = () => {
        if (!progressRef.current) {
            return;
        }

        setWidthPercent(100);
        setIsLoading(false);

        setTimeout(() => {
            setWidthPercent(0);
        }, 300);
    };

    useEffect(() => {
        router.events.on('routeChangeStart', routeChangeStartListener);
        router.events.on('routeChangeComplete', routeChangeCompleteListener);

        return () => {
            router.events.off('routeChangeStart', routeChangeStartListener);
            router.events.off('routeChangeComplete', routeChangeCompleteListener);
        };
    }, [isLoading, progressRef.current]);

    useEffect(() => {
        if (progressRef.current) {
            progressRef.current.style.width = `${widthPercent}%`;
        }
    }, [widthPercent]);

    return (
        <div className="h-[3px] bg-white">
            <div className={twMerge('h-[3px] bg-blue', isLoading && 'duration-300')} ref={progressRef}></div>
        </div>
    );
};
