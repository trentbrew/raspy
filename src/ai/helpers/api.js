import pocketbase from "pocketbase";
import axios from "axios";

import memory from "../memory/index.js";
import personas from "../config/personas.js";

/** @type {import('pocketbase').default} Instance of PocketBase client */
const pocketbaseInstance = new pocketbase(import.meta.env.VITE_API_URL);

/** @type {import('axios').AxiosInstance} Axios client instance */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

/** @type {Object} PocketBase client wrapper with common operations */
const pb = {
  instance: pocketbaseInstance,
  get: async (collection, id) =>
    await pocketbaseInstance.collection(collection).getOne(id),
  post: async (collection, data) =>
    await pocketbaseInstance.collection(collection).create(data),
  update: async (collection, id, data) =>
    await pocketbaseInstance.collection(collection).update(id, data),
  delete: async (collection, id) =>
    await pocketbaseInstance.collection(collection).delete(id),
};

/** @type {Object} AI operations wrapper */
const api = {
  memorize: async (memoryContent) => {
    const user_id = pb.instance.authStore.model?.id;
    const memory = await memory.synthesize(memoryContent);
    return await memory.save(prompt, user_id);
  },
  recall: async (queryPrompt) => {
    const user_id = pb.instance.authStore.model?.id;
    const user_memory = pb.instance.authStore.model?.memory;
    if (user_id && user_memory)
      return await memory.recall(user_id, user_memory);
    return null;
  },
  compare: async (prompt) => {
    const response = await client.post("/v1/compare", { prompt });
    return response.data;
  },
  embed: async (prompt) => {
    const response = await client.post("/v1/embed", { prompt });
    return response.data;
  },
  examine: async (prompt) => {
    const response = await client.post("/v1/examine", { prompt });
    return response.data;
  },
  research: async (query) => {
    const payload = {
      messages: [
        {
          role: "system",
          content: personas.researcher,
        },
        {
          role: "user",
          content: query,
        },
      ],
    };
    const response = await client.post("/v1/research", payload);
    return response.data;
  },
};

export { api, pb };
