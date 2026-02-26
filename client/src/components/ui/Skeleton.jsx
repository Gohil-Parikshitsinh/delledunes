// ── INDIVIDUAL SKELETON TYPES ─────────────────────────────────────────────────

export const ProductSkeleton = () => (
    <div style={{ animation: "skeleton-pulse 1.5s ease-in-out infinite" }}>
      <div style={{ aspectRatio: "3/4", background: "#E8E6E2", marginBottom: "12px" }} />
      <div style={{ background: "#E8E6E2", height: "12px", width: "75%", marginBottom: "8px" }} />
      <div style={{ background: "#E8E6E2", height: "12px", width: "35%" }} />
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
  
  export const ProductSkeletonGrid = ({ count = 3, columns = 3 }) => (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "20px",
        }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </>
  );
  
  export const TextSkeleton = ({ width = "100%", height = "14px", mb = "8px" }) => (
    <div
      style={{
        width,
        height,
        background: "#E8E6E2",
        marginBottom: mb,
        animation: "skeleton-pulse 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
  
  export const CardSkeleton = ({ height = "200px" }) => (
    <div
      style={{
        width: "100%",
        height,
        background: "#E8E6E2",
        animation: "skeleton-pulse 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
  
  // ── DEFAULT EXPORT — most common use case ─────────────────────────────────────
  const Skeleton = ({ width = "100%", height = "16px" }) => (
    <div
      style={{
        width,
        height,
        background: "#E8E6E2",
        animation: "skeleton-pulse 1.5s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
  
  export default Skeleton;