// src/components/LoadingSpinner.tsx

export default function LoadingSpinner() {
  return (
    <div className="col-span-full flex justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
    </div>
  );
}