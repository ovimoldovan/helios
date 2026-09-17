import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

interface PhotoLightboxProps {
    src: string | null;
    alt: string;
    onClose: () => void;
}

export function PhotoLightbox({ src, alt, onClose }: PhotoLightboxProps) {
    return (
        <Dialog open={!!src} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl w-fit p-2 bg-transparent border-none shadow-none">
                <DialogTitle className="sr-only">{alt}</DialogTitle>
                {src && (
                    <img
                        src={src}
                        alt={alt}
                        className="max-w-full max-h-[85vh] rounded-md object-contain mx-auto"
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}