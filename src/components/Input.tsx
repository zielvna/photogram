import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, JSX.IntrinsicElements['input']>(({ ...props }, ref) => (
    <input className="w-full p-2 bg-light-gray rounded-lg outline-0" ref={ref} {...props} />
));

Input.displayName = 'Input';
