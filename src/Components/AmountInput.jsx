import React from "react";

const AmountInput = React.memo(({
  value,
  onChange,
  max = 10000,
  placeholder = "0",
  disabled = false,
  className = "",
}) => {
  const displayValue = value
    ? new Intl.NumberFormat("en-IN").format(Number(value))
    : "";

  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "" || Number(raw) <= max) {
      onChange(raw);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
        ₹
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-10 pr-4 py-4 text-2xl font-bold rounded-2xl border-2 border-slate-200 focus:border-purple-500 outline-none transition bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
});

AmountInput.displayName = "AmountInput";

export default AmountInput;
