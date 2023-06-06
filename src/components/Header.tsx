import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import {
    RiAddBoxLine,
    RiCamera2Line,
    RiCloseLine,
    RiHeart3Line,
    RiHomeLine,
    RiSearchLine,
    RiUserLine,
} from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';
import { useUserContext } from '../contexts/userContext';
import { useDropdown } from '../hooks/useDropdown';
import { useSearch } from '../hooks/useSearch';
import { signOut } from '../lib/firebase';
import { Dropdown } from './Dropdown';
import { Search } from './Search';

export const Header = () => {
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useUserContext();
    const router = useRouter();
    const [isDropdownOpen, openDropdown, closeDropdown] = useDropdown(dropdownRef);
    const [openSearch, closeSearch, inputChange, searchResults, isSearchOpen, isLoading] = useSearch(
        searchRef,
        inputRef
    );

    let menuItems = ['Login', 'Signup'];

    if (user) {
        menuItems = ['Profile', 'Settings', 'Logout'];
    }

    const handleChange = async (name: string) => {
        switch (name) {
            case 'Login':
                router.push('/login');
                break;
            case 'Signup':
                router.push('/signup');
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
    };

    return (
        <header className="relative z-10">
            <div className={twMerge('h-16 flex justify-center bg-white', isSearchOpen && 'fixed inset-0 md:static')}>
                <div className="w-full max-w-5xl px-4 flex items-center justify-between">
                    <div className={twMerge('w-44', isSearchOpen && 'hidden md:block')}>
                        <Link href="/">
                            <RiCamera2Line className="text-3xl text-black cursor-pointer" />
                        </Link>
                    </div>
                    <div
                        className={twMerge('flex items-center md:w-80 md:relative z-10', isSearchOpen && 'w-full')}
                        ref={searchRef}
                    >
                        <div className={twMerge('w-full md:block', !isSearchOpen && 'hidden')}>
                            <input
                                className="w-full p-2 bg-light-gray rounded-lg outline-0"
                                name="search"
                                type="text"
                                placeholder="Search"
                                autoComplete="off"
                                onClick={openSearch}
                                onChange={inputChange}
                            />
                        </div>
                        <RiCloseLine
                            className={twMerge(
                                'ml-2 text-3xl text-black shrink-0 cursor-pointer md:hidden',
                                !isSearchOpen && 'hidden'
                            )}
                            onClick={closeSearch}
                        />
                        <Search
                            isOpen={isSearchOpen}
                            isLoading={isLoading}
                            results={searchResults}
                            closeSearch={closeSearch}
                        />
                    </div>
                    <div className={twMerge('w-44 flex justify-end', isSearchOpen && 'hidden md:flex')}>
                        <span>
                            <RiSearchLine
                                className="mx-2 text-3xl text-black cursor-pointer md:hidden"
                                onClick={openSearch}
                            />
                        </span>
                        <Link href="/">
                            <RiHomeLine className="mx-2 text-3xl text-black cursor-pointer" />
                        </Link>
                        <Link href={user ? '/following' : '/login'}>
                            <RiHeart3Line className="mx-2 text-3xl text-black cursor-pointer" />
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
                                ref={dropdownRef}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
