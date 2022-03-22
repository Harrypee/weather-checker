const baseURL = "https://api.openweathermap.org/data/";

export const apiEndpoint = {
  CURRENT_WEATHER: baseURL + "2.5/weather",
};

const processParams = params => {
  let result = "";

  for (const key in params) {
    result += `?${key}=${encodeURIComponent(params[key].toString())}`;
  }

  return result;
};

export const http = async (url, params) => {
  const paramsURI = processParams(params);

  return fetch(url + paramsURI).then(res => res.json());
};
