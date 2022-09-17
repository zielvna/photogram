/* eslint-disable  @typescript-eslint/no-explicit-any */

import NextLink from 'next/link';

type Props = {
    href: string;
    children: string;
    className?: string;
    [props: string]: any;
};

const Link = ({ href, children, className = '', ...props }: Props) => (
    <NextLink href={href}>
        <a className={`text-blue font-bold ${className}`} {...props}>
            {children}
        </a>
    </NextLink>
);

export default Link;
