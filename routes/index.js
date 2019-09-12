const express = require('express');
const router = express.Router();
const db = require('../db/index');
const Video = require('../models/Video');

router.get('/videos', async (req, res) => {
	try {
        Video.resetItemIds()

		const { pubId, publisher } = req.query;

		const results = await db.query(
			`
                SELECT trc.videos.*
                FROM trc.videos
                WHERE trc.videos.publisher_id = ?
                ORDER BY trc.videos.create_time DESC
                LIMIT 20;
            `,
			[pubId]
		);

		if (results.code === 'PROTOCOL_CONNECTION_LOST')
			throw new Error('DB Connection was lost. Try again');

		const videos = results.map(result => new Video(result));

		const crawlerAuditResults = await db.query(
			`
                SELECT *
                FROM crawler.audit
                WHERE publisher = ?
                AND pub_item_id IN (?);
            `,
			[publisher, Video.getAllItemIds()]
		);

		if (crawlerAuditResults.code === 'PROTOCOL_CONNECTION_LOST')
			throw new Error('DB Connection was lost. Try again');

		crawlerAuditResults.forEach(result => {
			const video = videos.find(vid => vid.pub_video_id === result.pub_item_id);
			video.setCrawlerAuditData(result);
		});

		const crawlerInstructionsResults = await db.query(
			`
                SELECT *
                FROM crawler.instructions
                WHERE publisher = ?
                AND pub_item_id IN (?);
            `,
			[publisher, Video.getAllItemIds()]
		);

		if (crawlerInstructionsResults.code === 'PROTOCOL_CONNECTION_LOST')
            throw new Error('DB Connection was lost. Try again');
            
		crawlerInstructionsResults.forEach(result => {
			const video = videos.find(vid => vid.pub_video_id === result.pub_item_id);
			video.setCrawlerInstructionsData(result);
		});

		res.send(videos);
	} catch (error) {
		res.send({ error: error.message });
	}
});

module.exports = router;
