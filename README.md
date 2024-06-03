# school-group-project-nodejs-airbean-api

US: Som inloggad användare vill jag kunna se min orderhistorik.
GET http://localhost:8000/orders/<cutomer Id>
If not logged in, the result is a message: "You need to be logged in to view the orderhistory"

US: Som användare vill jag på bekräftelsesidan se när min beställning levereras.
GET http://localhost:8000/confirmation/<order Id>
Delivery time anges som fiktivt +20 min från lagd order.

## Endpoints

#### POST

##### /cart

###### Request

`localhost:8000/cart`

```
{
  "product": "6ymMjHWMpLGChmJ6", // Mandatory, productID. Checks menu.db if the product exist.
  "cartID": "", // Optional, new cart if empty, existing cart if it exists.
  "customerID": "", // Optional, guest if empty.
  "quantity": 1 // Optional, gets 1 if empty.
}
```

###### Response

```
{
    "customerID": "",
    "product": [
        {
            "title": "Mocha",
            "desc": "En söt mocha med choklad och espresso.",
            "price": 55,
            "_id": "6ymMjHWMpLGChmJ6",
            "quantity": 1
        }
    ],
    "_id": "yHYB6NvAuAXa3CW2",
    "instructions": "cartID would've been saved to session/cookie to be included in the next call"
}
```

#### GET

##### /cart/:id

`localhost:8000/cart/yHYB6NvAuAXa3CW2`

###### Response

```
{
    "customerID": "",
    "product": [
        {
            "title": "Mocha",
            "desc": "En söt mocha med choklad och espresso.",
            "price": 55,
            "_id": "6ymMjHWMpLGChmJ6",
            "quantity": 1
        },
        {
            "title": "Americano",
            "desc": "En espresso utspädd med varmt vatten.",
            "price": 35,
            "_id": "SjwGh9EVaYWtIzs7",
            "quantity": 2
        }
    ],
    "_id": "yHYB6NvAuAXa3CW2",
    "price": 125
}
```
