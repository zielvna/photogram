/* eslint-disable  @typescript-eslint/no-explicit-any */

type Props = {
    scheme?: 'normal' | 'small';
    children: React.ReactNode;
    [props: string]: any;
};

const Button = ({ children, scheme = 'normal', ...props }: Props) => {
    const buttonStyles =
        scheme === 'normal' ? 'w-full py-2 bg-blue text-white font-bold rounded-lg' : 'text-blue font-bold';

    return (
        <button className={buttonStyles} {...props}>
            {children}
        </button>
    );
};

export default Button;
