/* eslint-disable  @typescript-eslint/no-explicit-any */

type Props = {
    children: React.ReactNode;
    className?: string;
    [props: string]: any;
};

const Card = ({ children, className = '', ...props }: Props) => (
    <div className={`p-4 bg-white rounded-lg ${className}`} {...props}>
        {children}
    </div>
);

export default Card;
