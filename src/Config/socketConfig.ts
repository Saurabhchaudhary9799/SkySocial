import {io , Socket} from "socket.io-client"

export const socket:Socket = io("http://13.232.21.29:8000", {
    withCredentials: true,
  });

