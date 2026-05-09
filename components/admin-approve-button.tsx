"use client";

import { useState } from "react";

export const AdminApproveButton = ({ artistId }: { artistId: string }) => {
  const [loading, setLoading] = useState(false);

  const approve = async () => {
    setLoading(true);
    await fetch(`/api/admin/approve/${artistId}`, { method: "POST" });
    setLoading(false);
    window.location.reload();
  };

  return (
    <button
      onClick={approve}
      disabled={loading}
      className="rounded-none bg-sky px-3 py-1 text-xs font-semibold text-white transition hover:bg-sky/90 disabled:opacity-60"
    >
      {loading ? "Approving..." : "Approve"}
    </button>
  );
};
