import { Module } from "../module-core";
import database from "./database";
import common from "./common";
import info from "./info";
import documents from "./documents";
import documentTypes from "./document-types";

export default new Module(
  documents,
  documentTypes,
  info,
  database,
  common,
)