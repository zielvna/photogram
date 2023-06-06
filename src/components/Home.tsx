import { RiLoader2Line } from 'react-icons/ri';
import { Post } from '../components/Post';
import { useUserContext } from '../contexts/userContext';
import { usePostLoading } from '../hooks/usePostLoading';
import { IPost } from '../types';

type Props = {
    posts: IPost[];
};

export const Home = ({ posts }: Props) => {
    const { user } = useUserContext();
    const [postsList, isLoading] = usePostLoading(posts, user, true);

    return (
        <>
            {postsList.map((post) => (
                <div key={post.id} className="mt-4">
                    <Post post={post} scheme="preview" />
                </div>
            ))}
            <div className="my-4 flex justify-center">
                {isLoading ? <RiLoader2Line className="text-gray text-3xl animate-spin" /> : 'No more posts.'}
            </div>
        </>
    );
};
