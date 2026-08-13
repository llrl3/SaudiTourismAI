import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API, timeout: 90000 });

export const sendChat = (message, session_id) =>
  client.post("/chat", { message, session_id }).then((r) => r.data);

export const analyzeImage = (image_base64, question) =>
  client.post("/analyze-image", { image_base64, question }).then((r) => r.data);

export const generateItinerary = (payload) =>
  client.post("/itinerary", payload).then((r) => r.data);

export const getDestinationSuggestions = (city) =>
  client.post("/destination-suggestions", { city }).then((r) => r.data);

export default client;
