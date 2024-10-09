import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function DialogNode({ isOpen, onClose, node, handleDelete }: { isOpen: boolean; onClose: () => void; node: any; handleDelete: () => void }) {
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
                <DialogFooter>
                    <Button variant="destructive" onClick={handleDelete}>
                        Eliminar Cargo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}