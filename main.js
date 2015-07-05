//Code Author: Aabhas Sharma

/*
	function: send_login()
	descr: 	  Send login credentials to login_form.php.
		   	  If successful login, allows user access and stores user info
		   	  in LocalStorage.
		   	  If unsuccesful login, alerts user to re-enter credentials
*/
function send_login()
{
	var uname = $("#login_username").val();
	var passwd = $("#login_password").val();

	var formData = {username: uname,
					password: passwd};

	$.ajax({
		url : "login_form.php",
		method : "POST",
		data : formData,

		success: function(response, textStatus, xhr)
		{
			if (response == "not found")
				alert("Please check credentials and try again! If not a member, please sign up.");

			// if success, decode the json
			else
			{
				//alert(response);
				var userInfo = $.parseJSON(response);

				$.each(userInfo, function(key, value)
				{
					localStorage.setItem("Altruist-CurrUser-" + key, value);
				});
				window.location.replace("profile.html");
			}
		},

		error: function(xhr, textStatus, errorThrown)
		{
			console.log("failure" + xhr.status);
		}
	});
}

/*
	function: send_update()
	descr: 	  Send updated info to update_storage.php.
		   	  If successful, updates database values with new information.
		   	  If unsuccesful, alerts user to try again at a later point of time.
*/
function send_update(uname)
{	
	var upData = {name: uname};
	$.ajax({
		url : "update_storage.php",
		method : "POST",
		data : upData,

		success: function(response, textStatus, xhr)
		{
			if (response == "update failed")
				alert("Your information couldn't be updated. Please try again later");

			else
			{
				//alert(response);
				var userInfo = $.parseJSON(response);
				 $.each(userInfo, function(key, value)
				 {
				 	localStorage.setItem("Altruist-CurrUser-" + key, value);
				 });
				//alert("reached");
				window.location.replace("profile.html");
			}
		},

		error: function(xhr, textStatus, errorThrown)
		{
			console.log("failure" + xhr.status);
		}
	});
}

/*
	function: logout()
	descr: 	  Logout of web-app.
		   	  On click, if successful, clear out LocalStorage.
		   	  If unsuccesful, do nothing.
*/
function logout()
{	
	window.onload = function()
	{
		var a = document.getElementById("logoff");
		alert("Logging out");
		a.onclick = function()
		{
			localstorage.clear();
			window.location.replace("index.html");
		}
	}
}

/*
	function: getUrlParameter()
	descr: 	  Retrieve variable values returned through the URL.
*/
function getUrlParameter(sParam)
{
    //alert(test);
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

/*
	function: get_receivers(cause1)
	descr: 	  Basis multiple paramters, get a list of receivers from the database.
			  This function also calculates distance of each receiver from the receiver
			  using the Haversine distance formula.
			Note:
			Receiver entry struct
			 ________________________________________________________
			| ID | Name | Cell | Address | Description | N/A | Cause |
			| 0  |  1   |  2   |    3    |      4      |  5  |   6   |
			|____|______|______|_________|_____________|_____|_______|

*/
function get_receivers(cause1)
{
	var user_lat = localStorage.getItem("User-lat");
	var user_long = localStorage.getItem("User-lon");
	//alert(user_long);
	user_lat = user_lat*(Math.PI/180);
	user_long = user_long*(Math.PI/180);
	var formData = {cause1: cause1,
					user_lat: user_lat,
					user_long: user_long};

	$.ajax({
		url : "receivers.php",
		method : "POST",
		data : formData,

		success: function(response, textStatus, xhr)
		{
			if (response == "not found")
				alert("Sorry. None of the receivers match this cause category.");

			// if success, decode the json
			else
			{
				var userInfo = $.parseJSON(response);
				var count = 0;
				//alert(userInfo);
				var all_recvr = [];
				$.each(userInfo, function(index, value)
				{
					all_recvr.push(value);
				});

				//Haversine distance calculation
				for(i = 0; i < all_recvr.length; i++)
				{
					//radians = degrees * (pi/180)
					var lat = all_recvr[i][4];
					var lng = all_recvr[i][5];
					lat = lat*(Math.PI/180);
					lng = lng*(Math.PI/180);

					var distance = 3959 * Math.acos( Math.cos( user_lat ) * Math.cos( lat) * Math.cos( lng - user_long ) + Math.sin( user_lat ) * Math.sin( lat));
					all_recvr[i].push(distance);
				}

				//perform the Haversine sort
				all_recvr.sort(function(a,b) { return parseFloat(a[9]) - parseFloat(b[9])});
				
				//print sorted receiver list
				$.each(userInfo, function(index, value)
				{
					var dist = Number((all_recvr[count][9]).toFixed(2));
					var index = count + 1;
					$("#recvr_li").append('<tr>'+'<td id = "curr_recvr" onclick="location_update(this)">' + index + ". " + '<span style="cursor:pointer">'												+ all_recvr[count][1] + '</span>' + '</td>'
											+ '<td>' + dist + " miles" + '</span>'+'<td>'
											+ '<td onclick="shortlist(this)">' +  '<p hidden>'+ index + ". " +'</p>' + '<span style="cursor:pointer">' + "Shortlist" + '</span>'												+ '</td>' + '</tr>'
											);
					all_recvr[count].splice(9, 1);
					count++;
				});

				localStorage["Receiver_list"] = JSON.stringify(all_recvr);
			}
		},

		error: function(xhr, textStatus, errorThrown)
		{
			console.log("failure" + xhr.status);
		}
	});
}

/*
	function: shortlist(recvr_index)
	descr: 	  Basis the receiver the user has selected to shortlist,
			  parse the webpage to take in appropriate receiver info,
			  and add to the database table for shortlisted receivers.
			  
			Note:
			Receiver entry struct
			 ________________________________________________________
			| ID | Name | Cell | Address | Description | N/A | Cause |
			| 0  |  1   |  2   |    3    |      4      |  5  |   6   |
			|____|______|______|_________|_____________|_____|_______|

*/
function shortlist(recvr_index)
{
	var recvr_id = 0;
	if(recvr_index === undefined) 
	{
		recvr_index = 99;
		recvr_id = 99;
	}
	else
	{
		var selected_recvr = recvr_index.innerHTML;
		var temp = selected_recvr.split(">");
		recvr_index = temp[1];
		recvr_index = recvr_index.split(".");
		recvr_index = recvr_index[0] - 1;
		var all_recvr = JSON.parse(localStorage["Receiver_list"]);
		recvr_id = all_recvr[recvr_index][0];
	}
	
	var uname = localStorage.getItem("Altruist-CurrUser-username")
	//alert(recvr_id);
	var formData = {
						id: recvr_id,
						user: uname
					};

	$.ajax({
		url : "shortlist.php",
		method : "POST",
		data : formData,


	success: function(response, textStatus, xhr)
		{
				
				var userInfo = $.parseJSON(response);
				//alert(userInfo);
				var shortlisted = [];
				$.each(userInfo, function(index, value)
				{
					shortlisted.push(value);
				});
				localStorage["Beneficiaries"] = JSON.stringify(shortlisted);
				if(recvr_id != 99)
					window.location.replace("shortlisted.html");
				//alert("The receiver has been shortlisted");
			//}
		},

		error: function(xhr, textStatus, errorThrown)
		{
			alert("Failed");
			console.log("failure" + xhr.status);
		}
	});
}

/*
	function: Dynamite_algorithm()
	descr: 	  Basis paramters such as distance from user, cause critera as well as income range, 
			  sort the given list using this self-designed algorithm.

*/
function Dynamite_algorithm()
{
	var user_lat = localStorage.getItem("User-lat");
	var user_long = localStorage.getItem("User-lon");
	var uname = localStorage.getItem("Altruist-CurrUser-username");
	var formData = {uname: uname,
					user_lat: user_lat,
					user_long: user_long};

	$.ajax({
		url : "recommend.php",
		method : "POST",
		data : formData,

		success: function(response, textStatus, xhr)
		{
			if (response == "not found")
				alert("Sorry. There aren't any receivers in your area yet.");

			// if success, decode the json
			else
			{
				var userInfo = $.parseJSON(response);
				var count = 0;
				//alert(userInfo);
				var causes = [];
				causes["health"] = 4;
				causes["Disabilities"] = 9;
				causes["education"] = 16;
				causes["environment"] = 25;

				var closest = [];
				$.each(userInfo, function(index, value)
				{
					closest.push(value);
				});

				//Haversine distance calculation
				for(i = 0; i < closest.length; i++)
				{
					var income = closest[i][7];
					income = income.split('-');
					income = income[0];
					income = income.split('$');
					if(!income[1]) income[1] = 1;
					income = Number(income[1]);

					var lat = closest[i][4];
					var lng = closest[i][5];
					lat = lat*(Math.PI/180);
					lng = lng*(Math.PI/180);

					var distance = 3959 * Math.acos( Math.cos( user_lat ) * Math.cos( lat) * Math.cos( lng - user_long ) + Math.sin( user_lat ) * Math.sin( lat));
					closest[i].push(distance);
					var kaidynamite = Number(income*causes[closest[i][8]]);
					closest[i].push(kaidynamite);
				}

				//perform the Haversine sort
				closest.sort(function(a,b) { return parseFloat(a[11]) - parseFloat(b[11])});
				
				var count = 0;
				
				//print sorted receiver list
				$.each(userInfo, function(index, value)
				{
					var dist = closest[count][9]; 	 
					dist = Number(dist).toFixed(2);
					var index = count + 1;
					$("#recomend_li").append('<tr>'+'<td id = "curr_recvr" onclick="location_update(this)">' + index + ". " + closest[count][1] + '</td>'
											+ '<td>' + dist + " miles" + '<td>'
											+ '<td onclick="shortlist_reco(this)">' +  '<p hidden>'+ index + ". " +'</p>' + "Shortlist" + '</td>' + '</tr>'
											);
					closest[count].splice(9, 2);
					count++;
				});

				localStorage["Recommendations"] = JSON.stringify(closest);
			}
		},

		error: function(xhr, textStatus, errorThrown)
		{
			console.log("failure" + xhr.status);
		}
	});
}

/*
	function: shortlist_reco(recvr_index)
	descr: 	  Basis the receiver the user has selected to shortlist,
			  parse the webpage to take in appropriate receiver info,
			  and add to the database table for shortlisted receivers.
			  
			  This is slightly different from the shorlist() function.
			  Here, parsing is being done on a different webpage.

			Note:
			Receiver entry struct
			 ________________________________________________________
			| ID | Name | Cell | Address | Description | N/A | Cause |
			| 0  |  1   |  2   |    3    |      4      |  5  |   6   |
			|____|______|______|_________|_____________|_____|_______|

*/
function shortlist_reco(recvr_index)
{
	var selected_recvr = recvr_index.innerHTML;
	var temp = selected_recvr.split(">");
	recvr_index = temp[1];
	recvr_index = recvr_index.split(".");
	recvr_index = recvr_index[0] - 1;

	var all_recvr = JSON.parse(localStorage["Recommendations"]);
	var recvr_id = all_recvr[recvr_index][0];
	var uname = localStorage.getItem("Altruist-CurrUser-username")

	var formData = {
						id: recvr_id,
						user: uname
					};

	$.ajax({
		url : "shortlist.php",
		method : "POST",
		data : formData,


	success: function(response, textStatus, xhr)
		{
				var userInfo = $.parseJSON(response);
				//alert(userInfo);
				var shortlisted = [];
				$.each(userInfo, function(index, value)
				{
					shortlisted.push(value);
				});
				localStorage["Beneficiaries"] = JSON.stringify(shortlisted);
				window.location.replace("shortlisted.html");
				//alert("The receiver has been shortlisted");
		},

		error: function(xhr, textStatus, errorThrown)
		{
			console.log("failure" + xhr.status);
		}
	});
}
