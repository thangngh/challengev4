import { Config } from "core/config";
import { Application } from 'express';

declare global {
    var CONFIG: Config;
    var APP: Application;
}

export {}