import { forwardRef } from 'react';

type Props = {
    type?: string;
    spellCheck?: boolean;
    placeholder?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(({ ...props }, ref) => (
    <input className="w-full p-2 bg-light-gray rounded-lg outline-0" ref={ref} {...props} />
));

Input.displayName = 'Input';

export { Input };
