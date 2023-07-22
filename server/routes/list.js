const express = require("express");
const router = express.Router();

const db = require("../database");
const tableName = "list";

/* GET */
router.get("/", (req, res) => {
    const table = db.table(tableName);
    const { date_created, board_id, position } = req.query;

    const whereCondition = {};
    if (date_created) whereCondition.date_created = date_created;
    if (board_id) whereCondition.board_id = board_id;
    if (position) whereCondition.position = position;

    table.selectAll(whereCondition, (err, data) => {
        if (err) {
            res.status(1500).json({ error: err.message });
        } else {
            res.status(200).json(data);
        }
    });
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
                    //get the item's id
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
router.delete("/:id", async (req, res) => {
    try {
        const table = db.table(tableName);
        const tableId = req.params.id;

        // get list data
        const list = await new Promise((res, rej) => {
            db.execSql(
                `SELECT * FROM ${table.name} WHERE id=${tableId}`,
                (e, data) => {
                    if (e) return rej(e);
                    else res(data[0]);
                }
            );
        });

        // delete item
        table.deleteRow({ id: tableId }, (e) => {
            if (e) res.status(500).json({ error: e });
            else res.status(204).end();
        });

        // get items where position > deleted item's position
        const toUpdate = await new Promise((res, rej) => {
            db.execSql(
                `SELECT * FROM ${table.name} WHERE board_id=${list.board_id} AND position>${list.position}`,
                (e, data) => {
                    if (e) return rej(e);
                    else res(data);
                }
            );
        });

        // -1 their positions
        const sql = `UPDATE ${table.name} SET position=position-1 WHERE board_id=${list.board_id} AND position>${list.position}`;
        db.execSql(sql, (e) => {
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
        const { title, position } = req.body;

        const itemExists = await new Promise((res, rej) => {
            db.execSql(
                `SELECT * FROM ${table.name} WHERE id=${tableId}`,
                (e, data) => {
                    if (e) return rej(e);
                    else res(data[0]);
                }
            );
        });

        if (!itemExists) {
            res.status(404)
                .json({ message: `${tableName} item doesn't exist` })
                .end();
            return;
        }

        // moving items around if required
        if (position !== undefined && position !== itemExists.position) {
            let sql = `UPDATE ${table.name} `;
            if (itemExists.position < position)
                sql += `SET position=position-1 WHERE board_id=${itemExists.board_id} AND (position BETWEEN ${itemExists.position} AND ${position})`;
            else if (itemExists.position > position)
                sql += `SET position=position+1 WHERE board_id=${itemExists.board_id} AND (position BETWEEN ${position} AND ${itemExists.position})`;

            db.execSql(sql, (e) => {
                if (e) res.status(500).json({ error: e });
            });
        }

        // updating the item
        table.updateRowNew(
            {
                title: title || itemExists.title,
                position:
                    position !== undefined ? position : itemExists.position,
            },
            { id: tableId },
            (e) => {
                if (e) res.status(500).json({ error: e });
                else res.status(204).end();
            }
        );
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;
