import axios from "axios";

const BASE_URL = "http://localhost:3000";

const callApi = async (endpoint) => {
  const response = await axios.get(`${BASE_URL}${endpoint}`);
  return response.data;
};

export const getDeployments = () => callApi("/deployment");
export const getPods = () => callApi("/pods");
export const getServices = () => callApi("/services");
export const getNodes = () => callApi("/nodes");
export const getHealth = () => callApi("/health");
export const getReady = () => callApi("/ready");
export const getAutoscaled = () => callApi("/autoscaled");
export const getPodsSummary = () => callApi("/pods/summary");
export const getServicesSummary = () => callApi("/services/summary");