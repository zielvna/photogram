/* eslint-disable  @typescript-eslint/no-explicit-any */

type Props = {
    scheme?: 'normal' | 'inverse' | 'small';
    children: React.ReactNode;
    [props: string]: any;
};

const Button = ({ children, scheme = 'normal', ...props }: Props) => {
    let buttonStyles;

    switch (scheme) {
        case 'normal':
            buttonStyles = 'w-full py-2 bg-blue text-white font-bold rounded-lg border border-white';
            break;
        case 'inverse':
            buttonStyles = 'w-full py-2 bg-white text-blue font-bold rounded-lg border border-blue';
            break;
        case 'small':
            buttonStyles = 'text-blue font-bold';
            break;
    }

    return (
        <button className={buttonStyles} {...props}>
            {children}
        </button>
    );
};

export default Button;
