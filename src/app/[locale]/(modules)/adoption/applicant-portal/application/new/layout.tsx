import { ReactNode } from "react";

export default function NewApplicationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          New Application
        </h1>
        <p className="text-gray-600">
          This page will contain the new application layout.
        </p>
        {children}
      </div>
    </div>
  );
}
