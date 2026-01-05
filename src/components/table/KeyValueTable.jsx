import DataTable from "./DataTable";

export default function KeyValueTable({ title, items }) {
  return (
    <div className="space-y-2">
      {title && (
        <h3 className="text-sm font-semibold text-gray-900">
          {title}
        </h3>
      )}

      <DataTable
        columns={[
          { key: "label", label: "Field" },
          { key: "value", label: "Value" },
        ]}
        rows={items}
      />
    </div>
  );
}
