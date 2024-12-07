import { io } from "socket.io-client";
export const BASE_URL = import.meta.env.VITE_ENV === "development" ? import.meta.env.VITE_BASEURL : import.meta.env.VITE_PRODURL;
export const socket = io(`${BASE_URL}`, {
    withCredentials: true,
});
