const { client } = require("./config/database");

async function getSugestByItemId(req, res) {
  const { id, limit } = req.params;

  try {
    const result = await client.query(
      `
        SELECT train_purchases.item_id, 
        COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () AS percentage
        FROM train_sessions
        INNER JOIN train_purchases ON train_sessions.session_id = train_purchases.session_id
        WHERE train_sessions.item_id = $1
        GROUP BY train_purchases.item_id
        ORDER BY percentage DESC
        LIMIT $2;
      `,
      [id, limit]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { getSugestByItemId };
