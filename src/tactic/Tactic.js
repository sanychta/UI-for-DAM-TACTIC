import Cookies from 'universal-cookie';
 

class TACTIC {

	constructor() {
		this.server_url = process.env.REACT_APP_TACTIC_SERVER_URL;
		this.site = process.env.REACT_APP_TACTIC_SITE;
		this.project = process.env.REACT_APP_TACTIC_PROJECT;
		this.check_auth_endpoint = this.server_url;
		if (this.site && this.site !== "default") this.check_auth_endpoint += "/" + this.site;
		else this.check_auth_endpoint += "/tactic";
		this.check_auth_endpoint += "/" + this.project + process.env.REACT_APP_TACTIC_CHECK_AUTH_ENDPOINT;
		
		this.cors = process.env.REACT_APP_TACTIC_CORS;
	}

	getCheckAuthEndpoint() {
		let url =  this.check_auth_endpoint 
		return url;
	}

	get_server() {
		return this.server_url;
	}

	get_site() {
		return this.site;
	}

	get_project() {
		return this.project;
	}

	logout() {
		const cookies = new Cookies();
		cookies.set('login_ticket', '');
	}

	login(username, password) {
		return new Promise( 
			(resolve, reject) => { 
				this.username = username;
				this.password = password;

				if (process.env.REACT_APP_TACTIC_DEV_LOGIN_TICKET) {
					let ticket = process.env.REACT_APP_TACTIC_DEV_LOGIN_TICKET;

					const cookies = new Cookies();
					cookies.set('login_ticket', ticket, { path: '/' });
				} else {
					let url = this.server_url + "/tactic/default/Api/";
					let body = `<?xml version="1.0"?>
						<methodCall>
							<methodName>get_ticket</methodName>
							<params>
								<param><value><string>USERNAME</string></value></param>
								<param><value><string>PASSWORD</string></value></param>
								<param><value><string>SITE</string></value></param>
							</params>
						</methodCall>`

					body = body.replace("USERNAME", username)
					body = body.replace("PASSWORD", password)
					body = body.replace("SITE", this.site)
					


					let fetch_config = {
						'method': 'POST',
							'headers': {
							'Content-Type': 'text/xml'
						},
						'body': body
					}

					if (this.cors) fetch_config['mode'] = 'cors';

					fetch(url, fetch_config)
						.then(resp => resp.text())
						.then(data => {
							let pattern = ".*<string>(.*)</string>.*";
							let re = RegExp(pattern);
							let ticket = data.match(re)[1];

							const cookies = new Cookies();
							cookies.set('login_ticket', ticket);
							resolve(ticket);
						}).catch(reject);
				}

			});
	}

  getTicket() {
	  const cookies = new Cookies();
	  return cookies.get('login_ticket'); 
  }

  _request(url) {
	  return new Promise(
	  (resolve, reject) => {
	      let fetch_config = {method: 'POST'};
	      if (this.cors) fetch_config['mode'] = 'cors';
		  
		  fetch(url, fetch_config)
	      .then(resp => resp.json().then(resolve))
	      .catch(error => reject(error));
	    }
	  );
  };

  request(method, args, kwargs) {
	
  		let login_ticket = this.getTicket();

		let url = this.server_url;
		url += "/" + this.site + "/" + this.project + "/REST";
		url += "?login_ticket=" + login_ticket;
		url += "&method=" + method;
		if (args !== null) url += "&args=" + JSON.stringify(args);
		if (kwargs !== null) url += "&kwargs=" + JSON.stringify(kwargs);

	  	return new Promise(
			(resolve, reject) => {
				this._request(url)
			  	.then(resolve)
			  	.catch(reject);
		  	}
	  	)
  	}

}

export default TACTIC;
