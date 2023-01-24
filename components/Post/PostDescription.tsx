import NextImage from 'next/image';
import moment from 'moment';

import Link from '../Link';
import IUser from '../../types/User';

type Props = {
    user: IUser;
    content: string;
    timestamp: string;
};

const PostDescription = ({ user, content, timestamp }: Props) => (
    <div className="flex">
        <div className="shrink-0">
            <NextImage className="w-10 h-10 rounded-full" src="/40.png" width="40" height="40" alt="User avatar." />
        </div>
        <div className="ml-2 flex flex-col">
            <p>
                <Link className="font-bold" href={`/user/${user.id}`}>
                    {user.username}
                </Link>
                <span> {content}</span>
            </p>
            <p className="mt-1 text-xs text-gray">
                <span>{moment(new Date(timestamp)).fromNow()}</span>
            </p>
        </div>
    </div>
);

export default PostDescription;
