import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const PriceHistoryModal = ({ isOpen, onClose, priceHistory, yarnCount }) => {
  if (!isOpen) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Price History
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Yarn Count: {yarnCount}
            </p>
          </div>
          <motion.button
            whileHover={{ rotate: 90 }}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes />
          </motion.button>
        </div>

        <div className="p-5">
          <div className="overflow-y-auto max-h-96">
            {!priceHistory ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      Date
                    </th>
                    <th className="px-4 py-2 text-right text-sm font-semibold text-gray-600">
                      Price (₹)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(priceHistory) && priceHistory.length > 0 ? (
                    priceHistory.map((history, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 ${
                          index === 0 ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(history.created_at).toLocaleString(
                            "en-IN",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                          {Number(history.price).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No price history available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PriceHistoryModal;
