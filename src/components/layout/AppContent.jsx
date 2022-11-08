const style =
  process.env.NODE_ENV === "development"
    ? { border: "1px solid red", height: "100%" }
    : { height: "100%" };

export function AppContent({ children }) {
  return (
    <div className="content py-2 mr-2" style={style}>
      {children}
    </div>
  );
}
