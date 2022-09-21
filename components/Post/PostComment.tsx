import NextImage from 'next/image';

import Link from '../Link';

const PostComment = () => (
    <div className="flex">
        <div className="shrink-0">
            <NextImage className="w-10 h-10 rounded-full" src="/40.png" width="40" height="40" alt="User avatar." />
        </div>
        <div className="ml-2 flex flex-col">
            <p>
                <Link className="font-bold" href="/user/user">
                    user
                </Link>
                <span> comment</span>
            </p>
            <p className="mt-1 text-xs text-gray">
                <span>0 seconds ago</span> · <span className="cursor-pointer hover:underline">Remove</span>
            </p>
        </div>
    </div>
);

export default PostComment;
