import classnames from 'classnames';
import NextImage from 'next/image';
import IUser from '../../types/User';
import Link from 'next/link';

type Props = {
    isOpen: boolean;
    results: IUser[];
    closeSearch: () => void;
};

const Search = ({ isOpen, results, closeSearch }: Props) => (
    <div
        className={classnames(
            'w-full bg-white px-2 rounded-lg fixed inset-0 top-16 md:p-2 md:border md:border-light-gray md:absolute md:top-full md:inset-auto',
            { hidden: !isOpen }
        )}
    >
        {results.map((result) => (
            <Link href={`/user/${result.id}`} key={result.id}>
                <div className="flex items-center cursor-pointer mt-2" onClick={closeSearch}>
                    <NextImage
                        className="rounded-full object-cover"
                        src={result.photoUrl ? result.photoUrl : '/40.png'}
                        width="40"
                        height="40"
                        alt="User avatar."
                    />
                    <span className="ml-2 font-bold">{result.username}</span>
                </div>
            </Link>
        ))}
    </div>
);

export default Search;
