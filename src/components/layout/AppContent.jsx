export function AppContent({ children }) {
  return (
    <div className="content py-2 mr-2" style={{ border: "1px solid red" }}>
      {children}
    </div>
  );
}
