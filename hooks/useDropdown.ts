import { useState, RefObject } from 'react';

import useOnClickOutside from './useOnClickOutside';

const useDropdown = (ref: RefObject<HTMLElement>): [boolean, () => void, () => void] => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    function openDropdown(): void {
        setIsDropdownOpen(true);
    }

    function closeDropdown(): void {
        setIsDropdownOpen(false);
    }

    useOnClickOutside(ref, () => {
        closeDropdown();
    });

    return [isDropdownOpen, openDropdown, closeDropdown];
};

export default useDropdown;
