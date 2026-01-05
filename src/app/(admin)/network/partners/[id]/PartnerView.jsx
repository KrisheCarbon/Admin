"use client";

import KeyValueTable from "@/components/table/KeyValueTable";

export default function PartnerView({ partner, panUrl, mouUrl, onEdit }) {
  return (
    <div className="space-y-8">

      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">{partner.org_name}</h1>
          <p className="text-sm text-gray-500">
            Partner organisation details
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs capitalize
                ${partner.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"}
            `}
            >
            {partner.status}
           </span>


          <button
            onClick={onEdit}
            className="text-sm border px-3 py-1 rounded-md"
          >
            Edit
          </button>
        </div>
      </header>

      <KeyValueTable
        title="Organisation Details"
        items={[
          { label: "Organisation Name", value: partner.org_name },
          { label: "Base Location", value: partner.base_location },
          { label: "CIN Number", value: partner.cin_number || "—" },
          { label: "Farmer Base", value: partner.farmer_base },
          {
            label: "States of Operation",
            value: <TagList items={partner.states_of_operation} />,
          },
          {
            label: "Crop Types",
            value: <TagList items={partner.crop_types} />,
          },
        ]}
      />
      <KeyValueTable
        title="Bank Details"
        items={[
          {
            label: "Account Holder Name",
            value: partner.bank_account_holders_name,
          },
          {
            label: "Account Number",
            value: partner.bank_account_number,
          },
          { label: "IFSC Code", value: partner.bank_ifsc },
          { label: "Bank Name", value: partner.bank_name },
          { label: "Branch", value: partner.bank_branch },
          { label: "Bank Address", value: partner.bank_address },
        ]}
      />
      <KeyValueTable
        title="Compliance Documents"
        items={[
            { label: "PAN Card", value: <DocValue url={panUrl} /> },
            { label: "MoU Document", value: <DocValue url={mouUrl} /> },
        ]}
        />



      <Section title="Organisation Details">
        <Row label="Organisation Name" value={partner.org_name} />
        <Row label="Base Location" value={partner.base_location} />
        <Row label="CIN Number" value={partner.cin_number || "—"} />
        <Row label="Farmer Base" value={partner.farmer_base} />

        <Row
            label="States of Operation"
            value={<List items={partner.states_of_operation} />}
        />

        <Row
            label="Crop Types"
            value={<List items={partner.crop_types} />}
        />
        </Section>

     <Section title="Bank Details">
        <Row
            label="Account Holder Name"
            value={partner.bank_account_holders_name}
        />
        <Row
            label="Account Number"
            value={partner.bank_account_number}
        />
        <Row label="IFSC Code" value={partner.bank_ifsc} />
        <Row label="Bank Name" value={partner.bank_name} />
        <Row label="Branch" value={partner.bank_branch} />
        <Row label="Bank Address" value={partner.bank_address} />
     </Section>



      <Section title="Compliance Documents">
        <Doc label="PAN Card" url={panUrl} />
        <Doc label="MoU Document" url={mouUrl} />
      </Section>
    </div>
  );
}


function List({ items }) {
  if (!items || items.length === 0) return "—";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="px-2 py-0.5 text-xs rounded bg-gray-100"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="border rounded-xl bg-white p-6 space-y-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <div className="text-sm font-medium">
        {value ?? "—"}
      </div>
    </div>
  );
}


function Doc({ label, url }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View document
        </a>
      ) : (
        <p className="text-sm text-gray-400">Not uploaded</p>
      )}
    </div>
  );
}

function DocValue({ url }) {
  return url ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 hover:underline"
    >
      View document
    </a>
  ) : (
    <span className="text-gray-400">Not uploaded</span>
  );
}


function TagList({ items }) {
  if (!items || items.length === 0) return "—";

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="px-2 py-0.5 text-xs rounded bg-gray-100"
        >
          {item}
        </span>
      ))}
    </div>
  );
}