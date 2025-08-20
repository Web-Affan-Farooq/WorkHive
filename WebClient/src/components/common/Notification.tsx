import { CheckCircle2, XCircle } from "lucide-react";

const Notification = ({
  text,
  type,
}: {
  text: string;
  type: "success" | "error";
}) => {
  return (
    <div
      className={`px-4 backdrop-blur-2xl backdrop-opacity-100 py-3 m-auto w-[80vw] max-sm:w-[90vw] max-sm:px-3 max-sm:py-2 flex flex-row items-center gap-3 rounded-2xl shadow-md ${
        type === "success" ? "bg-green-300/30" : "bg-red-300/30"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="text-green-600" />
      ) : (
        <XCircle className="text-red-600" />
      )}
      <span className="text-gray-800 font-medium">{text}</span>
    </div>
  );
};

export default Notification;
