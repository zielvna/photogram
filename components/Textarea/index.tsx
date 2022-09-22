/* eslint-disable  @typescript-eslint/no-explicit-any */

type Props = {
    [props: string]: any;
};

const Textarea = ({ ...props }: Props) => (
    <textarea className="w-full p-2 bg-light-gray rounded-lg outline-0 resize-none" {...props}></textarea>
);

export default Textarea;
