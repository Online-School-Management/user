/**
 * Axios instance for Laravel API (client-side). Use for auth and other API calls.
 */
import { API_BASE_URL } from "@/constants";

// Dynamic import so axios is only loaded on client when used
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

// Lazy axios instance (add "axios" to package.json when using)
// import axios from "axios";
// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { "Content-Type": "application/json", Accept: "application/json" },
// });
// api.interceptors.request.use((config) => { ... });
// api.interceptors.response.use((res) => res, (err) => { ... });
