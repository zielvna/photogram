import type { NextPage } from 'next';
import NextImage from 'next/future/image';
import { RiCloseLine } from 'react-icons/ri';

import Header from '../components/Header';
import Wrapper from '../components/Wrapper';
import Card from '../components/Card';
import Button from '../components/Button';
import Textarea from '../components/Textarea';

const NewPostPage: NextPage = () => {
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
                            <div>
                                <NextImage
                                    className="rounded-lg"
                                    src="/640.png"
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
