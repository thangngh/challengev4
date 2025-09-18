import path from "path";

const handlebarOptions = {
  viewEngine: {
    extname: ".hbs",
    layoutsDir: path.resolve("./templates/"),
  },
  viewPath: path.resolve("./templates/"),
  extName: ".hbs",
};

export default handlebarOptions;