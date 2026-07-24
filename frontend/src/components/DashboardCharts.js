import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A855F7",
  "#EC4899",
  "#22C55E",
  "#EF4444"
];

function DashboardCharts({ books }) {

  const categoryData = Object.values(

    books.reduce((acc, book) => {

      if (!acc[book.category]) {

        acc[book.category] = {
          name: book.category,
          value: 0
        };

      }

      acc[book.category].value++;

      return acc;

    }, {})

  );
   const recentBook =
  books.length > 0
    ? books.reduce((a, b) => (a.id > b.id ? a : b))
    : null;

const expensiveBook =
  books.length > 0
    ? books.reduce((a, b) =>
        Number(a.price) > Number(b.price) ? a : b
      )
    : null;

const cheapestBook =
  books.length > 0
    ? books.reduce((a, b) =>
        Number(a.price) < Number(b.price) ? a : b
      )
    : null;

  return (

    <div className="chartCard">

      <h2>📊 Books by Category</h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <PieChart>

          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >

            {
              categoryData.map((entry, index) => (

                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />

              ))
            }

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>
<div className="analyticsGrid">

  <div className="analyticsCard">
    <h3>🆕 Recent Book</h3>

    {recentBook ? (
      <>
        <strong>{recentBook.title}</strong>
        <p>{recentBook.author}</p>
      </>
    ) : (
      <p>No Data</p>
    )}

  </div>

  <div className="analyticsCard">
    <h3>💰 Most Expensive</h3>

    {expensiveBook ? (
      <>
        <strong>{expensiveBook.title}</strong>
        <p>₹ {expensiveBook.price}</p>
      </>
    ) : (
      <p>No Data</p>
    )}

  </div>

  <div className="analyticsCard">
    <h3>💸 Cheapest</h3>

    {cheapestBook ? (
      <>
        <strong>{cheapestBook.title}</strong>
        <p>₹ {cheapestBook.price}</p>
      </>
    ) : (
      <p>No Data</p>
    )}

  </div>

</div>
    </div>

  );

}

export default DashboardCharts;
