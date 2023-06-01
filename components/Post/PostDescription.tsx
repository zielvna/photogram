import moment from 'moment';
import NextImage from 'next/image';
import IUser from '../../types/User';
import Link from '../Link';

type Props = {
    user: IUser;
    content: string;
    timestamp: number;
};

const PostDescription = ({ user, content, timestamp }: Props) => (
    <div className="flex">
        <div className="shrink-0">
            <NextImage
                className="w-10 h-10 rounded-full object-cover"
                src={user.photoUrl ? user.photoUrl : '/40.png'}
                width="40"
                height="40"
                alt="User avatar."
            />
        </div>
        <div className="ml-2 flex flex-col">
            <p>
                <Link className="font-bold" href={`/user/${user.id}`}>
                    {user.username}
                </Link>
                <span> {content}</span>
            </p>
            <p className="mt-1 text-xs text-gray">
                <span title={moment(new Date(timestamp)).format()}>{moment(new Date(timestamp)).fromNow()}</span>
            </p>
        </div>
    </div>
);

export default PostDescription;
