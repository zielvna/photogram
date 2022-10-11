/* eslint-disable  @typescript-eslint/no-explicit-any */

import { UseFormRegister, FieldValues } from 'react-hook-form';

type Props = {
    name: string;
    register?: UseFormRegister<FieldValues>;
    validation?: object;
    [props: string]: any;
};

const Input = ({ name, register, validation = {}, ...props }: Props) => {
    let inputFormProps;

    if (register) {
        inputFormProps = { ...register(name, validation) };
    }

    return <input className="w-full p-2 bg-light-gray rounded-lg outline-0" {...inputFormProps} {...props} />;
};

export default Input;
