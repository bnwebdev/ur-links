import { Module } from "../module-core/module";
import database from "../module-core/database";
import i18nJs from "../module-core/i18n-js";
import common from "./common";
import info from "./info";
import documents from "./documents";
import documentTypes from "./document-types";
import handlerPages from "./handlerPages";
import formatters from "./formatters";

export default new Module(
  documents,
  documentTypes,
  formatters,
  info,
  common,
  database,
  i18nJs,
  handlerPages,
)