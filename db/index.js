require('dotenv').config();
const mysql = require('mysql')
const util = require('util')

const pool = mysql.createPool({
    connectionLimit: 50,
    user: process.env.PS_DB_USER, 
    host: process.env.PS_DB_HOST,
    database: process.env.PS_DB_DATABASE,
    password: process.env.PS_DB_PASSWORD,
    port: process.env.PS_DB_PORT,
})

const getConnection = util.promisify(pool.getConnection).bind(pool)

module.exports = {
    /** 
     * @param sql {String} - a string of sql
     * @param values {Array} (optional) - an array of values to bind to the sql string
    */
    query: async (sql, values) => {
        try {
            values = values || undefined;
            const connection = await getConnection()
            const query = util.promisify(connection.query).bind(connection)
            const res = await query(sql, values)
            connection.release()
            return res
        } catch (error) {
            return error
        }
    }
}