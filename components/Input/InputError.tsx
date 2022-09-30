type Props = {
    children: React.ReactNode;
};

const InputError = ({ children }: Props) => <p className="text-red-500 text-xs font-bold">{children}</p>;

export default InputError;
