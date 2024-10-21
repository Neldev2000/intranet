import { EditPositionForm } from "@/components/EditPositionForm";
import { Button } from "@/components/ui/button";

import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
interface FileInfo {
    name: string;
    url: string;
}
export function DrawerNode({ isOpen, onClose, node, handleDelete, positions  }: { isOpen: boolean; onClose: () => void; node: any; handleDelete: () => void, positions: any[] }) {
    const [files, setFiles] = useState<FileInfo[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const handleEdit = () => {
        setIsEditing(true);
    };
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
    const handleEditComplete = (updatedData: any) => {
     
        setIsEditing(false);
    };
    
    if (isEditing) {
        return (
            <Drawer open={isOpen} onOpenChange={onClose}>
                <DrawerContent className='text-gray-500'>
                    <div className="h-[calc(100vh-10rem)] flex flex-col">
                        <DrawerHeader className="flex-shrink-0">
                            <DrawerTitle>Editar {node.data.label}</DrawerTitle>
                        </DrawerHeader>
                        <div className="flex-grow overflow-y-auto px-4">
                            <EditPositionForm 
                                existingPositions={positions} 
                                node={node} 
                                onComplete={handleEditComplete} 
                                onCancel={() => setIsEditing(false)} 
                            />
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className='text-gray-500'>
                <div className="h-[calc(100vh-10rem)] flex flex-col">
                    <DrawerHeader className="flex-shrink-0">
                        <DrawerTitle>{node.data.label}</DrawerTitle>
                    </DrawerHeader>
                    <div className="flex-grow overflow-y-auto px-4">
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Acerca del Cargo:</h3>
                            <p className='text-gray-400'>{node.data.description}</p>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Funciones Actuales:</h3>
                            <ul className="list-disc pl-5 text-gray-400">
                            {node.data.currentFunctions && node.data.currentFunctions.map((resp: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
                                    <li key={index}>{resp}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Responsibilidades Adquiridas:</h3>
                            <ul className="list-disc pl-5 text-gray-400">
                                {node.data.adquiredResposibilities && node.data.adquiredResposibilities.map((resp: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
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
                    </div>
                    <DrawerFooter>
                    <Button variant="outline" onClick={handleEdit}>
                        Editar Cargo
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Eliminar Cargo
                    </Button>
                </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
