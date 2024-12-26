import axios from "axios";
//export const BASE_URL = "https://financeapi.kounouz.travel/";
//export const BASE_URL = "https://localhost:5001/";
export const BASE_URL = process.env.REACT_APP_HOST_API;
export const AXIOS = axios.create({ baseURL: BASE_URL + "api/" });
