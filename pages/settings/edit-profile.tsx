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

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = nookies.get(context);

    if (!cookies.token) {
        context.res.setHeader('location', '/login');
        context.res.statusCode = 302;
    }

    return { props: {} };
};

const EditProfilePage: NextPage = () => {
    return (
        <>
            <Header />
            <Wrapper>
                <div className="w-full max-w-2xl mt-4">
                    <Settings name="Edit profile">
                        <SettingsField name="Profile photo">
                            <NextImage
                                className="rounded-full"
                                src="/40.png"
                                width="40"
                                height="40"
                                alt="User avatar."
                            />
                        </SettingsField>
                        <div className="mt-4">
                            <SettingsField name="Username">
                                <Input type="text" name="username" spellCheck="false" />
                            </SettingsField>
                        </div>
                        <div className="mt-4">
                            <SettingsField name="Bio">
                                <Textarea name="bio" rows="5" spellCheck="false" />
                                <p className="text-xs text-gray">0/300</p>
                            </SettingsField>
                        </div>
                        <div className="w-32 mt-4 sm:ml-36">
                            <Button>Submit</Button>
                        </div>
                    </Settings>
                </div>
            </Wrapper>
        </>
    );
};

export default EditProfilePage;
