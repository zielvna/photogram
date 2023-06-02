/* eslint-disable  @typescript-eslint/no-explicit-any */

import NextLink from 'next/link';

type Props = {
    href: string;
    children: React.ReactNode;
    [props: string]: any;
};

export const Link = ({ href, children, ...props }: Props) => (
    <NextLink href={href}>
        <a {...props}>{children}</a>
    </NextLink>
);
