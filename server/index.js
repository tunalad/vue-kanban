const express = require("express");
const routes = require("./routes");
const cors = require("cors");

const createTables = require("./database/createTables");

const app = express();
const PORT = 1337;

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(PORT, async () => {
	try {
		createTables();
		console.log(`Server is running on http://localhost:${PORT}/`);
	} catch (e) {
		console.error("Server ERROR: \n", e);
	}
});
