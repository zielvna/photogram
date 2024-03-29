type Props = {
    children: React.ReactNode;
};

export const Wrapper = ({ children }: Props) => (
    <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">{children}</div>
);
