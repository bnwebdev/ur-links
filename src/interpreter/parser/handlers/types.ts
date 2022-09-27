import { LexemType } from "../../lexer";
import { ParseType } from "../constants";
import { Handler } from "../types";

export type TypedHandler = Handler<LexemType, ParseType>