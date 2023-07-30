const express = require("express");
const router = express.Router();

const db = require("../database");
const tableName = "label";

/* GET */
router.get("/", (req, res) => {
    try {
        const table = db.table(tableName);

        table.selectAll(req.query , (err, data) => {
            if (err) {
                res.status(1500).json({ error: err.message });
            } else {
                res.status(200).json(data);
            }
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.get("/:id", (req, res) => {
    try {
        const table = db.table(tableName);
        const itemId = req.params.id;

        table.selectAll({ id: itemId }, (e, data) => {
            if (e) res.status(500).json({ error: err.message });
            else res.status(200).json(data);
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

/* POST */
router.post("/", (req, res) => {
    try {
        const table = db.table(tableName);
        const date_created = Date.now();

        table.insertRow(
            {
                ...req.body,
                date_created: date_created,
            },
            (e) => {
                if (e)
                    res.status(500).json({
                        error: `Failed to create ${tableName} item.`,
                    });
                else {
                    const conditions = { date_created: date_created };

                    table.selectAll(conditions, (err, data) => {
                        if (err) {
                            res.status(500).json({
                                error: `Failed to retrieve the created ${tableName} item.`,
                            });
                        } else {
                            const responseData = {
                                message: `${tableName} item created successfully.`,
                                data: data,
                            };

                            res.status(201).json(responseData);
                        }
                    });
                }
            }
        );
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

/* DELETE */
router.delete("/:id", (req, res) => {
    try {
        const table = db.table(tableName);
        const tableId = req.params.id;

        table.deleteRow({ id: tableId }, (e) => {
            if (e) res.status(500).json({ error: e });
            else res.status(204).end();
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

/* PATCH */
router.patch("/:id", async (req, res) => {
    try {
        const table = db.table(tableName);
        const tableId = req.params.id;
        const updateData = req.body;

        const itemExists = await new Promise((res, rej) => {
            db.execSql(
                `SELECT * FROM ${table.name} WHERE id=${tableId}`,
                (e, data) => {
                    if (e) return rej(e);
                    else res(data[0]);
                }
            );
        });

        if (!itemExists)
            res.status(404).json({
                message: `${tableName} item doesn't exist`,
            });
        else {
            const updatedFields = {};
            for (const key in itemExists) {
                if (updateData.hasOwnProperty(key))
                    updatedFields[key] = updateData[key];
                else updatedFields[key] = itemExists[key];
            }

            table.updateRowNew(updatedFields, { id: tableId }, (error) => {
                if (error) {
                    res.status(500).json({ error });
                } else {
                    res.status(204).end();
                }
            });
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;
