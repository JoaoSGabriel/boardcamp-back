import dayjs from "dayjs";
import connection from "../db.js";

export async function list(req, res) {
  const filterCustomerId = req.query.customerId;
  const filterGameId = req.query.gameId;

  try {
    const listRentals = await connection.query(
      `SELECT rentals.*, customers.id AS "customersID", customers.name, games.id AS "gameID", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals join customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id`
    );

    if (req.query.customerId) {
      const listRentals = await connection.query(
        `SELECT rentals.*, customers.id AS "customersID", customers.name, games.id AS "gameID", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals join customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."customerId" = $1;`,
        [filterCustomerId]
      );

      for (let i = 0; i < listRentals.rows.length; i++) {
        listRentals.rows[i] = {
          id: listRentals.rows[i].id,
          customerId: listRentals.rows[i].customerId,
          gameId: listRentals.rows[i].gameId,
          rentDate: listRentals.rows[i].rentDate,
          daysRented: listRentals.rows[i].daysRented,
          returnDate: listRentals.rows[i].returnDate,
          originalPrice: listRentals.rows[i].originalPrice,
          delayFee: listRentals.rows[i].delayFee,
          customer: {
            id: listRentals.rows[i].customersID,
            name: listRentals.rows[i].name,
          },
          game: {
            id: listRentals.rows[i].gameID,
            name: listRentals.rows[i].gameName,
            categoryId: listRentals.rows[i].categoryId,
            categoryName: listRentals.rows[i].categoryName,
          },
        };
      }
      return res.send(listRentals.rows);
    } else if (req.query.gameId) {
      const listRentals = await connection.query(
        `SELECT rentals.*, customers.id AS "customersID", customers.name, games.id AS "gameID", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals join customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id WHERE rentals."gameId" = $1;`,
        [filterGameId]
      );

      for (let i = 0; i < listRentals.rows.length; i++) {
        listRentals.rows[i] = {
          id: listRentals.rows[i].id,
          customerId: listRentals.rows[i].customerId,
          gameId: listRentals.rows[i].gameId,
          rentDate: listRentals.rows[i].rentDate,
          daysRented: listRentals.rows[i].daysRented,
          returnDate: listRentals.rows[i].returnDate,
          originalPrice: listRentals.rows[i].originalPrice,
          delayFee: listRentals.rows[i].delayFee,
          customer: {
            id: listRentals.rows[i].customersID,
            name: listRentals.rows[i].name,
          },
          game: {
            id: listRentals.rows[i].gameID,
            name: listRentals.rows[i].gameName,
            categoryId: listRentals.rows[i].categoryId,
            categoryName: listRentals.rows[i].categoryName,
          },
        };
      }
      return res.send(listRentals.rows);
    } else {
      const listRentals = await connection.query(
        `SELECT rentals.*, customers.id AS "customersID", customers.name, games.id AS "gameID", games.name AS "gameName", games."categoryId", categories.name AS "categoryName" FROM rentals join customers ON rentals."customerId" = customers.id JOIN games ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id;`
      );

      for (let i = 0; i < listRentals.rows.length; i++) {
        listRentals.rows[i] = {
          id: listRentals.rows[i].id,
          customerId: listRentals.rows[i].customerId,
          gameId: listRentals.rows[i].gameId,
          rentDate: listRentals.rows[i].rentDate,
          daysRented: listRentals.rows[i].daysRented,
          returnDate: listRentals.rows[i].returnDate,
          originalPrice: listRentals.rows[i].originalPrice,
          delayFee: listRentals.rows[i].delayFee,
          customer: {
            id: listRentals.rows[i].customersID,
            name: listRentals.rows[i].name,
          },
          game: {
            id: listRentals.rows[i].gameID,
            name: listRentals.rows[i].gameName,
            categoryId: listRentals.rows[i].categoryId,
            categoryName: listRentals.rows[i].categoryName,
          },
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
      rentDate: dayjs().format("YYYY-MM-DD"),
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
