import type { NextPage } from 'next';
import { useEffect, useRef, useState, FormEvent } from 'react';
import NextImage from 'next/future/image';
import { RiCloseLine, RiCamera2Line } from 'react-icons/ri';

import Header from '../components/Header';
import Wrapper from '../components/Wrapper';
import Card from '../components/Card';
import Button from '../components/Button';
import Textarea from '../components/Textarea';

const NewPostPage: NextPage = () => {
    const fileRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

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

    return (
        <>
            <Header />
            <Wrapper>
                <div className="mt-4">
                    <Card>
                        <div className="flex items-center justify-between">
                            <RiCloseLine className="text-3xl text-black cursor-pointer" />
                            <p className="font-bold">Create a new post</p>
                            <Button scheme="small">Share</Button>
                        </div>
                        <hr className="text-light-gray my-4" />
                        <div className="flex flex-col md:flex-row">
                            <div className="relative group cursor-pointer">
                                <div
                                    className="bg-black/50 text-white rounded-lg flex-col items-center justify-center absolute inset-0 hidden group-hover:flex"
                                    onClick={openFile}
                                >
                                    <input className="hidden" type="file" ref={fileRef} onChange={onSelectFile} />
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
                            <div className="w-full mt-4 shrink-0 md:w-80 md:mt-0 md:pl-4">
                                <Textarea name="comment" rows="5" placeholder="Comment" spellCheck="false" />
                                <p className="text-xs text-gray">0/300</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </Wrapper>
        </>
    );
};

export default NewPostPage;
