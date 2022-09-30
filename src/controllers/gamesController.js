import connection from "../db.js";
import { postGamesSchema } from "../schemas/schemas.js";

export async function list(req, res) {
  const filter = req.query.name + "%";

  try {
    if (req.query.name) {
      const filterList = await connection.query(
        `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.name LIKE ($1)`,
        [filter]
      );
      return res.send(filterList.rows);
    }

    const list = await connection.query(
      `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id;`
    );
    res.send(list.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function create(req, res) {
  const validation = postGamesSchema.validate(req.body);
  if (validation.error) return res.sendStatus(400);

  try {
    const exist = await connection.query(
      "SELECT * FROM categories WHERE id = $1;",
      [req.body.categoryId]
    );
    if (exist.rows.length === 0) return res.sendStatus(400);

    const name = await connection.query("SELECT * FROM games WHERE name = $1", [
      req.body.name,
    ]);
    if (name.rows.length !== 0) return res.sendStatus(409);

    await connection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5);`,
      [
        req.body.name,
        req.body.image,
        req.body.stockTotal,
        req.body.categoryId,
        req.body.pricePerDay,
      ]
    );
    return res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
