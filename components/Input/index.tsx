/* eslint-disable  @typescript-eslint/no-explicit-any */

type Props = {
    [props: string]: any;
};

const Input = ({ ...props }: Props) => <input className="w-full p-2 bg-light-gray rounded-lg outline-0" {...props} />;

export default Input;
