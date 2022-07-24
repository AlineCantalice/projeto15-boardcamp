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

  /*console.log(rentals)

  const rentalsJoin = {
    ...rentals[0],
    customer: rentals.map((value) => value.name),
    game: rentals.map(
      (value) => 
      value.name
    ),
  }

  console.log(rentalsJoin)*/

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
  const originalPrice =
    parseInt(rental.daysRented) * parseInt(game[0].pricePerDay)

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

export async function returnRental(req, res) {
  const { id } = req.params

  const {
    rows: rental,
  } = await connection.query('SELECT * FROM rentals WHERE id=$1', [id])

  if (!rental[0]) {
    return res, sendStatus(404)
  }

  if (rental[0].returnDate) {
    return res.status(400)
  }

  const returnDate = dayjs().format('YYYY-MM-DD')
  const deadline = dayjs().add(rental[0].daysRented, 'day').format('YYYY-MM-DD')

  const differDays = returnDate.diff(deadline, 'day')
  console.log(differDays)

  if (differDays > 0) {
    const delayFee = rental[0].delayFee * differDays
    await connection.query(
      `UPDATE rentals SET "returnDate"='$1', "delayFee"=$2 WHERE id=$3`,
      [returnDate, delayFee, id],
    )

    return res.sendStatus(200)
  }

  await connection.query(`UPDATE rentals SET "returnDate"='$1' WHERE id=$2`, [
    returnDate,
    id,
  ])

  res.sendStatus(200)
}

export async function deleteRental(req, res) {
  const { id } = req.params

  const {
    rows: rental,
  } = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id])

  if (!rental[0]) {
    return res.sendStatus(404)
  }

  if (rental[0].returnDate !== null) {
    return res.sendStatus(400)
  }

  await connection.query(`DELETE FROM rentals WHERE id=$1`, [id])

  res.sendStatus(200)
}
