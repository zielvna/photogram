import NextImage from 'next/image';
import moment from 'moment';

import Link from '../Link';
import IUser from '../../types/User';
import { deleteComment } from '../../functions';

type Props = {
    id: string;
    user: IUser;
    content: string;
    timestamp: string;
    addRemoveButton: boolean;
    commentRemoved: () => Promise<void>;
};

const PostComment = ({ id, user, content, timestamp, addRemoveButton, commentRemoved }: Props) => {
    const removeComment = async () => {
        await deleteComment(id);
        commentRemoved();
    };

    return (
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
                    <span>{moment(new Date(timestamp)).fromNow()} </span>
                    {addRemoveButton && (
                        <>
                            •{' '}
                            <span className="cursor-pointer hover:underline" onClick={removeComment}>
                                Remove
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default PostComment;
