import classnames from 'classnames';
import { RefObject } from 'react';

type Props = {
    show: boolean;
    items: Array<string>;
    passRef: RefObject<HTMLDivElement>;
    onChange: (name: string) => void;
};

const Dropdown = ({ show, items, passRef, onChange }: Props) => {
    function itemClick(name: string) {
        onChange(name);
    }

    return (
        <div
            className={classnames(
                'bg-black/50 px-4 pb-4 flex fixed inset-0 z-10 md:bg-transparent md:px-0 md:pb-0 md:absolute md:inset-auto md:right-0',
                { hidden: !show }
            )}
        >
            <div className="w-full bg-white border border-light-gray self-center rounded-lg cursor-pointer">
                <div ref={passRef}>
                    {items.map((name) => (
                        <div
                            className="py-2 px-4 border-b border-light-gray"
                            key={name}
                            onClick={() => itemClick(name)}
                        >
                            {name}
                        </div>
                    ))}
                </div>
                <div className="py-2 px-4 block">Close</div>
            </div>
        </div>
    );
};

export default Dropdown;
