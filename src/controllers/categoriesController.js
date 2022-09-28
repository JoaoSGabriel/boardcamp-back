export async function list(req, res) {
  try {
    res.send("rota de listar categories");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function create(req, res) {
  try {
    res.send("rota de criar categories");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
