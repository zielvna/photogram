import { RefObject, useState } from 'react';
import { useOnClickOutside } from './useOnClickOutside';

export const useDropdown = (ref: RefObject<HTMLElement>) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    function openDropdown() {
        setIsDropdownOpen(true);
    }

    function closeDropdown() {
        setIsDropdownOpen(false);
    }

    useOnClickOutside(ref, () => {
        closeDropdown();
    });

    return [isDropdownOpen, openDropdown, closeDropdown] as const;
};
