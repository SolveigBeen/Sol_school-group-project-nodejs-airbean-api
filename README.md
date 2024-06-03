# school-group-project-nodejs-airbean-api

US: Som inloggad användare vill jag kunna se min orderhistorik.
GET http://localhost:8000/orders/<cutomer Id>
RESPONSE ( If not logged in):
 "You need to be logged in to view the orderhistory"

Login as a user eg:  
POST http://localhost:8000/customer/login   
body:{
  "username": "sol"
}
GET http://localhost:8000/orders/<cutomer Id>
RESPONSE:
{
	"order": [
		{
			"customerID": "111",
			"date": "2024-05-30 18:50",
			"products": "kaffe",
			"quantity": 4,
			"pricePerUnit": 35,
			"_id": 11
		},
		{
			"customerID": "111",
			"date": "2024-05-30 18:50",
			"products": "kaffe",
			"quantity": 4,
			"pricePerUnit": 35,
			"_id": 5555
		},



US: Som användare vill jag på bekräftelsesidan se när min beställning levereras.
GET http://localhost:8000/confirmation/<order Id>
Delivery time anges som fiktivt +20 min från lagd order.
RESPONSE: 
{
	"customerID": "222",
	"date": "2024-05-30 18:50",
	"products": "kaffe",
	"quantity": 4,
	"pricePerUnit": 35,
	"_id": 2222,
	"deliveryTime": "19:10"
}