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
import { signIn } from '../lib/firebase';
import { emailZod, passwordZod } from '../lib/zod';

export const LogIn = () => {
    const [error, setError] = useState('');
    const router = useRouter();

    const schema = z.object({
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
        const { email, password } = data;

        try {
            await signIn(email, password);
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
                <Input type="email" placeholder="E-mail" {...register('email')} />
                {errors.email?.message && <InputError>{errors.email.message}</InputError>}
                <div className="mt-2">
                    <Input type="password" placeholder="Password" {...register('password')} />
                    {errors.password?.message && <InputError>{errors.password.message}</InputError>}
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
    );
};
