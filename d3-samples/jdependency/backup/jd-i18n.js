function JDI18n(){
	this.get = function(name){
		var r = {
			"job.status.pending": "Pending",
			"job.status.running": "Running",
			"job.status.done": "Done",
			"job.status.exited": "Exited",
			"job.status.suspended": "Suspended",
			"job.status.waiting": "Waiting",
			"job.status.onhold": "On Hold",
		}
		return r[name];
	}
}