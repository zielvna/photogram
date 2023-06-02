type Props = {
    children: React.ReactNode;
};

export const Card = ({ children }: Props) => <div className="w-full p-4 bg-white rounded-lg">{children}</div>;
