function _I18n(){
	this.get = function(name){
		var r = {
			"SMT": {"name": "SMT", "value": "Submitted Time"},
			"CT": {"name": "CT", "value": "Current Time"},
			"EST": {"name": "EST", "value": "Estimated Start Time"},
			"ET": {"name": "ET", "value": "End Time"},
			"SPT": {"name": "SPT", "value": "Suspended Time"},
			"PTL": {"name": "PTL", "value": "Pending Time Limit"},
			"EST=PTL": {"name": "PTL", "value": "Pending Time Limit"},
			"ST": {"name": "ST", "value": "Start Time"},
			"EET": {"name": "EET", "value": "Estimated End Time"},
			"RTL": {"name": "RTL", "value": "Run Time Limit"},
			"EET=RTL": {"name": "EET=RTL", "value": "Run Time Limit"},
			"submitted":{"name": "submitted", "value": "Submitted"},
			"run.time": {"name": "run.time", "value": "Run Time"},
			"running.time": {"name": "running.time", "value": "Running Time"},
			"pending.duration": {"name": "pending.duration", "value": "Pending Duration"},
			"suspended.duration": {"name": "suspended.duration", "value": "Suspended Duration"},
			"time.remaining": {"name": "time.remaining", "value": "Time Remaining"},
			"est.time.empty": {"name": "est.time.empty", "value": "There is no <br> estimated start time <br> available for this <br> job"},
			"eet.time.empty": {"name": "eet.time.empty", "value": "There is no <br> estimated end time <br> available for this <br> job"},
		};
		return r[name];
	}
}