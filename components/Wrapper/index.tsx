type Props = {
    children: React.ReactNode;
};

const Wrapper = ({ children }: Props) => (
    <div className="max-w-5xl mx-auto px-2 flex flex-col items-center">{children}</div>
);

export default Wrapper;
