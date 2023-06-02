/* eslint-disable  @typescript-eslint/no-explicit-any */

import { FieldValues, UseFormRegister } from 'react-hook-form';

type Props = {
    name: string;
    register?: UseFormRegister<FieldValues>;
    validation?: object;
    [props: string]: any;
};

export const Textarea = ({ name, register, validation = {}, ...props }: Props) => {
    let textareaFormProps;

    if (register) {
        textareaFormProps = { ...register(name, validation) };
    }

    return (
        <textarea
            className="w-full p-2 bg-light-gray rounded-lg outline-0 resize-none"
            {...textareaFormProps}
            {...props}
        ></textarea>
    );
};
