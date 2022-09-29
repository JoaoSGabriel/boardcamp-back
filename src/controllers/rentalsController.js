import connection from "../db.js";

export async function list(req, res) {
  try {
    const list = await connection.query("SELECT * FROM rentals;");
    res.send(list.rows);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function rent(req, res) {
  try {
    res.send("rota de alugar rentals");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function returnRental(req, res) {
  try {
    res.send("rota de retornar aluguel rentals");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function destroy(req, res) {
  try {
    res.send("rota de cancelar rentals");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
