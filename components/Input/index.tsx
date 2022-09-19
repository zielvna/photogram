/* eslint-disable  @typescript-eslint/no-explicit-any */

import classnames from 'classnames';

type Props = {
    className?: string;
    [props: string]: any;
};

const Input = ({ className = '', ...props }: Props) => (
    <input className={classnames('w-full p-2 bg-light-gray rounded-lg outline-0', className)} {...props} />
);

export default Input;
