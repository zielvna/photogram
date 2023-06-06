import { forwardRef } from 'react';

type Props = {
    spellCheck?: boolean;
    placeholder?: string;
    rows?: number;
    defaultValue?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ ...props }, ref) => (
    <textarea className="w-full p-2 bg-light-gray rounded-lg outline-0 resize-none" ref={ref} {...props}></textarea>
));

Textarea.displayName = 'Textarea';
