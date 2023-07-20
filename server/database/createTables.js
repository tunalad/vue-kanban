const db = require("./index");

function createTables() {
    // Board table
    db.createTable(
        "board",
        {
            title: "TEXT NOT NULL",
            password: "TEXT NOT NULL",
            date_created: "INTEGER NOT NULL", // unix timestamp
        },
        (e) => {
            if (e) console.error("DBHelper createTable('board') ERROR:", e);
        },
    );

    // List table
    db.createTable(
        "list",
        {
            title: "TEXT NOT NULL",
            date_created: "INTEGER NOT NULL", // unix timestamp
            position: "INTEGER NOT NULL",

            board_id: "INTEGER NOT NULL",
        },
        {
            foreignKeys: {
                board_id: { references: "board(id)", onDelete: "CASCADE" },
            },
        },
        (e) => {
            if (e) console.error("DBHelper createTable('list') ERROR:", e);
        },
    );

    // Card table
    db.createTable(
        "card",
        {
            title: "TEXT NOT NULL",
            description: "TEXT NOT NULL",
            date_created: "INTEGER NOT NULL", // unix timestamp
            position: "INTEGER NOT NULL",

            list_id: "INTEGER NOT NULL",
        },
        {
            foreignKeys: {
                list_id: { references: "list(id)", onDelete: "CASCADE" },
            },
        },
        (e) => {
            if (e) console.error("DBHelper createTable('card') ERROR:", e);
        },
    );

    // Label table
    db.createTable(
        "label",
        {
            title: "TEXT NOT NULL",
            color: "TEXT NOT NULL",
            date_created: "INTEGER NOT NULL", // unix timestamp

            board_id: "INTEGER NOT NULL",
        },
        {
            foreignKeys: {
                board_id: { references: "board(id)", onDelete: "CASCADE" },
            },
        },
        (e) => {
            if (e) console.error("DBHelper createTable('label') ERROR:", e);
        },
    );

    // Card_label table
    db.createTable(
        "card_label",
        {
            card_id: "INTEGER NOT NULL",
            label_id: "INTEGER NOT NULL",
        },
        {
            foreignKeys: {
                card_id: { references: "card(id)", onDelete: "CASCADE" },
                label_id: { references: "label(id)", onDelete: "CASCADE" },
            },
        },
        (e) => {
            if (e)
                console.error("DBHelper createTable('card_label') ERROR:", e);
        },
    );
}

module.exports = createTables;
