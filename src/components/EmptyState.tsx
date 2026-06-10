// src/components/EmptyState.tsx

import { Calendar } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message = "Nenhuma reserva encontrada para os filtros selecionados." }: EmptyStateProps) {
  return (
    <div className="col-span-full text-center py-12">
      <Calendar className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" />
      <p className="text-gray-500 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
}