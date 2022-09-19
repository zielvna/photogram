import { useRef, useState } from 'react';
import classnames from 'classnames';
import { RiCamera2Line, RiCloseLine, RiSearchLine, RiHomeLine, RiAddBoxLine, RiUserLine } from 'react-icons/ri';

import useOnClickOutside from '../../hooks/useOnClickOutside';
import Input from '../Input';
import Search from '../Search';

const Header = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useOnClickOutside(ref, () => {
        setIsSearchOpen(false);
    });

    function openSearch() {
        setIsSearchOpen(true);
    }

    function closeSearch() {
        setIsSearchOpen(false);
    }

    return (
        <header className="h-16 flex justify-center bg-white">
            <div className="w-full max-w-5xl px-2 flex items-center justify-between">
                <div className={classnames('w-44', { 'hidden md:block': isSearchOpen })}>
                    <RiCamera2Line className="text-3xl text-black cursor-pointer" />
                </div>
                <div
                    className={classnames('flex items-center md:w-80 md:relative', { 'w-full': isSearchOpen })}
                    ref={ref}
                >
                    <div className={classnames('w-full md:block', { hidden: !isSearchOpen })}>
                        <Input name="search" placeholder="Search" spellCheck="false" onClick={openSearch} />
                    </div>
                    <RiCloseLine
                        className={classnames('ml-2 text-3xl text-black shrink-0 cursor-pointer md:hidden', {
                            hidden: !isSearchOpen,
                        })}
                        onClick={closeSearch}
                    />
                    <Search isOpen={isSearchOpen} />
                </div>
                <div className={classnames('w-44 flex justify-end', { 'hidden md:flex': isSearchOpen })}>
                    <RiSearchLine className="mx-2 text-3xl text-black cursor-pointer md:hidden" onClick={openSearch} />
                    <RiHomeLine className="mx-2 text-3xl text-black cursor-pointer" />
                    <RiAddBoxLine className="mx-2 text-3xl text-black cursor-pointer" />
                    <RiUserLine className="ml-2 text-3xl text-black cursor-pointer" />
                </div>
            </div>
        </header>
    );
};

export default Header;
