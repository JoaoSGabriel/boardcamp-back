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
  const categorie = req.body;
  try {
    await connection.query("INSERT INTO categories (nome) VALUES $1;", [
      categorie,
    ]);
    res.sendStatus(201);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
