import app from "./app.js";
import "./database.js";

async function main() {
    try {
        app.listen(4000)
        console.log("SERVER LISTENING IN PORT 4000")
    } catch (error) {
        console.error("error al inicial el servidor: ", error)
    }
}

main();