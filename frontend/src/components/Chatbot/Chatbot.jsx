function Chatbot() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        background: "#2563eb",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "32px",
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(0,0,0,.25)",
        zIndex: 9999,
      }}
    >
      💬
    </div>
  );
}

export default Chatbot;