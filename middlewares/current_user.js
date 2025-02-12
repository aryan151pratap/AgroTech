module.exports = function current_user(data){
	const regex = /[a-zA-Z]/;
	if(!regex.test(data)){
		return {phonenumber : data};
	} else {
		return {email : data};
	}
}
