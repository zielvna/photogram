/* eslint-disable  @typescript-eslint/no-explicit-any */

import NextLink from 'next/link';

type Props = {
    href: string;
    children: string;
    [props: string]: any;
};

const Link = ({ href, children, ...props }: Props) => (
    <NextLink href={href}>
        <a {...props}>{children}</a>
    </NextLink>
);

export default Link;
