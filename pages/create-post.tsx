import { FirebaseError } from 'firebase/app';
import type { GetServerSideProps, NextPage } from 'next';
import NextImage from 'next/future/image';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiCamera2Line, RiCloseLine } from 'react-icons/ri';
import Button from '../components/Button';
import Card from '../components/Card';
import Header from '../components/Header';
import InputError from '../components/Input/InputError';
import Progress from '../components/Progress';
import Textarea from '../components/Textarea';
import Wrapper from '../components/Wrapper';
import useUser from '../hooks/useUser';
import { createPost } from '../lib/firebase';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = nookies.get(context);

    if (!cookies.token) {
        context.res.setHeader('location', '/login');
        context.res.statusCode = 302;
    }

    return { props: {} };
};

const CreatePostPage: NextPage = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [fileError, setFileError] = useState('');
    const router = useRouter();
    const user = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const registerOptions = {
        description: {
            maxLength: {
                value: 200,
                message: 'Description is too long.',
            },
        },
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

    useEffect(() => {
        if (user === null) {
            router.push('/login');
        }
    }, [user]);

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

    const onSubmit = handleSubmit(async (data) => {
        const { description } = data;

        if (!fileRef.current?.files?.[0]) {
            return setFileError('Photo is required.');
        }

        try {
            const postId = await createPost(fileRef.current.files[0], description);

            router.push(`/post/${postId}`);
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
            }
        }
    });

    return (
        <>
            <Progress />
            <Header />
            <Wrapper>
                <div className="mt-4">
                    <Card>
                        <div className="flex items-center justify-between">
                            <RiCloseLine className="text-3xl text-black cursor-pointer" />
                            <p className="font-bold">Create a new post</p>
                            <Button scheme="small" onClick={onSubmit}>
                                Share
                            </Button>
                        </div>
                        <hr className="text-light-gray my-4" />
                        <div className="flex flex-col md:flex-row">
                            <div>
                                <div className="relative group cursor-pointer">
                                    <div
                                        className="bg-black/50 text-white rounded-lg flex-col items-center justify-center absolute inset-0 hidden group-hover:flex"
                                        onClick={openFile}
                                    >
                                        <input type="file" ref={fileRef} className="hidden" onChange={onSelectFile} />
                                        <RiCamera2Line className="text-3xl" />
                                        Add photos to create a new post
                                    </div>
                                    <NextImage
                                        className="rounded-lg"
                                        src={preview ? preview : '/640.png'}
                                        width="640"
                                        height="640"
                                        alt="Post image."
                                    />
                                </div>
                                <p className="text-red-500 text-xs font-bold">{fileError}</p>
                            </div>
                            <div className="w-full mt-4 shrink-0 md:w-80 md:mt-0 md:pl-4">
                                <Textarea
                                    name="description"
                                    register={register}
                                    validation={registerOptions.description}
                                    rows="5"
                                    placeholder="Description (max 200 characters)"
                                    spellCheck="false"
                                />
                                {errors.description && errors.description.message && (
                                    <InputError>{errors.description.message.toString()}</InputError>
                                )}
                                <p className="text-red-500 text-xs font-bold text-center">{error}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </Wrapper>
        </>
    );
};

export default CreatePostPage;
