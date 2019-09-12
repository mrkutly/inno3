class Video {
	constructor(params) {
        Object.keys(params).forEach(param => (this[param] = params[param]));
        Video.addToItemIds(this.pub_video_id)
	}

    static resetItemIds() {
        this.item_ids = []
    }
    
	static getAllItemIds() {
		this.item_ids = this.item_ids || [];
		return this.item_ids;
	}

	static addToItemIds(item_id) {
        this.item_ids = this.item_ids || [];
        return this.item_ids.push(item_id)
    }
    
    setCrawlerAuditData(data) {
        this.crawler_audit_data = data;
    }

    setCrawlerInstructionsData(data) {
        this.crawler_instructions_data = data;
    }
}

module.exports = Video