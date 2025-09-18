import fs from "fs";
import path from "path";
import handlebars from "handlebars";

export function renderTemplate(templateName: string, context: Record<string, any>) {
  const filePath = path.resolve(__dirname, "templates", `${templateName}.hbs`);
  const source = fs.readFileSync(filePath, "utf8");
  const template = handlebars.compile(source);
  return template(context);
}

