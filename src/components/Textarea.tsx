import { forwardRef } from 'react';

export const Textarea = forwardRef<HTMLTextAreaElement, JSX.IntrinsicElements['textarea']>(({ ...props }, ref) => (
    <textarea className="w-full p-2 bg-light-gray rounded-lg outline-0 resize-none" ref={ref} {...props}></textarea>
));

Textarea.displayName = 'Textarea';
