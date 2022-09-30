import connection from "../db.js";

export async function list(req, res) {
  try {
    const list = await connection.query("SELECT * FROM categories;");
    res.send(list.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function create(req, res) {
  const categorie = req.body.name;
  console.log(categorie);

  if (!categorie) return res.sendStatus(400);

  try {
    const exist = await connection.query(
      "SELECT * FROM categories WHERE name = $1;",
      [categorie]
    );
    if (exist.rows.length === 0) {
      await connection.query("INSERT INTO categories (name) VALUES ($1);", [
        categorie,
      ]);
      return res.sendStatus(201);
    } else {
      return res.sendStatus(409);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
