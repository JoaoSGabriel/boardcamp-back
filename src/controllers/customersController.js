import connection from "../db.js";

export async function list(req, res) {
  try {
    const list = await connection.query("SELECT * FROM customers;");
    res.send(list.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getByID(req, res) {
  try {
    res.send("rota de listar customers por ID");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function updateCustomer(req, res) {
  try {
    res.send("rota de atualizar customers");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function create(req, res) {
  try {
    res.send("rota de criar customers");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
