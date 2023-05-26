import NextImage from 'next/future/image';
import { useRouter } from 'next/router';
import { RiArrowRightLine } from 'react-icons/ri';

type Props = {
    id: string;
    photoUrl: string;
};

const ProfilePost = ({ id, photoUrl }: Props) => {
    const router = useRouter();

    const postClick = () => {
        router.push(`/post/${id}`);
    };

    return (
        <div className="relative group cursor-pointer" onClick={postClick}>
            <div className="bg-black/50 text-white rounded-lg absolute inset-0 hidden justify-center flex-col items-center group-hover:flex">
                <RiArrowRightLine className="text-3xl" />
                View
            </div>
            <NextImage
                className="h-full object-cover rounded-lg"
                src={photoUrl}
                width="640"
                height="640"
                alt="Post image."
            />
        </div>
    );
};

export default ProfilePost;
