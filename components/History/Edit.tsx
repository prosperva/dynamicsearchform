// pages/customers/CustomerEdit.tsx
import { useEffect, useState } from "react";
import AuditHistoryCompact from "./CompactHistory";

interface Customer {
  id: number;
  name: string;
  email: string;
}

export default function CustomerEdit({ id }: { id: number }) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((res) => res.json())
      .then(setCustomer);
  }, [id]);

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Edit Customer</h2>

      <div className="bg-gray-50 p-4 rounded mb-6">
        <p><b>Name:</b> {customer.name}</p>
        <p><b>Email:</b> {customer.email}</p>
      </div>

      <AuditHistoryCompact tableName="Customer" recordId={id} />
    </div>
  );
}
