import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

interface FileInfo {
    name: string;
    url: string;
}

export function DialogNode({ isOpen, onClose, node, handleDelete }: { isOpen: boolean; onClose: () => void; node: any; handleDelete: () => void }) {
    const [files, setFiles] = useState<FileInfo[]>([]);

    useEffect(() => {
        const fetchFiles = async () => {
            const supabase = createClient();
            const { data, error } = await supabase.storage
                .from('archivos')
                .list(`${node.id}`);

            if (error) {
                console.error('Error fetching files:', error);
            } else {
                const fileInfoPromises = data?.map(async (file) => {
                    const { data: { publicUrl } } = supabase.storage
                        .from('archivos')
                        .getPublicUrl(`${node.id}/${file.name}`);
                    return { name: file.name, url: publicUrl };
                }) || [];

                const fileInfos = await Promise.all(fileInfoPromises);
                setFiles(fileInfos);
            }
        };

        if (isOpen) {
            fetchFiles();
        }
    }, [isOpen, node.id]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='text-gray-500 max-h-[700px] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle>{node.data.label}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Acerca del Cargo:</h3>
                    <p className='text-gray-400'>{node.data.description}</p>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Responsabilidades:</h3>
                    <ul className="list-disc pl-5 text-gray-400">
                        {node.data.responsibilities.map((resp: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
                            <li key={index}>{resp}</li>
                        ))}
                    </ul>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Calificaciones:</h3>
                    <ul className="list-disc pl-5 text-gray-400">
                        {node.data.qualifications.map((qual: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
                            <li key={index}>{qual}</li>
                        ))}
                    </ul>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Formatos con los que trabaja</h3>
                    {files.length > 0 ? (
                        <ul className="mt-2 text-sm grid grid-cols-2 gap-3">
                            {files.map((file, index) => (
                                <li key={index} className="p-3 rounded-md bg-gray-300">
                                    <a 
                                        href={file.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-gray-500 font-medium "
                                        download
                                    >
                                        {file.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No hay archivos adjuntos.</p>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="destructive" onClick={handleDelete}>
                        Eliminar Cargo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}