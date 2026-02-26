const QuantitySelector = ({ quantity, onChange, max = 10, min = 1 }) => (
    <div>
      <p
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#1A1A1A",
          marginBottom: "10px",
        }}
      >
        Quantity
      </p>
  
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          border: "1.5px solid #E0DED8",
        }}
      >
        <button
          onClick={() => onChange(Math.max(min, quantity - 1))}
          disabled={quantity <= min}
          style={{
            width: "40px",
            height: "40px",
            background: "none",
            border: "none",
            cursor: quantity <= min ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "18px",
            color: quantity <= min ? "#C4C2BE" : "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.15s",
          }}
        >
          −
        </button>
  
        <span
          style={{
            width: "44px",
            textAlign: "center",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#1A1A1A",
            borderLeft: "1.5px solid #E0DED8",
            borderRight: "1.5px solid #E0DED8",
            lineHeight: "40px",
            userSelect: "none",
          }}
        >
          {quantity}
        </span>
  
        <button
          onClick={() => onChange(Math.min(max, quantity + 1))}
          disabled={quantity >= max}
          style={{
            width: "40px",
            height: "40px",
            background: "none",
            border: "none",
            cursor: quantity >= max ? "not-allowed" : "pointer",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "18px",
            color: quantity >= max ? "#C4C2BE" : "#1A1A1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.15s",
          }}
        >
          +
        </button>
      </div>
  
      {/* Low stock warning — shows when close to max */}
      {quantity >= max && (
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "11px",
            color: "#C9B99A",
            marginTop: "6px",
            fontWeight: 600,
          }}
        >
          Maximum {max} per size per order
        </p>
      )}
    </div>
  );
  
  export default QuantitySelector;