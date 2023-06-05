import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const Progress = () => {
    const progressRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;

        router.events.on('routeChangeStart', () => {
            if (!progressRef.current) {
                return;
            }

            setIsLoading(true);

            progressRef.current.style.width = '33%';

            let i = 33;

            interval = setInterval(() => {
                i += 1;

                if (progressRef.current) {
                    progressRef.current.style.width = `${i}%`;
                }
            }, 100);
        });

        router.events.on('routeChangeComplete', () => {
            if (!progressRef.current) {
                return;
            }

            setIsLoading(false);
            clearInterval(interval);
            progressRef.current.style.width = '100%';

            setTimeout(() => {
                if (progressRef.current) {
                    progressRef.current.style.width = '0%';
                }
            }, 200);
        });
    }, []);

    return (
        <div className="h-[3px] bg-white">
            <div className={twMerge('h-[3px] bg-blue w-0', isLoading && 'duration-200')} ref={progressRef}></div>
        </div>
    );
};
