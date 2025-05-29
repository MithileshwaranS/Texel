import React, { useState } from "react";
import WarpDesignSheet from "./WarpDesignSheet";
import WeftDesignSheet from "./WeftDesignSheet";

const DesignSheet = () => {
  const [designType, setDesignType] = useState("warp");
  const [designName, setDesignName] = useState("");
  const [colorName, setColorName] = useState("");

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setDesignType("warp")}
          className={`px-4 py-2 rounded-md font-medium ${
            designType === "warp"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Warp Design
        </button>
        <button
          onClick={() => setDesignType("weft")}
          className={`px-4 py-2 rounded-md font-medium ${
            designType === "weft"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Weft Design
        </button>
      </div>

      {designType === "warp" ? (
        <WarpDesignSheet
          onChangeDesignType={setDesignType}
          onChangeDesignName={setDesignName}
          onChangeColorName={setColorName}
        />
      ) : (
        <WeftDesignSheet newDesignName={designName} newColorName={colorName} />
      )}
    </div>
  );
};

export default DesignSheet;
