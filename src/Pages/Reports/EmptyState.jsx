import React from "react";

const EmptyState = () => {
  return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-lg">No transactions found</p>
      <p className="text-sm mt-2">Try selecting a different date range</p>
    </div>
  );
};

export default EmptyState;
