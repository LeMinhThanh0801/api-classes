import "dotenv/config";
import App from "./app";
import { validateEnv } from "@core/utils";
import { IndexRoute } from "@modules/index";
import UsersRoute from "@modules/users/users.route";
import AuthRoute from "@modules/auth/auth.route";
import ClassroomsRoute from "@modules/classrooms/classrooms.route";

validateEnv();

const routes = [
  new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new ClassroomsRoute(),
];
const app = new App(routes);

app.listen();
