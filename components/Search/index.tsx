import classnames from 'classnames';

type Props = {
    isOpen: boolean;
};

const Search = ({ isOpen }: Props) => (
    <div
        className={classnames(
            'w-full bg-white px-2 rounded-lg absolute inset-0 top-16 md:p-2 md:border md:border-light-gray md:top-full md:inset-auto',
            { hidden: !isOpen }
        )}
    ></div>
);

export default Search;
