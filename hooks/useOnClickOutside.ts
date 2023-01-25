import { useEffect, RefObject } from 'react';

const useOnClickOutside = (ref: RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const element = ref?.current;

            if (!element || element.contains((event?.target as Node) || null)) {
                return;
            }

            handler(event);
        };

        document.addEventListener('mouseup', listener);
        document.addEventListener('touchend', listener);

        return () => {
            document.removeEventListener('mouseup', listener);
            document.removeEventListener('touchend', listener);
        };
    }, [ref, handler]);
};

export default useOnClickOutside;
