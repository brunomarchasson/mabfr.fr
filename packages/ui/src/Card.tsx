import * as React from 'react';

export function Card({ title, children }: { title: string; children: React.ReactNode; }) {
  return (
    <div className="border rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
