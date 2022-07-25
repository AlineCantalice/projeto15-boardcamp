import connection from '../dbStrategies/postgres.js'
import dayjs from 'dayjs'

export async function getAllRentals(req, res) {
  const { customerId, gameId } = req.query

  const {
    rows: rentalsDetails,
  } = await connection.query(`SELECT rentals.*, customers.name as "customerName", games.name as "gameName", games."categoryId", categories.name as "categoryName"
        FROM rentals 
        JOIN customers 
        ON rentals."customerId"=customers.id 
        JOIN games 
        ON rentals."gameId"=games.id
        JOIN categories 
        ON "games"."categoryId"=categories.id`)

  let filteredRentals = []
  if (customerId) {
    filteredRentals = rentalsDetails.filter(
      (item) => item.customerId == customerId,
    )
  } else if (gameId) {
    filteredRentals = rentalsDetails.filter((item) => item.gameId == gameId)
  } else {
    filteredRentals = rentalsDetails
  }

  const result = filteredRentals.map((item) => {
    return {
      id: item.id,
      customerId: item.customerId,
      gameId: item.gameId,
      rentDate: item.rentDate,
      daysRented: item.daysRented,
      returnDate: item.returnDate,
      originalPrice: item.originalPrice,
      delayFee: item.delayFee,
      customer: {
        id: item.customerId,
        name: item.customerName,
      },
      game: {
        id: item.gameId,
        name: item.gameName,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
      },
    }
  })

  res.status(200).send(result)
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
    rental.daysRented == 0 ||
    game.stockTotal == 0
  ) {
    return res.status(400).send('Preencha os campos corretamente!')
  }

  const rentDate = dayjs().format('YYYY-MM-DD')
  const originalPrice =
    parseInt(rental.daysRented) * parseInt(game[0].pricePerDay)

  await connection.query(
    `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "originalPrice") VALUES ($1, $2, $3, $4, $5)`,
    [
      rental.customerId,
      rental.gameId,
      rentDate,
      parseInt(rental.daysRented),
      parseInt(originalPrice),
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

  if (rental[0].returnDate !== null) {
    return res.status(400)
  }

  const returnDate = dayjs().format('YYYY-MM-DD')
  const deadline = dayjs().add(rental[0].daysRented, 'day').format('YYYY-MM-DD')

  const differDays = dayjs().diff(deadline, 'day')

  if (differDays > 0) {
    const delayFee = rental[0].delayFee * differDays
    await connection.query(
      `UPDATE rentals SET "returnDate"='${returnDate}', "delayFee"=${delayFee} WHERE id=${id}`,
    )

    return res.sendStatus(200)
  }

  await connection.query(
    `UPDATE rentals SET "returnDate"='${returnDate}', "delayFee"=0 WHERE id=${id}`,
  )

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

  if (rental[0].returnDate === null) {
    return res.sendStatus(400)
  }

  await connection.query(`DELETE FROM rentals WHERE id=$1`, [id])

  res.sendStatus(200)
}
