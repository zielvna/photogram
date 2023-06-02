import { FirebaseError } from 'firebase/app';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { InputError } from '../components/InputError';
import { Settings } from '../components/Settings';
import { SettingsField } from '../components/SettingsField';
import { changePassword, signOut } from '../lib/firebase';

export const ChangePassword = () => {
    const [error, setError] = useState('');
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

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
    );
};
