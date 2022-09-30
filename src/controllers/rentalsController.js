import dayjs from "dayjs";
import connection from "../db.js";

export async function list(req, res) {
  const filterCustomerId = req.query.customerId;
  const filterGameId = req.query.gameId;

  try {
    if (req.query.customerId) {
      const listRentals = await connection.query(
        `SELECT * FROM rentals WHERE "customerId" = $1;`,
        [filterCustomerId]
      );

      for (let i = 0; i < listRentals.rows.length; i++) {
        const customer = await connection.query(
          "SELECT id, name FROM customers WHERE id = $1",
          [listRentals.rows[i].customerId]
        );

        const game = await connection.query(
          `SELECT games.id, games.name, games."categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.id = $1;`,
          [listRentals.rows[i].gameId]
        );

        listRentals.rows[i] = {
          ...listRentals.rows[i],
          customer: customer.rows[0],
          game: game.rows[0],
        };
      }

      return res.send(listRentals.rows);
    } else if (req.query.gameId) {
      const listRentals = await connection.query(
        `SELECT * FROM rentals WHERE "gameId" = $1;`,
        [filterGameId]
      );

      for (let i = 0; i < listRentals.rows.length; i++) {
        const customer = await connection.query(
          "SELECT id, name FROM customers WHERE id = $1",
          [listRentals.rows[i].customerId]
        );

        const game = await connection.query(
          `SELECT games.id, games.name, games."categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.id = $1;`,
          [listRentals.rows[i].gameId]
        );

        listRentals.rows[i] = {
          ...listRentals.rows[i],
          customer: customer.rows[0],
          game: game.rows[0],
        };
      }

      return res.send(listRentals.rows);
    } else {
      const listRentals = await connection.query(`SELECT * FROM rentals;`);

      for (let i = 0; i < listRentals.rows.length; i++) {
        const customer = await connection.query(
          "SELECT id, name FROM customers WHERE id = $1",
          [listRentals.rows[i].customerId]
        );

        const game = await connection.query(
          `SELECT games.id, games.name, games."categoryId", categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id WHERE games.id = $1;`,
          [listRentals.rows[i].gameId]
        );

        listRentals.rows[i] = {
          ...listRentals.rows[i],
          customer: customer.rows[0],
          game: game.rows[0],
        };
      }

      return res.send(listRentals.rows);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function rent(req, res) {
  try {
    const existClient = await connection.query(
      "SELECT * FROM customers WHERE id = $1",
      [req.body.customerId]
    );
    if (existClient.rows.length === 0) return res.sendStatus(400);

    const existGame = await connection.query(
      "SELECT * FROM games WHERE id = $1",
      [req.body.gameId]
    );
    if (existGame.rows.length === 0) return res.sendStatus(400);

    if (req.body.daysRented < 1) return res.sendStatus(400);

    const game = await connection.query(`SELECT * FROM games WHERE id = $1;`, [
      req.body.gameId,
    ]);

    const rent = {
      customerId: req.body.customerId,
      gameId: req.body.gameId,
      rentDate: dayjs().format("MM-DD-YYYY"),
      daysRented: req.body.daysRented,
      returnDate: null,
      originalPrice: req.body.daysRented * game.rows[0].pricePerDay,
      delayFee: null,
    };

    const isAvailable = await connection.query(
      `SELECT "returnDate" FROM rentals WHERE "gameId" = $1`,
      [req.body.gameId]
    );

    isAvailable.rows.map((value) => {
      if (value.returnDate === null) {
        game.rows[0].stockTotal--;
      }
    });

    if (game.rows[0].stockTotal > 0) {
      await connection.query(
        `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          rent.customerId,
          rent.gameId,
          rent.rentDate,
          rent.daysRented,
          rent.returnDate,
          rent.originalPrice,
          rent.delayFee,
        ]
      );
      return res.sendStatus(201);
    } else {
      return res.sendStatus(400);
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function returnRental(req, res) {
  const id = req.params.id;

  try {
    const rental = await connection.query(
      "SELECT * FROM rentals WHERE id = $1",
      [id]
    );
    if (rental.rows.length === 0) return res.sendStatus(404);
    if (rental.rows[0].returnDate !== null) return res.sendStatus(400);

    const todayDate = dayjs().format("YYYY-MM-DD");
    const date1 = new Date(rental.rows[0].rentDate);
    const date2 = new Date(dayjs().format("MM-DD-YYYY"));
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let fee = 0;
    if (diffDays > rental.rows[0].daysRented) {
      fee =
        (diffDays - rental.rows[0].daysRented) *
        (rental.rows[0].originalPrice / rental.rows[0].daysRented);
    }

    await connection.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3`,
      [todayDate, fee, id]
    );

    res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function destroy(req, res) {
  const id = req.params.id;

  try {
    const rental = await connection.query(
      "SELECT * FROM rentals WHERE id = $1",
      [id]
    );
    if (rental.rows.length === 0) return res.sendStatus(404);
    if (rental.rows[0].returnDate === null) return res.sendStatus(400);

    await connection.query("DELETE FROM rentals WHERE id = $1", [id]);
    res.sendStatus(200);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
