type Props = {
    children: React.ReactNode;
};

export const InputError = ({ children }: Props) => <p className="text-red-500 text-xs font-bold">{children}</p>;
