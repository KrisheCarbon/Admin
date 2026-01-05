"use client";

import { useState } from "react";
import PartnerView from "./PartnerView";
import PartnerEditor from "./PartnerEditor";

export default function PartnerClient({ partner, panUrl, mouUrl }) {
  const [mode, setMode] = useState("view");

  if (mode === "edit") {
    return (
      <PartnerEditor
        partner={partner}
        onCancel={() => setMode("view")}
        onSaved={() => setMode("view")}
      />
    );
  }

  return (
    <PartnerView
      partner={partner}
      panUrl={panUrl}
      mouUrl={mouUrl}
      onEdit={() => setMode("edit")}
    />
  );
}
