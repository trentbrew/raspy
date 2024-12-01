import llm from "./llm";
import { api } from "../helpers/api";

import write from "./write";
import rewrite from "./rewrite";
import summarize from "./summarize";
import elaborate from "./elaborate";
import suggest from "./suggest";
import probe from "./probe";
import research from "./research";
import devilsAdvocate from "./devilsAdvocate";

const checkStatus = async () => await llm.checkModelAvailability();

export default {
  checkStatus,
  write,
  rewrite,
  probe,
  suggest,
  elaborate,
  summarize,
  research,
  devilsAdvocate,
};
