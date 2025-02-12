const otptime = async function(otpTime){
	try{
		console.log("millisecond is: " + otpTime);

		const c_date = new Date();
		let diff = (otpTime - c_date.getTime())/1000;
		diff = Math.abs(diff/60);
		console.log("Expired minutes: " + diff);

		if(diff > 2){
			return true;
		}
		return false;
	} catch(err){
		console.log(err.message);
	}
}

module.exports = { otptime }