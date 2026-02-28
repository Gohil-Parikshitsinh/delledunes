const PageLoader = () => {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#F5F4F0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
      }}>
        <h1 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: 32,
          letterSpacing: "0.1em",
          color: "#1A1A1A",
          margin: 0,
        }}>
          Delle Dunes
        </h1>
        <div style={{
          width: 32,
          height: 2,
          background: "#E0DED8",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
        }}>
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            height: "100%",
            width: "40%",
            background: "#1A1A1A",
            borderRadius: 2,
            animation: "slide 1s ease infinite",
          }} />
        </div>
        <style>{`
          @keyframes slide {
            0%   { left: -40%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    );
  };
  
  export default PageLoader;