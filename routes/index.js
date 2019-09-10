const express = require('express')
const router = express.Router()
const db = require ('../db/index')

router.get('/videos/:publisherId', async (req, res) => {
    try {
        const {publisherId} = req.params
        const results = await db.query(`
            SELECT * FROM trc.videos
            WHERE publisher_id = ?
            LIMIT 100;
        `, [publisherId])

        if (results.code === 'PROTOCOL_CONNECTION_LOST') throw new Error ("DB Connection was lost. Try again")
        res.send(results)
    } catch (error) {
        
    }
})


module.exports = router

// SELECT v.*, a.* FROM
// trc.videos AS v
// INNER JOIN trc.publishers AS p ON v.publisher_id = p.id
// INNER JOIN crawler.audit AS a ON p.name = a.publisher
// WHERE publisher_id = ${ pubId }
// LIMIT 10;