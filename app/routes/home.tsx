// import db from "~/db";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

// export async function loader({ params }: Route.LoaderArgs) {
//   const users = await db.query.usersTable.findMany();
//   console.log(users);
//   return users;
// }

import { useState } from "react";

type OrderParams = {
  dailyUsage: number;
  daysUntilNextDelivery: number;
  backupMultiplier: number;
  currentStock: {
    weightInPounds?: number;
    trays?: number;
    trayWeight?: number;
    boxes?: number;
    boxWeight?: number;
    pieces?: number;
    piecesPerBox?: number;
  };
};

function roundToNearest5(value: number): number {
  return Math.round(value / 5) * 5;
}

async function calculateRecommendedOrder(params: OrderParams) {
  const { dailyUsage, daysUntilNextDelivery, backupMultiplier, currentStock } =
    params;

  const totalCurrentStock =
    (currentStock.weightInPounds || 0) +
    (currentStock.trays || 0) * (currentStock.trayWeight || 0) +
    (currentStock.boxes || 0) * (currentStock.boxWeight || 0) +
    (currentStock.pieces || 0) / (currentStock.piecesPerBox || 1);

  const backupStock = dailyUsage * backupMultiplier;
  const exactOrder =
    dailyUsage * daysUntilNextDelivery - totalCurrentStock + backupStock;

  const roundedOrder = Math.max(0, roundToNearest5(exactOrder));

  return await {
    exactOrder: Math.max(0, exactOrder),
    roundedOrder,
  };
}

function OrderCalculator() {
  const [dailyUsage, setDailyUsage] = useState(42);
  const [daysUntilNextDelivery, setDaysUntilNextDelivery] = useState(2);
  const [backupMultiplier, setBackupMultiplier] = useState(0.2);
  const [weightInPounds, setWeightInPounds] = useState(10);
  const [trays, setTrays] = useState(3);
  const [trayWeight, setTrayWeight] = useState(14);
  const [resultData, setResultData] = useState<{
    exactOrder: any;
    roundedOrder: any;
  }>();

  async function calculate() {
    const result = await calculateRecommendedOrder({
      dailyUsage,
      daysUntilNextDelivery,
      backupMultiplier,
      currentStock: {
        weightInPounds,
        trays,
        trayWeight,
      },
    });

    setResultData({
      exactOrder: result.exactOrder,
      roundedOrder: result.roundedOrder,
    });

    console.log({
      resultData,
    });
  }

  return (
    <div className="max-w-lg mx-auto p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Order Calculator</h2>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span>Daily Usage (lbs):</span>
          <input
            type="number"
            value={dailyUsage}
            onChange={(e) => setDailyUsage(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </label>

        <label className="flex flex-col">
          <span>Days Until Delivery:</span>
          <input
            type="number"
            value={daysUntilNextDelivery}
            onChange={(e) => setDaysUntilNextDelivery(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </label>

        <label className="flex flex-col">
          <span>Backup Multiplier (%):</span>
          <input
            type="number"
            step="0.01"
            value={backupMultiplier}
            onChange={(e) => setBackupMultiplier(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </label>

        <label className="flex flex-col">
          <span>Stock in Pounds:</span>
          <input
            type="number"
            value={weightInPounds}
            onChange={(e) => setWeightInPounds(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </label>

        <label className="flex flex-col">
          <span>Trays in Stock:</span>
          <input
            type="number"
            value={trays}
            onChange={(e) => setTrays(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </label>

        <label className="flex flex-col">
          <span>Weight per Tray (lbs):</span>
          <input
            type="number"
            value={trayWeight}
            onChange={(e) => setTrayWeight(Number(e.target.value))}
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex flex-col">
          <input list="options" name="combo" />
          <datalist>
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
          </datalist>
        </label>
      </div>

      <button onClick={calculate}>Calculate</button>

      <div className="mt-4 p-3 border rounded bg-gray-100">
        <p className="text-sm">
          <strong>Exact Calculation:</strong>{" "}
          {resultData?.exactOrder.toFixed(2)} lbs
        </p>
        <p className="text-lg font-semibold">
          <strong>Rounded Off to:</strong> {resultData?.roundedOrder} lbs
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <h1>Hello</h1>
      <OrderCalculator />
    </div>
  );
}
