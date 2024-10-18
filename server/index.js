import ConnectDB from "./dbConnection/db_connect.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
    path: '.env'
});

const PORT = process.env.PORT || 5000;

ConnectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("Error in app:", error);
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is listening at ${PORT}`);
    });
})
.catch((error) => {
    console.log("MongoDB connection failed. Error:", error);
});
