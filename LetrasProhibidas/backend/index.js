import { httpServer } from "./app.js"

const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
  console.log("Server listening on PORT", port)
});