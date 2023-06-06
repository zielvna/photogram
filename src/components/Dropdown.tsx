import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    show: boolean;
    items: string[];
    onChange: (name: string) => void;
};

type Ref = HTMLDivElement;

const Dropdown = forwardRef<Ref, Props>(({ show, items, onChange }, ref) => (
    <div
        className={twMerge(
            'bg-black/50 px-4 pb-4 flex fixed inset-0 z-10 md:bg-transparent md:px-0 md:pb-0 md:absolute md:inset-auto md:right-0',
            !show && 'hidden'
        )}
    >
        <div className="w-full bg-white border border-light-gray self-center rounded-lg cursor-pointer">
            <div ref={ref}>
                {items.map((name) => (
                    <div className="py-2 px-4 border-b border-light-gray" key={name} onClick={() => onChange(name)}>
                        {name}
                    </div>
                ))}
            </div>
            <div className="py-2 px-4 block">Close</div>
        </div>
    </div>
));

Dropdown.displayName = 'Dropdown';

export { Dropdown };
