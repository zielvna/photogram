/* eslint-disable  @typescript-eslint/no-explicit-any */

type Props = {
    scheme?: 'normal' | 'small';
    children: React.ReactNode;
    className?: string;
    [props: string]: any;
};

const Button = ({ children, scheme = 'normal', className = '', ...props }: Props) => {
    const buttonStyles =
        scheme === 'normal' ? 'py-2 px-8 bg-blue text-white font-bold rounded-lg' : 'text-blue font-bold';

    return (
        <button className={`${buttonStyles} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;
