"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Plus } from "lucide-react";

export function CreateProductButton() {
  const router = useRouter();
  const createProduct = useMutation(api.products.create);

  async function handleCreate() {
    const name = window.prompt("Product name");
    if (!name?.trim()) return;
    try {
      const id = await createProduct({ name: name.trim() });
      router.push(`/products/${id}`);
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <button type="button" onClick={handleCreate} className="gro-btn-primary flex items-center gap-2">
      <Plus className="w-4 h-4" />
      Create product
    </button>
  );
}
