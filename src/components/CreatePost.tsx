import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiCamera2Line, RiCloseLine } from 'react-icons/ri';
import * as z from 'zod';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { InputError } from '../components/InputError';
import { useFile } from '../hooks/useFile';
import { createPost } from '../lib/firebase';
import { descriptionZod } from '../lib/zod';
import { Textarea } from './Textarea';

export const CreatePost = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState('');
    const [fileError, setFileError] = useState('');
    const router = useRouter();
    const [preview, selectedFile, openFile] = useFile(fileRef);

    const schema = z.object({
        description: descriptionZod,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.TypeOf<typeof schema>>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit(async (data) => {
        const { description } = data;

        if (!selectedFile) {
            return setFileError('Photo is required.');
        }

        try {
            const postId = await createPost(selectedFile, description.trim());

            router.push(`/post/${postId}`);
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
            }
        }
    });

    return (
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
                            <input className="hidden" type="file" ref={fileRef} />
                            <RiCamera2Line className="text-3xl" />
                            Add photos to create a new post
                        </div>
                        <NextImage
                            className="rounded-lg"
                            src={preview ? preview : '/empty.png'}
                            width="640"
                            height="640"
                            alt="Post image."
                        />
                    </div>
                    <p className="text-red-500 text-xs font-bold">{fileError}</p>
                </div>
                <div className="w-full mt-4 shrink-0 md:w-80 md:mt-0 md:pl-4">
                    <Textarea rows={5} placeholder="Description" {...register('description')} />
                    {errors.description?.message && <InputError>{errors.description.message}</InputError>}
                    <p className="text-red-500 text-xs font-bold text-center">{error}</p>
                </div>
            </div>
        </Card>
    );
};
