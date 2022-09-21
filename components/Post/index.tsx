import NextImage from 'next/future/image';
import classnames from 'classnames';

import Card from '../Card';
import PostComment from './PostComment';
import PostActions from './PostActions';
import Input from '../Input';
import Button from '../Button';

type Props = {
    scheme: 'normal' | 'preview';
};

const Post = ({ scheme = 'normal' }: Props) => (
    <div className={classnames('max-w-2xl', { 'md:max-w-5xl': scheme === 'normal' })}>
        <Card>
            <div className={classnames({ 'md:flex': scheme === 'normal' })}>
                <div className={classnames({ 'md:hidden': scheme === 'normal' })}>
                    <PostComment />
                </div>
                <div className={classnames('mt-4', { 'md:mt-0': scheme === 'normal' })}>
                    <NextImage className="rounded-lg" src="/640.png" width="640" height="640" alt="Post image." />
                </div>
                {scheme === 'normal' && (
                    <div className="mt-4 flex flex-col justify-between shrink-0 md:w-80 md:mt-0 md:pl-4">
                        <div className="hidden md:block">
                            <PostComment />
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
                            <Input placeholder="Add a comment..." />
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
    </div>
);

export default Post;
