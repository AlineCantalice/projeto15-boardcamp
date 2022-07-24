import connection from '../dbStrategies/postgres.js'

export async function getAllGames(req, res) {
  const { rows: games } = await connection.query('SELECT * FROM games')

  res.status(200).send(games)
}

export async function createGame(req, res) {
  const game = req.body

  const { rows: existGame } = await connection.query(
    `SELECT * FROM games WHERE name=('${game.name}')`,
  )

  if (existGame.length > 0) {
    return res.status(409).send('Jogo já existe!')
  }

  await connection.query(
    `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${game.name}', '${game.image}', '${game.stockTotal}', '${game.categoryId}', '${game.pricePerDay}')`,
  )

  res.sendStatus(201)
}
