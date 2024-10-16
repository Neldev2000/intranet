import { Button } from "@/components/ui/button";

import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export function DrawerNode({ isOpen, onClose, node, handleDelete, positions  }: { isOpen: boolean; onClose: () => void; node: any; handleDelete: () => void, positions: any[] }) {
    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className='text-gray-500 px-4 max-h-[600px] overflow-y-auto'>
                <DrawerHeader>
                    <DrawerTitle>{node.data.label}</DrawerTitle>
                </DrawerHeader>
                <div className="mt-4 ">
                    <h3 className="text-lg font-semibold">Acerca del Cargo:</h3>
                    <p className='text-gray-400'>{node.data.description}</p>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Funciones Actuales:</h3>
                    <ul className="list-disc pl-5 text-gray-400">
                        {node.data.currentFunctions.map((resp: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
                            <li key={index}>{resp}</li>
                        ))}
                    </ul>
                </div>
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Responsibilidades Adquiridas:</h3>
                    <ul className="list-disc pl-5 text-gray-400">
                        {node.data.adcquiredResponsibilities.map((resp: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | React.PromiseLikeOfReactNode | null | undefined, index: React.Key | null | undefined) => (
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
                <DrawerFooter>
                    <Button variant="destructive" onClick={handleDelete}>
                        Eliminar Cargo
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}