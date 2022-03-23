// Helper functions

export const toCelsius = kelvin => {
  return Math.round((kelvin - 273.15) * 100) / 100;
};
