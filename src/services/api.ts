import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_THE_MOVIE_URL,
  params: {
    api_key: process.env.NEXT_PUBLIC_THE_MOVIE_API_KEY,
  },
});

export default api;
