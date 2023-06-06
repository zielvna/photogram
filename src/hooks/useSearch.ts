import { ChangeEvent, RefObject, useEffect, useState } from 'react';
import { search } from '../lib/firebase';
import { IUser } from '../types';
import { useOnClickOutside } from './useOnClickOutside';

export const useSearch = (searchRef: RefObject<HTMLDivElement>, inputRef: RefObject<HTMLInputElement>) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState<IUser[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const openSearch = () => {
        setIsSearchOpen(true);
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
    };

    const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const target = event.target as HTMLInputElement;
        setSearchValue(target.value);
        openSearch();
    };

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

    useOnClickOutside(searchRef, () => {
        setIsSearchOpen(false);
    });

    return [openSearch, closeSearch, inputChange, searchResults, isSearchOpen, isLoading] as const;
};
