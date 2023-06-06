import { useState } from 'react';
import { UserContextValue } from '../contexts/userContext';
import { getFollowingPagePosts, getHomePagePosts, getPost } from '../lib/firebase';
import { IPost } from '../types';
import { useOnScrollDown } from './useOnScrollDown';

export const usePostLoading = (posts: IPost[], user: UserContextValue['user'], isHomePage: boolean) => {
    const [postsList, setPostsList] = useState(posts);
    const [isLoading, setIsLoading] = useState(true);

    useOnScrollDown(async () => {
        let postIds;

        if (isHomePage) {
            postIds = await getHomePagePosts(3, postsList[postsList.length - 1].timestamp);
        } else {
            postIds = await getFollowingPagePosts(user?.uid ?? null, 3, postsList[postsList.length - 1].timestamp);
        }

        const newPosts: IPost[] = [];

        for (let i = 0; i < postIds.length; i++) {
            const post = await getPost(user?.uid ?? null, postIds[i], true, false, true);
            newPosts.push(post);
        }

        setPostsList([...postsList, ...newPosts]);

        if (postIds.length < 3) {
            setIsLoading(false);
        }
    });

    return [postsList, isLoading] as const;
};
