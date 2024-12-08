import { BarLoader } from "react-spinners";
export default function Loading() {
    return (
        <div className="w-full h-screen flex items-center justify-center bg-transparent">
            <BarLoader aria-label="Loading Spinner" data-testid="loader" />
        </div>
    );
}
