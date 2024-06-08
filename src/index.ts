const express = require("express");
const app = express();
const port = 3000;
import userRoutes from "./routes/userRoutes";

app.get("/", (req: any, res: any) => {
  res.json({ message: "Hello Expo app!" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://0.0.0.0:${port}`);
});

app.use(express.json());
app.use("/users", userRoutes);
