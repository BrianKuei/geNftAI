import message from "antd/lib/message";

const toast = {
  success: (msg?: string) =>
    message.success({
      content: `Success: ${msg || "completed"}`,
      className: "custom-class",
      style: {
        marginTop: "80vh",
      },
    }),
  warn: (msg?: string) =>
    message.warn({
      content: `Warn: ${msg || "Something wrong please try again."}`,
      className: "custom-class",
      style: {
        marginTop: "80vh",
      },
    }),
  error: (msg?: string) =>
    message.error({
      content: `Error: ${msg || "System Error!"}`,
      className: "custom-class",
      style: {
        marginTop: "80vh",
      },
    }),
};

export default toast;
