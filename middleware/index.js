import upload_file from "./upload_file.js";

import { Router } from "express";

export default function () {
  let api = Router();

  api.post("/submit", upload_file);

  return api;
}
