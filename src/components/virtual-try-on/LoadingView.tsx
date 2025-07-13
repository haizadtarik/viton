
import { Icons } from "../icons";

const messages = [
  "Stitching the pixels...",
  "Styling the model...",
  "Getting the perfect fit...",
  "Almost ready to unveil...",
];

export function LoadingView() {
    const message = messages[Math.floor(Math.random() * messages.length)];
    return (
        <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in gap-6">
            <Icons.Loader className="h-24 w-24 text-blue-600 animate-spin"/>
            <h2 className="text-2xl font-semibold text-slate-700">{message}</h2>
        </div>
    );
}
