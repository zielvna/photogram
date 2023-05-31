import type { GetServerSideProps, NextPage } from 'next';
import NextImage from 'next/future/image';
import nookies from 'nookies';

import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Settings from '../../components/Settings';
import SettingsField from '../../components/Settings/SettingsField';
import Input from '../../components/Input';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';
import { useForm } from 'react-hook-form';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { getUser, updateUserPhoto, updateUserProfile } from '../../functions';
import { auth } from '../../firebaseAdmin';
import IUser from '../../types/User';
import { FirebaseError } from 'firebase/app';
import InputError from '../../components/Input/InputError';
import { RiCamera2Line } from 'react-icons/ri';

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
    const [error, setError] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileError, setFileError] = useState('');

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

        if (!fileRef.current?.files?.[0]) {
            return setFileError('Photo is required.');
        }

        try {
            await updateUserProfile(username, bio);
            await updateUserPhoto(fileRef.current.files[0]);
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

        setFileError('');
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

        return '';
    };

    return (
        <>
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
                                    {preview || user?.photoUrl ? (
                                        <NextImage
                                            className="w-10 h-10 rounded-full object-cover"
                                            src={getProfilePhoto()}
                                            width="40"
                                            height="40"
                                            alt="User avatar."
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray"></div>
                                    )}
                                </div>
                                <p className="text-red-500 text-xs font-bold">{fileError}</p>
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
