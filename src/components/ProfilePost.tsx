import NextImage from 'next/future/image';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { RiChat3Fill, RiHeart3Fill } from 'react-icons/ri';
import { IPost } from '../types';

type Props = {
    post: IPost;
};

export const ProfilePost = ({ post }: Props) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!elementRef.current) {
            return;
        }

        const resizeObserver = new ResizeObserver(() => {
            if (elementRef.current?.style.height !== undefined) {
                elementRef.current.style.height = elementRef.current.offsetWidth + 'px';
            }
        });

        resizeObserver.observe(elementRef.current);

        return () => resizeObserver.disconnect();
    }, [elementRef]);

    const postClick = () => {
        router.push(`/post/${post.id}`);
    };

    return (
        <div className="relative group cursor-pointer" onClick={postClick} ref={elementRef}>
            <div className="bg-black/50 text-white rounded-lg items-center justify-center absolute inset-0 hidden group-hover:flex">
                <RiHeart3Fill className="text-3xl text-white" />
                <p className="ml-1">{post.stats.likes}</p>
                <RiChat3Fill className="ml-4 text-3xl text-white" />
                <p className="ml-1">{post.stats.comments}</p>
            </div>
            <NextImage
                className="h-full object-cover rounded-lg"
                src={post.photoUrl}
                width="640"
                height="640"
                alt="Post image."
            />
        </div>
    );
};
