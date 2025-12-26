import React, { useState } from "react";
import { FaBoxOpen, FaPlus, FaTrash } from "react-icons/fa";

const emptyRow = {
  designNo: "",
  quality: "",
  color: "",
  width: "",
  gsm: "",
  quantity: "",
  rate: "",
  amount: "",
  remarks: "",
};

function Inventory() {
  const [rows, setRows] = useState([{ ...emptyRow }]);

  const handleChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    // Auto-calculate amount
    const qty = Number(updatedRows[index].quantity);
    const rate = Number(updatedRows[index].rate);
    updatedRows[index].amount = qty && rate ? qty * rate : "";

    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <FaBoxOpen className="mr-2" />
        Inventory Management
      </h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <Header title="Design No" />
              <Header title="Quality" />
              <Header title="Color" />
              <Header title="Width" />
              <Header title="GSM" />
              <Header title="Quantity" />
              <Header title="Rate" />
              <Header title="Amount" />
              <Header title="Remarks" />
              <Header title="Action" />
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                <Cell
                  value={row.designNo}
                  onChange={(e) =>
                    handleChange(index, "designNo", e.target.value)
                  }
                />
                <Cell
                  value={row.quality}
                  onChange={(e) =>
                    handleChange(index, "quality", e.target.value)
                  }
                />
                <Cell
                  value={row.color}
                  onChange={(e) => handleChange(index, "color", e.target.value)}
                />
                <Cell
                  value={row.width}
                  onChange={(e) => handleChange(index, "width", e.target.value)}
                />
                <Cell
                  value={row.gsm}
                  onChange={(e) => handleChange(index, "gsm", e.target.value)}
                />
                <Cell
                  type="number"
                  value={row.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", e.target.value)
                  }
                />
                <Cell
                  type="number"
                  value={row.rate}
                  onChange={(e) => handleChange(index, "rate", e.target.value)}
                />
                <td className="px-2 py-1 text-center font-semibold">
                  {row.amount}
                </td>
                <Cell
                  value={row.remarks}
                  onChange={(e) =>
                    handleChange(index, "remarks", e.target.value)
                  }
                />
                <td className="px-2 py-1 text-center">
                  <button
                    onClick={() => removeRow(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={addRow}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <FaPlus />
          Add Row
        </button>

        <div className="text-sm font-medium">
          Total Amount:{" "}
          <span className="font-bold">
            ₹{rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

const Header = ({ title }) => (
  <th className="px-3 py-3 text-left font-semibold whitespace-nowrap">
    {title}
  </th>
);

const Cell = ({ value, onChange, type = "text" }) => (
  <td className="px-2 py-1">
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black"
    />
  </td>
);

export default Inventory;
