import { Module } from "../module-core";
import links from "./links";
import database from "./database";
import common from "./common";
import info from "./info";

export default new Module(
  links,
  info,
  database,
  common,
)