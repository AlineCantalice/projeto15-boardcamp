import connection from '../dbStrategies/postgres.js'

export async function getAllCategories(req, res) {
  const { rows: categories } = await connection.query(
    'SELECT * FROM categories',
  )

  res.status(200).send(categories)
}

export async function createCategory(req, res) {
  const { name } = req.body

  if (!name) {
    return res.status(400).send('O campo precisa ser preenchido!')
  }

  const { rows: existCategory } = await connection.query(
    `SELECT * FROM categories`,
  )

  if (existCategory.some((el) => el.name.toLowerCase() == name.toLowerCase())) {
    return res.status(409).send('Categoria já existe!')
  }

  await connection.query(`INSERT INTO categories (name) VALUES ('${name}')`)

  res.sendStatus(201)
}
