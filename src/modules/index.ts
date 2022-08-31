import { Module } from "../module-core";
import database from "./database";
import common from "./common";
import info from "./info";
import documents from "./documents";

export default new Module(
  documents,
  info,
  database,
  common,
)