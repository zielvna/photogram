/* eslint-disable  @typescript-eslint/no-explicit-any */

import classnames from 'classnames';

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
        <button className={classnames(buttonStyles, className)} {...props}>
            {children}
        </button>
    );
};

export default Button;
