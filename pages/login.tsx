import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { RiCamera2Line } from 'react-icons/ri';
import { useForm } from 'react-hook-form';
import { FirebaseError } from 'firebase/app';
import nookies from 'nookies';

import { signIn } from '../functions';
import Wrapper from '../components/Wrapper';
import Card from '../components/Card';
import Input from '../components/Input';
import InputError from '../components/Input/InputError';
import Button from '../components/Button';
import Link from '../components/Link';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const cookies = nookies.get(context);

    if (cookies.token) {
        context.res.setHeader('location', '/');
        context.res.statusCode = 302;
    }

    return { props: {} };
};

const LogIn: NextPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();
    const [error, setError] = useState('');

    const registerOptions = {
        email: {
            required: 'E-mail is required.',
            pattern: {
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'E-mail is invalid.',
            },
        },
        password: {
            required: 'Password is required.',
            minLength: {
                value: 6,
                message: 'Password is too short.',
            },
        },
    };

    const onSubmit = handleSubmit(async (data) => {
        const { email, password } = data;

        try {
            await signIn(email, password);
            router.push('/');
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
            }
        }
    });

    return (
        <Wrapper>
            <div className="w-full max-w-xs mt-20">
                <Card>
                    <div className="flex justify-center">
                        <RiCamera2Line className="text-3xl text-black" />
                    </div>
                    <hr className="text-light-gray my-4" />
                    <form onSubmit={onSubmit}>
                        <Input
                            name="email"
                            register={register}
                            validation={registerOptions.email}
                            type="email"
                            placeholder="E-mail"
                            spellCheck="false"
                        />
                        {errors.email && errors.email.message && (
                            <InputError>{errors.email.message.toString()}</InputError>
                        )}
                        <div className="mt-2">
                            <Input
                                name="password"
                                register={register}
                                validation={registerOptions.password}
                                type="password"
                                placeholder="Password"
                            />
                            {errors.password && errors.password.message && (
                                <InputError>{errors.password.message.toString()}</InputError>
                            )}
                        </div>
                        <div className="w-full mt-4">
                            <Button>Log in</Button>
                        </div>
                        <p className="text-red-500 text-xs font-bold text-center">{error}</p>
                    </form>
                    <hr className="text-light-gray my-4" />
                    <div className="flex justify-center">
                        <p>
                            Don&apos;t have an account?{' '}
                            <Link className="text-blue font-bold" href="/signup">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </Wrapper>
    );
};

export default LogIn;
