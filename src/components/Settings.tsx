import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRef } from 'react';
import { RiMoreLine } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';
import { useDropdown } from '../hooks/useDropdown';
import { Card } from './Card';
import { Dropdown } from './Dropdown';

type Props = {
    name: string;
    children: React.ReactNode;
};

export const Settings = ({ name, children }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [isDropdownOpen, openDropdown, closeDropdown] = useDropdown(ref);

    const tabs = [
        { id: 'edit-profile', name: 'Edit profile' },
        { id: 'change-password', name: 'Change password' },
    ];

    function handleChange(name: string) {
        switch (name) {
            case 'Edit profile':
                router.push('edit-profile');
                break;
            case 'Change password':
                router.push('change-password');
                break;
        }

        closeDropdown();
    }

    return (
        <Card>
            <div className="h-fit sm:h-80 sm:flex">
                <div className="hidden sm:block sm:pr-4 sm:border-r sm:border-light-gray">
                    {tabs.map((tab) => (
                        <Link
                            className={twMerge('w-32 block cursor-pointer sm:py-3', tab.name === name && 'font-bold')}
                            href={tab.id}
                            key={tab.id}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </div>
                <div className="sm:hidden">
                    <div className="flex items-center justify-between">
                        <p className="font-bold">{name}</p>
                        <div className="sm:relative">
                            <RiMoreLine className="ml-4 text-3xl text-black cursor-pointer" onClick={openDropdown} />
                            <Dropdown
                                show={isDropdownOpen}
                                items={['Edit profile', 'Change password']}
                                onChange={handleChange}
                                ref={ref}
                            />
                        </div>
                    </div>
                    <hr className="text-light-gray my-4" />
                </div>
                <div className="w-full">{children}</div>
            </div>
        </Card>
    );
};
