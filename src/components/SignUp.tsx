import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiCamera2Line } from 'react-icons/ri';
import * as z from 'zod';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { InputError } from '../components/InputError';
import { signUp } from '../lib/firebase';
import { emailZod, passwordZod, usernameZod } from '../lib/zod';

export const SignUp = () => {
    const [error, setError] = useState('');
    const router = useRouter();

    const schema = z.object({
        username: usernameZod,
        email: emailZod,
        password: passwordZod,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.TypeOf<typeof schema>>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit(async (data) => {
        const { username, email, password } = data;

        try {
            await signUp(username, email, password);
        } catch (error) {
            if (error instanceof FirebaseError) {
                setError(error.message);
            }
        }
    });

    return (
        <Card>
            <div className="flex justify-center">
                <RiCamera2Line className="text-3xl text-black" />
            </div>
            <hr className="text-light-gray my-4" />
            <form onSubmit={onSubmit}>
                <Input type="text" placeholder="Username" {...register('username')} />
                {errors.username?.message && <InputError>{errors.username.message}</InputError>}
                <div className="mt-2">
                    <Input type="email" placeholder="E-mail" {...register('email')} />
                    {errors.email?.message && <InputError>{errors.email.message}</InputError>}
                </div>
                <div className="mt-2">
                    <Input type="password" placeholder="Password" {...register('password')} />
                    {errors.password?.message && <InputError>{errors.password.message}</InputError>}
                </div>
                <div className="mt-4">
                    <Button>Sign up</Button>
                </div>
                <p className="text-red-500 text-xs font-bold text-center">{error}</p>
            </form>
            <hr className="text-light-gray my-4" />
            <div className="flex justify-center">
                <p>
                    Have an account?{' '}
                    <Link className="text-blue font-bold" href="/login">
                        Log in
                    </Link>
                </p>
            </div>
        </Card>
    );
};
