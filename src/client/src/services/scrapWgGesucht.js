import { instance } from "./axios";

export const scrapWgGesucht = (data) => {
  instance({
    method: "POST",
    data
  })
  .then((res) => {
    console.info("posted data:", res.data);
  })
  .catch((err) => {
    console.info("error", err);
  });
};
