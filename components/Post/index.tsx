import NextImage from 'next/future/image';
import classnames from 'classnames';

import IPost from '../../types/Post';
import IUser from '../../types/User';
import Card from '../Card';
import PostDescription from './PostDescription';
import PostComment from './PostComment';
import PostActions from './PostActions';
import Input from '../Input';
import Button from '../Button';

type Props = {
    post: IPost;
    author: IUser;
    scheme: 'normal' | 'preview';
};

const Post = ({ post, author, scheme = 'normal' }: Props) => (
    <Card>
        <div className={classnames({ 'md:flex': scheme === 'normal' })}>
            <div className={classnames({ 'md:hidden': scheme === 'normal' })}>
                <PostDescription user={author} content={post.description} timestamp={post.timestamp} />
            </div>
            <div className={classnames('mt-4', { 'md:mt-0': scheme === 'normal' })}>
                <NextImage className="rounded-lg" src={post.photoUrl} width="640" height="640" alt="Post image." />
            </div>
            {scheme === 'normal' && (
                <div className="mt-4 flex flex-col justify-between shrink-0 md:w-80 md:mt-0 md:pl-4">
                    <div className="hidden md:block">
                        <PostDescription user={author} content={post.description} timestamp={post.timestamp} />
                        <hr className="text-light-gray my-4" />
                    </div>
                    <div className="grow overflow-y-scroll max-h-80 md:h-0 md:max-h-max">
                        <PostComment />
                        <div className="mt-4">
                            <PostComment />
                        </div>
                    </div>
                    <hr className="text-light-gray my-4" />
                    <PostActions />
                    <hr className="text-light-gray my-4" />
                    <div className="flex items-center">
                        <Input name="comment" placeholder="Add a comment..." />
                        <div className="ml-2">
                            <Button scheme="small">Post</Button>
                        </div>
                    </div>
                </div>
            )}
            {scheme === 'preview' && (
                <div className="mt-4">
                    <PostActions />
                </div>
            )}
        </div>
    </Card>
);

export default Post;
