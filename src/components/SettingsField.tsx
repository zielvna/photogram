type Props = {
    name: string;
    children: React.ReactNode;
};

export const SettingsField = ({ name, children }: Props) => (
    <div className="sm:flex sm:items-center">
        <p className="flex shrink-0 sm:w-32 sm:justify-end">{name}</p>
        <div className="w-full mt-2 sm:ml-4 sm:mt-0">{children}</div>
    </div>
);
