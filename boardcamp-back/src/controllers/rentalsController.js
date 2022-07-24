import connection from '../dbStrategies/postgres.js'

export async function getAllRentals(req, res) {
  const { rows: rentals } = await connection.query(`SELECT * FROM rentals`)

  res.status(200).send(rentals)
}
