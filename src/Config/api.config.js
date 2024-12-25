import axios from "axios";
//export const BASE_URL = "https://financeapi.kounouz.travel/";
//export const BASE_URL = "https://localhost:5001/";
export const BASE_URL = "http://192.168.1.165:8081/";
export const AXIOS = axios.create({ baseURL: BASE_URL + "api/" });
