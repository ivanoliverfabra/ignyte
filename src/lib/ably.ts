import { Realtime } from "ably";

export const client = new Realtime.Promise({ authUrl: "/api/ably", });

export const space = async () => {

}