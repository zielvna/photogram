import NextImage from 'next/image';
import Link from 'next/link';
import { RiLoader2Line } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';
import { IUser } from '../types';

type Props = {
    isOpen: boolean;
    results: IUser[];
    isLoading: boolean;
    closeSearch: () => void;
};

export const Search = ({ isOpen, results, isLoading, closeSearch }: Props) => (
    <div
        className={twMerge(
            'bg-white fixed inset-0 top-16 pl-4 md:w-full md:absolute md:inset-auto md:top-full md:border md:border-light-gray md:rounded-lg md:p-2',
            !isOpen && 'hidden'
        )}
    >
        {!results.length && !isLoading && <div className="flex justify-center">User not found.</div>}
        {results.map((result) => (
            <Link href={`/user/${result.id}`} key={result.id}>
                <div className="flex items-center cursor-pointer mt-2" onClick={closeSearch}>
                    <NextImage
                        className="rounded-full object-cover"
                        src={result.photoUrl ? result.photoUrl : '/empty.png'}
                        width="40"
                        height="40"
                        alt="User avatar."
                    />
                    <span className="ml-2 font-bold">{result.username}</span>
                </div>
            </Link>
        ))}
        {isLoading && (
            <div className="flex justify-center">
                <RiLoader2Line className="text-gray text-2xl animate-spin" />
            </div>
        )}
    </div>
);
