import connection from "../db.js";

export async function list(req, res) {
  try {
    const list = await connection.query("SELECT * FROM games;");
    res.send(list.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function create(req, res) {
  try {
    res.send("rota de criar games");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
