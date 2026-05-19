import { Spinner } from "@/components/ui/Spinner";

export function FullScreenLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-paper/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-md border border-line bg-white px-6 py-5 shadow-sm">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-zinc-600">{label}</p>
      </div>
    </div>
  );
}
