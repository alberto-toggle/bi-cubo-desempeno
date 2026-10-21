"use client";
import React from "react";
import { DataTableFilter, type FilterOption } from "./component";

import { Zap, Clock, Ban } from "lucide-react";

const StatusOptions: FilterOption[] = [
  { value: "active", label: "Active", icon: Zap },
  { value: "pending", label: "Pending", icon: Clock },
  { value: "deactivated", label: "Deactivated", icon: Ban },
];

const PriorityOptions: FilterOption[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const ExampleUsage = () => {
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = React.useState<string>("");

  return (
    <div className="flex flex-wrap gap-4 p-4 sm:p-8 bg-background border rounded-lg max-w-4xl mx-auto">
      <h3 className="w-full text-lg font-semibold text-foreground mb-2">
        Filter Controls
      </h3>

      {/* Example 1: Multi-Select Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">
          Status:
        </span>
        <DataTableFilter
          label="Status"
          options={StatusOptions}
          selectedValues={selectedStatus}
          onChange={setSelectedStatus}
          isMultiSelect
        />
      </div>

      {/* Example 2: Single-Select Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-muted-foreground">
          Priority:
        </span>
        <DataTableFilter
          label="Priority"
          options={PriorityOptions}
          selectedValues={selectedPriority}
          onChange={(values) => setSelectedPriority(values[0] || "")} // Convert array back to single string
        />
      </div>

      <div className="w-full mt-4 p-3 bg-muted rounded-md text-sm text-muted-foreground">
        <p>
          Current Status Filter:{" "}
          <strong className="text-foreground">
            {selectedStatus.length > 0 ? selectedStatus.join(", ") : "None"}
          </strong>
        </p>
        <p>
          Current Priority Filter:{" "}
          <strong className="text-foreground">
            {selectedPriority || "None"}
          </strong>
        </p>
      </div>
    </div>
  );
};

export default ExampleUsage;
