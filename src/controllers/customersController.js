import connection from "../db.js";
import { clientSchema } from "../schemas/schemas.js";

export async function list(req, res) {
  const filter = req.query.cpf + "%";
  try {
    if (req.query.cpf) {
      const filterList = await connection.query(
        "SELECT * FROM customers WHERE cpf LIKE ($1)",
        [filter]
      );
      console.log("salve");
      return res.send(filterList.rows);
    }

    const list = await connection.query("SELECT * FROM customers;");
    res.send(list.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getByID(req, res) {
  const cpf = req.params.id;

  try {
    const client = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [cpf]
    );
    if (client.rows.length === 0) return res.sendStatus(404);
    res.send(client.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function updateCustomer(req, res) {
  const id = req.params.id;

  const validation = clientSchema.validate(req.body);
  if (validation.error) return res.sendStatus(400);

  try {
    const client = await connection.query(
      "SELECT * FROM customers WHERE id = $1",
      [id]
    );
    const sameCPF = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [req.body.cpf]
    );
    if (sameCPF.rows.length >= 1 && client.rows[0].cpf !== sameCPF.rows.cpf) {
      return res.sendStatus(409);
    } else {
      await connection.query(
        `UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id = $5`,
        [req.body.name, req.body.phone, req.body.cpf, req.body.birthday, id]
      );
      res.sendStatus(200);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function create(req, res) {
  const validation = clientSchema.validate(req.body);
  if (validation.error) return res.sendStatus(400);

  try {
    const client = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1",
      [req.body.cpf]
    );
    if (client.rows.length !== 0) {
      return res.sendStatus(409);
    } else {
      await connection.query(
        "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
        [req.body.name, req.body.phone, req.body.cpf, req.body.birthday]
      );
      res.sendStatus(201);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
