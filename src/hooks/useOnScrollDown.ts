import { useEffect } from 'react';

export const useOnScrollDown = (handler: (event: Event) => void) => {
    useEffect(() => {
        const listener = async (event: Event) => {
            if (window.innerHeight + Math.round(window.scrollY) >= document.body.offsetHeight) {
                handler(event);
            }
        };

        window.addEventListener('scroll', listener);

        return () => window.removeEventListener('scroll', listener);
    });
};
