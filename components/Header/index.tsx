import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import { RiCamera2Line, RiCloseLine, RiSearchLine, RiHomeLine, RiAddBoxLine, RiUserLine } from 'react-icons/ri';

import Link from '../Link';
import useUser from '../../hooks/useUser';
import useDropdown from '../../hooks/useDropdown';
import useOnClickOutside from '../../hooks/useOnClickOutside';
import Input from '../Input';
import Search from '../Search';
import Dropdown from '../Dropdown';
import { search, signOut } from '../../functions';
import IUser from '../../types/User';

const Header = () => {
    const user = useUser();
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isDropdownOpen, openDropdown, closeDropdown] = useDropdown(dropdownRef);
    const [menuItems, setMenuItems] = useState(['Login']);
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<IUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useOnClickOutside(searchRef, () => {
        setIsSearchOpen(false);
    });

    function openSearch() {
        setIsSearchOpen(true);
    }

    function closeSearch() {
        setIsSearchOpen(false);
    }

    function inputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(e.target.value);
        openSearch();
    }

    async function handleChange(name: string) {
        switch (name) {
            case 'Login':
                router.push('/login');
                break;
            case 'Profile':
                router.push(`/user/${user?.uid}`);
                break;
            case 'Settings':
                router.push('/settings/edit-profile');
                break;
            case 'Logout':
                await signOut();
                router.push('/login');
        }

        closeDropdown();
    }

    useEffect(() => {
        if (user) {
            setMenuItems(['Profile', 'Settings', 'Logout']);
        }
    }, [user]);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        if (!searchValue.length) {
            setSearchResults([]);
        }

        if (isSearchOpen && searchValue.length > 0) {
            setIsLoading(true);
            setSearchResults([]);

            timeout = setTimeout(async () => {
                const results = await search(searchValue);
                setSearchResults(results);
                setIsLoading(false);
            }, 1000);
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [isSearchOpen, searchValue]);

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
                            <Input
                                name="search"
                                placeholder="Search"
                                spellCheck="false"
                                onClick={openSearch}
                                onChange={inputChange}
                            />
                        </div>
                        <RiCloseLine
                            className={classnames('ml-2 text-3xl text-black shrink-0 cursor-pointer md:hidden', {
                                hidden: !isSearchOpen,
                            })}
                            onClick={closeSearch}
                        />
                        <Search
                            isOpen={isSearchOpen && searchValue.length > 0}
                            isLoading={isLoading}
                            results={searchResults}
                            closeSearch={closeSearch}
                        />
                    </div>
                    <div className={classnames('w-44 flex justify-end', { 'hidden md:flex': isSearchOpen })}>
                        <RiSearchLine
                            className="mx-2 text-3xl text-black cursor-pointer md:hidden"
                            onClick={openSearch}
                        />
                        <Link href="/">
                            <RiHomeLine className="mx-2 text-3xl text-black cursor-pointer" />
                        </Link>
                        <Link href="/create-post">
                            <RiAddBoxLine className="mx-2 text-3xl text-black cursor-pointer" />
                        </Link>
                        <div className="md:relative">
                            <RiUserLine className="ml-2 text-3xl text-black cursor-pointer" onClick={openDropdown} />
                            <Dropdown
                                show={isDropdownOpen}
                                items={menuItems}
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
