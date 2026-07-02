import { Suspense } from "react";
import ViewResourceClient from "./view-resource-client";

export default function ViewResourcePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ViewResourceClient />
    </Suspense>
  );
}
