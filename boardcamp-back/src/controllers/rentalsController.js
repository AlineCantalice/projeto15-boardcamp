import connection from '../dbStrategies/postgres.js'
import dayjs from 'dayjs'

export async function getAllRentals(req, res) {
  const { customerId, gameId } = req.query

  if (customerId) {
    const {
      rows: rentals,
    } = await connection.query(
      `SELECT rentals.*, customers.* AS customer, games.* AS game FROM rentals JOIN customers ON rentals."customerId"=customers.id JOIN games ON rentals."gameId"=games.id WHERE customers.id=$1`,
      [customerId],
    )

    return res.status(200).send(rentals)
  }
  if (gameId) {
    const {
      rows: rentals,
    } = await connection.query(
      `SELECT rentals.*, customers.* AS customer, games.* AS game FROM rentals JOIN customers ON rentals."customerId"=customers.id JOIN games ON rentals."gameId"=games.id WHERE games.id=$1`,
      [customerId],
    )

    return res.status(200).send(rentals)
  }

  const { rows: rentals } = await connection.query(
    `SELECT rentals.*, customers.* AS customer, games.* AS game FROM rentals JOIN customers ON rentals."customerId"=customers.id JOIN games ON rentals."gameId"=games.id`,
  )

  res.status(200).send(rentals)
}

export async function createRental(req, res) {
  const rental = req.body

  const {
    rows: customer,
  } = await connection.query(`SELECT * FROM customers WHERE id=$1`, [
    rental.customerId,
  ])

  const {
    rows: game,
  } = await connection.query(`SELECT * FROM games WHERE id=$1`, [rental.gameId])

  if (
    !customer[0] ||
    !game[0] ||
    rental.daysRented === 0 ||
    game.stockTotal === 0
  ) {
    return res.status(400).send('Preencha os campos corretamente!')
  }

  const rentDate = dayjs().format('YYYY-MM-DD')
  const originalPrice = parseInt(rental.daysRented) * parseInt(game[0].pricePerDay)

  await connection.query(
    `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      rental.customerId,
      rental.gameId,
      rentDate,
      rental.daysRented,
      null,
      originalPrice,
      null,
    ],
  )

  res.sendStatus(201)
}
