let cachedColors = [];

export const getColors = async () => {
  if (cachedColors.length > 0) {
    return cachedColors;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BACKEND_URL}/api/colors`
    );
    const colors = await response.json();

    // Transform the data to match the predefined colors format
    cachedColors = colors.map((color) => ({
      value: color.colorvalue,
      label: color.colorlabel,
    }));

    return cachedColors;
  } catch (error) {
    console.error("Error fetching colors:", error);
    return [];
  }
};

// Color conversion utilities
export const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
};

export const colorToHex = (color) => {
  if (!color) return "#000000";
  if (color.startsWith("#")) return color;

  const temp = document.createElement("div");
  document.body.appendChild(temp);
  temp.style.color = color;
  const computedColor = window.getComputedStyle(temp).color;
  document.body.removeChild(temp);

  const match = computedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (match) {
    const [_, r, g, b] = match.map(Number);
    return rgbToHex(r, g, b);
  }

  return "#000000";
};
