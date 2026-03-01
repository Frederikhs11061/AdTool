"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export function CreateProductButton() {
  const router = useRouter();

  async function handleCreate() {
    const name = window.prompt("Product name");
    if (!name?.trim()) return;
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) return;
    const { id } = await res.json();
    router.push(`/products/${id}`);
    router.refresh();
  }

  return (
    <button type="button" onClick={handleCreate} className="gro-btn-primary flex items-center gap-2">
      <Plus className="w-4 h-4" />
      Create product
    </button>
  );
}
