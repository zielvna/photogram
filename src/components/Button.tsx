const schemas = {
    normal: 'w-full py-2 bg-blue text-white font-bold rounded-lg border border-white',
    inverse: 'w-full py-2 bg-white text-blue font-bold rounded-lg border border-blue',
    small: 'text-blue font-bold',
} as const;

type Props = Readonly<{
    scheme?: keyof typeof schemas;
}> &
    JSX.IntrinsicElements['button'];

export const Button = ({ scheme = 'normal', ...props }: Props) => <button className={schemas[scheme]} {...props} />;
