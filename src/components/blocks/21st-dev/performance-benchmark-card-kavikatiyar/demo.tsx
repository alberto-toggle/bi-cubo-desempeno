"use client";

import { PerformanceCard } from "./component";
import { Utensils, Sandwich, Bubbles, Banana } from "lucide-react";

export default function PerformanceCardDemo() {
  const foodData = {
    title: "Food",
    headerIcon: <Utensils className="w-4 h-4" />,
    mainValue: 1256,
    percentageChange: 8.6,
    benchmarkAverage: 960,
    competitors: [
      {
        name: "Banana Shake",
        value: 2292,
        icon: <Banana className="w-4 h-4" />,
      },
      {
        name: "Big Fernand",
        value: 1694,
        icon: <Sandwich className="w-4 h-4" />,
      },
      {
        name: "Manhatt'n's Burgers",
        value: 998,
        icon: <Bubbles className="w-4 h-4" />,
      },
    ],
    performanceLevels: [
      { label: "0", value: 800, color: "bg-red-500" },
      { label: "800", value: 1100, color: "bg-orange-400" },
      { label: "1100", value: 1400, color: "bg-yellow-400" },
      { label: "+1400", value: 2500, color: "bg-green-500" },
    ],
  };

  return (
    <div className="flex items-center justify-center h-full bg-background p-4">
      <PerformanceCard
        title={foodData.title}
        headerIcon={foodData.headerIcon}
        mainValue={foodData.mainValue}
        percentageChange={foodData.percentageChange}
        benchmarkAverage={foodData.benchmarkAverage}
        competitors={foodData.competitors}
        performanceLevels={foodData.performanceLevels}
      />
    </div>
  );
}
