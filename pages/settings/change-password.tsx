import type { GetServerSideProps, NextPage } from 'next';
import nookies from 'nookies';

import Header from '../../components/Header';
import Wrapper from '../../components/Wrapper';
import Settings from '../../components/Settings';
import SettingsField from '../../components/Settings/SettingsField';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import InputError from '../../components/Input/InputError';
import { changePassword, signOut } from '../../functions';
import { FirebaseError } from 'firebase/app';
import Progress from '../../components/Progress';
import { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = nookies.get(context);

    if (!cookies.token) {
        context.res.setHeader('location', '/login');
        context.res.statusCode = 302;
    }

    return { props: {} };
};

const ChangePasswordPage: NextPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const router = useRouter();
    const [error, setError] = useState('');

    const registerOptions = {
        newPassword: {
            required: 'New password is required.',
            minLength: {
                value: 6,
                message: 'New password is too short.',
            },
        },
    };

    const onSubmit = handleSubmit(async (data) => {
        const { newPassword } = data;

        try {
            await changePassword(newPassword);
            await signOut();
            router.push('/login');
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
                <div className="w-full max-w-2xl mt-4">
                    <Settings name="Change password">
                        <form onSubmit={onSubmit}>
                            <SettingsField name="New password">
                                <Input
                                    name="newPassword"
                                    register={register}
                                    validation={registerOptions.newPassword}
                                    type="password"
                                    spellCheck="false"
                                />
                            </SettingsField>
                            {errors.newPassword && errors.newPassword.message && (
                                <div className="sm:ml-36">
                                    <InputError>{errors.newPassword.message.toString()}</InputError>
                                </div>
                            )}
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

export default ChangePasswordPage;
