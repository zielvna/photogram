/* eslint-disable  @typescript-eslint/no-explicit-any */

import { UseFormRegister, FieldValues } from 'react-hook-form';

type Props = {
    name: string;
    register: UseFormRegister<FieldValues>;
    validation?: object;
    [props: string]: any;
};

const Input = ({ name, register, validation = {}, ...props }: Props) => (
    <input className="w-full p-2 bg-light-gray rounded-lg outline-0" {...register(name, validation)} {...props} />
);

export default Input;
