import { useRef } from 'react';
import { useRouter } from 'next/router';
import classnames from 'classnames';
import { RiMoreLine } from 'react-icons/ri';

import useDropdown from '../../hooks/useDropdown';
import Card from '../Card';
import Link from '../Link';
import Dropdown from '../Dropdown';

type Props = {
    name: string;
    children: React.ReactNode;
};

const Settings = ({ name, children }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDropdownOpen, openDropdown, closeDropdown] = useDropdown(ref);
    const router = useRouter();

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
                            className={classnames('w-32 block cursor-pointer sm:py-3', {
                                'font-bold': tab.name === name,
                            })}
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
                                passRef={ref}
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

export default Settings;
