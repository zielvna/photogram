import { RefObject, useEffect, useState } from 'react';

export const useFile = (ref: RefObject<HTMLInputElement>) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const onChange = (event: Event) => {
        const target = event.target as HTMLInputElement;

        if (target.files) {
            setSelectedFile(target.files[0]);
        }
    };

    const openFile = () => {
        ref.current?.click();
    };

    useEffect(() => {
        ref.current?.addEventListener('change', onChange);

        return () => {
            ref.current?.removeEventListener('change', onChange);
        };
    }, [ref.current]);

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }

        const fileUrl = URL.createObjectURL(selectedFile);
        setPreview(fileUrl);

        return () => URL.revokeObjectURL(fileUrl);
    }, [selectedFile]);

    return [preview, selectedFile, openFile] as const;
};
