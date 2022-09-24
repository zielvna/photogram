import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import { RiCamera2Line, RiCloseLine, RiSearchLine, RiHomeLine, RiAddBoxLine, RiUserLine } from 'react-icons/ri';

import Link from '../Link';
import useDropdown from '../../hooks/useDropdown';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import Input from '../Input';
import Search from '../Search';
import Dropdown from '../Dropdown';

const Header = () => {
    const searchRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isDropdownOpen, openDropdown, closeDropdown] = useDropdown(dropdownRef);

    const router = useRouter();

    useOnClickOutside(searchRef, () => {
        setIsSearchOpen(false);
    });

    function openSearch() {
        setIsSearchOpen(true);
    }

    function closeSearch() {
        setIsSearchOpen(false);
    }

    function handleChange(name: string) {
        switch (name) {
            case 'Profile':
                router.push('/user/user');
                break;
            case 'Settings':
                router.push('/settings/edit-profile');
                break;
        }

        closeDropdown();
    }

    return (
        <header className="relative z-10">
            <div
                className={classnames('h-16 flex justify-center bg-white', { 'fixed inset-0 md:static': isSearchOpen })}
            >
                <div className="w-full max-w-5xl px-4 flex items-center justify-between">
                    <div className={classnames('w-44', { 'hidden md:block': isSearchOpen })}>
                        <Link href="/">
                            <RiCamera2Line className="text-3xl text-black cursor-pointer" />
                        </Link>
                    </div>
                    <div
                        className={classnames('flex items-center md:w-80 md:relative z-10', { 'w-full': isSearchOpen })}
                        ref={searchRef}
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
                        <RiSearchLine
                            className="mx-2 text-3xl text-black cursor-pointer md:hidden"
                            onClick={openSearch}
                        />
                        <Link href="/">
                            <RiHomeLine className="mx-2 text-3xl text-black cursor-pointer" />
                        </Link>
                        <Link href="/new-post">
                            <RiAddBoxLine className="mx-2 text-3xl text-black cursor-pointer" />
                        </Link>
                        <div className="md:relative">
                            <RiUserLine className="ml-2 text-3xl text-black cursor-pointer" onClick={openDropdown} />
                            <Dropdown
                                show={isDropdownOpen}
                                items={['Profile', 'Settings', 'Logout']}
                                onChange={handleChange}
                                passRef={dropdownRef}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
