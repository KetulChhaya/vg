import React, { useState, useEffect, useRef, useMemo } from "react";
const DataTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    minRevenue: "",
    maxRevenue: "",
    minNetIncome: "",
    maxNetIncome: "",
  });
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = process.env.REACT_APP_DATA_API_KEY || "aq2e1AQjcwQoepAgwbWDlA5u3DXFq0az"; 
      const response = await fetch(
        `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${apiKey}`
      );
      const result = await response.json();
      setData(result);
      setFilteredData(result);
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const {
      startDate,
      endDate,
      minRevenue,
      maxRevenue,
      minNetIncome,
      maxNetIncome,
    } = filters;
    const filtered = data.filter((item) => {
      const dateValid =
        (!startDate || item.date >= startDate) &&
        (!endDate || item.date <= endDate);
      const revenueValid =
        (!minRevenue || item.revenue >= Number(minRevenue)) &&
        (!maxRevenue || item.revenue <= Number(maxRevenue));
      const netIncomeValid =
        (!minNetIncome || item.netIncome >= Number(minNetIncome)) &&
        (!maxNetIncome || item.netIncome <= Number(maxNetIncome));
      return dateValid && revenueValid && netIncomeValid;
    });
    setFilteredData(filtered);
  };

  const sortData = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    const sorted = [...filteredData].sort((a, b) => {
      if (a[field] < b[field]) return order === "asc" ? -1 : 1;
      if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      return 0;
    });
    setSortField(field);
    setSortOrder(order);
    setFilteredData(sorted);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4 font-bold">Data Filtering</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
        <input
          type="date"
          name="startDate"
          className="border p-2"
          placeholder="Start Date"
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          className="border p-2"
          placeholder="End Date"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minRevenue"
          className="border p-2"
          placeholder="Min Revenue"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxRevenue"
          className="border p-2"
          placeholder="Max Revenue"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minNetIncome"
          className="border p-2"
          placeholder="Min Net Income"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxNetIncome"
          className="border p-2"
          placeholder="Max Net Income"
          onChange={handleFilterChange}
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 w-full mb-5"
        onClick={applyFilters}
      >
        Apply Filters
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
            <th
              className="border border-gray-300 px-4 py-2 cursor-pointer"
              onClick={() => sortData("date")}
            >
              Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="border border-gray-300 px-4 py-2 cursor-pointer"
              onClick={() => sortData("revenue")}
            >
              Revenue{" "}
              {sortField === "revenue" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="border border-gray-300 px-4 py-2 cursor-pointer"
              onClick={() => sortData("netIncome")}
            >
              Net Income{" "}
              {sortField === "netIncome" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="border border-gray-300 px-4 py-2">Gross Profit</th>
            <th className="border border-gray-300 px-4 py-2">EPS</th>
            <th className="border border-gray-300 px-4 py-2">
              Operating Income
            </th>
            </tr>
          </thead>
          <tbody>
            {filteredData && filteredData.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                <td className="border border-gray-300 px-4 py-2">${item.revenue.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">${item.netIncome.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">${item.grossProfit.toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{item.eps}</td>
                <td className="border border-gray-300 px-4 py-2">${item.operatingIncome.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
