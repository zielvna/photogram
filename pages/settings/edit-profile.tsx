import { FirebaseError } from 'firebase/app';
import type { GetServerSideProps, NextPage } from 'next';
import NextImage from 'next/future/image';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiCamera2Line } from 'react-icons/ri';
import Button from '../../components/Button';
import Header from '../../components/Header';
import Input from '../../components/Input';
import InputError from '../../components/Input/InputError';
import Progress from '../../components/Progress';
import Settings from '../../components/Settings';
import SettingsField from '../../components/Settings/SettingsField';
import Textarea from '../../components/Textarea';
import Wrapper from '../../components/Wrapper';
import { auth } from '../../firebaseAdmin';
import { getUser, updateUserPhoto, updateUserProfile } from '../../lib/firebase';
import IUser from '../../types/User';

type Props = {
    user: IUser | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const cookies = nookies.get(context);

    if (!cookies.token) {
        context.res.setHeader('location', '/login');
        context.res.statusCode = 302;
    }

    let loggedUserId = null;

    if (cookies.token) {
        try {
            loggedUserId = (await auth.verifyIdToken(cookies.token)).uid;
        } catch (error) {
            loggedUserId = null;
        }
    }

    let user = null;

    if (loggedUserId) {
        user = await getUser(loggedUserId, loggedUserId, true, true);
    }

    return {
        props: {
            user: user,
        },
    };
};

const EditProfilePage: NextPage<Props> = ({ user }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm();
    const router = useRouter();
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const registerOptions = {
        username: { required: 'Username is required.' },
        bio: {
            maxLength: {
                value: 300,
                message: 'Bio is too long.',
            },
        },
    };

    const onSubmit = handleSubmit(async (data) => {
        const { username, bio } = data;

        try {
            await updateUserProfile(username, bio);

            if (fileRef.current?.files?.[0]) {
                await updateUserPhoto(fileRef.current.files[0]);
            }

            router.push(`/user/${user?.id}`);
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
            }
        }
    });

    useEffect(() => {
        setValue('username', user?.username);
        setValue('bio', user?.bio);
    }, []);

    const onSelectFile = (e: FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;

        if (target.files) {
            setSelectedFile(target.files[0]);
        }
    };

    const openFile = () => {
        if (fileRef.current) {
            fileRef.current.click();
        }
    };

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }

        const fileUrl = URL.createObjectURL(selectedFile);
        setPreview(fileUrl);

        return () => URL.revokeObjectURL(fileUrl);
    }, [selectedFile]);

    const getProfilePhoto = () => {
        if (preview) {
            return preview;
        }

        if (user?.photoUrl) {
            return user.photoUrl;
        }

        return '/40.png';
    };

    return (
        <>
            <Progress />
            <Header />
            <Wrapper>
                <div className="w-full max-w-2xl mt-4">
                    <Settings name="Edit profile">
                        <form onSubmit={onSubmit}>
                            <SettingsField name="Profile photo">
                                <div className="relative group cursor-pointer">
                                    <div
                                        className="w-10 bg-black/50 text-white rounded-full flex-col items-center justify-center absolute inset-0 hidden group-hover:flex"
                                        onClick={openFile}
                                    >
                                        <input type="file" ref={fileRef} className="hidden" onChange={onSelectFile} />
                                        <RiCamera2Line className="text-xl" />
                                    </div>
                                    <NextImage
                                        className="w-10 h-10 rounded-full object-cover"
                                        src={getProfilePhoto()}
                                        width="40"
                                        height="40"
                                        alt="User avatar."
                                    />
                                </div>
                            </SettingsField>
                            <div className="mt-4">
                                <SettingsField name="Username">
                                    <Input
                                        name="username"
                                        register={register}
                                        validation={registerOptions.username}
                                        type="text"
                                        spellCheck="false"
                                    />
                                </SettingsField>
                                {errors.username && errors.username.message && (
                                    <div className="sm:ml-36">
                                        <InputError>{errors.username.message.toString()}</InputError>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4">
                                <SettingsField name="Bio">
                                    <Textarea
                                        name="bio"
                                        register={register}
                                        validation={registerOptions.bio}
                                        rows="5"
                                        spellCheck="false"
                                    />
                                </SettingsField>
                                {errors.bio && errors.bio.message && (
                                    <div className="sm:ml-36">
                                        <InputError>{errors.bio.message.toString()}</InputError>
                                    </div>
                                )}
                            </div>
                            <div className="w-32 mt-4 sm:ml-36">
                                <Button>Submit</Button>
                            </div>
                            <p className="text-red-500 text-xs font-bold text-center">{error}</p>
                        </form>
                    </Settings>
                </div>
            </Wrapper>
        </>
    );
};

export default EditProfilePage;
