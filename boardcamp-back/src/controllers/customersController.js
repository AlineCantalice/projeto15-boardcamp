import connection from '../dbStrategies/postgres.js'
import dayjs from 'dayjs'

export async function getAllCustomers(req, res) {
  const { cpf } = req.query

  if (cpf) {
    const {
      rows: customers,
    } = await connection.query(`SELECT * FROM customers WHERE cpf LIKE $1`, [
      `${cpf}%`,
    ])

    return res.status(200).send(customers)
  }

  const { rows: customers } = await connection.query('SELECT * FROM customers')

  res.status(200).send(customers)
}

export async function getCustomerById(req, res) {
  const { id } = req.params

  const { rows: customer } = await connection.query(
    `SELECT * FROM customers WHERE id=${id}`,
  )

  if (customer[0]) {
    return res.status(200).send(customer[0])
  }

  return res.status(404).send('Cliente não cadastrado!')
}

export async function createCustomer(req, res) {
  const customer = req.body

  const date = dayjs(customer.birthday).format('YYYY-MM-DD')

  const cpfRegex = new RegExp(/[0-9]{11}/)
  const phoneRegex = new RegExp(/^(?=(?:.{10}|.{11})$)[0-9]*$/)
  const dateRegex = new RegExp(
    /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/,
  )

  if (
    !customer.name ||
    !cpfRegex.test(customer.cpf) ||
    !phoneRegex.test(customer.phone) ||
    !dateRegex.test(date)
  ) {
    return res.status(400).send('Os campos não estão preenchidos corretamente!')
  }

  const { rows: customers } = await connection.query(`SELECT * FROM customers`)

  if (customers.some((el) => el.cpf == customer.cpf)) {
    return res.status(409).send('Cliente já cadastrado!')
  }

  await connection.query(
    `INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${customer.name}', '${customer.phone}', '${customer.cpf}', '${customer.birthday}')`,
  )

  res.sendStatus(201)
}

export async function updateCustomer(req, res) {
  const customer = req.body
  const { id } = req.params

  const date = dayjs(customer.birthday).format('YYYY-MM-DD')

  const cpfRegex = new RegExp(/[0-9]{11}/)
  const phoneRegex = new RegExp(/^(?=(?:.{10}|.{11})$)[0-9]*$/)
  const dateRegex = new RegExp(
    /^(19[0-9]{2}|2[0-9]{3})-(0[1-9]|1[012])-([123]0|[012][1-9]|31)$/,
  )

  if (
    !customer.name ||
    !cpfRegex.test(customer.cpf) ||
    !phoneRegex.test(customer.phone) ||
    !dateRegex.test(date)
  ) {
    return res.status(400).send('Os campos não estão preenchidos corretamente!')
  }

  const { rows: customers } = await connection.query(`SELECT * FROM customers`)

  if (customers.some((el) => el.cpf == customer.cpf)) {
    await connection.query(
      `UPDATE customers SET name = '${customer.name}', phone = '${customer.phone}', cpf = '${customer.cpf}', birthday = '${date}' WHERE id = ${id}`,
    )
  
    return res.sendStatus(200)
  }

  res.status(409).send('CPF não cadastrado!')
}
