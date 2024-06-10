# Airbean-API 

## Project Description ##
Examinerande uppgift i kurs Backend med NodeJs för YH utbildning Frontendutveckling på Folkuniversitetet.
Uppgiftenbestår av två delar, en första del som görs i grupp och en andra del som gör individuellt.

### Del 1 ###

Utveckling av backend funktionalitet för ett API till en webbapp kallad Airbean. 
Följande funktionalitet ingår:

####  Inlogg ####
* användare ska kunna skapa konto
* användare ska kunna logga in

####  Meny ####
* presentation av tillgängliga varor med pris ska finnas.

####  Varukorg ####
* användare ska kunna lägga vara från meny i en varukorg
* användare ska kunna se innehållet i varukorg
* användar ska kunna ta bort vara från varukorg

####  Order ####
* användare ska kunna lägga en order med innehållet i varukorgen
* uppskattad/beräknad tid för leverans ska anges i order-bekräftelse
* inloggad användare ska kunna se historik för tidigare beställningar

####  About ####
* information om företaget ska ges.

APIt använder följande databaser:
* menu   -  namn på varor, beskrivning, pris, id
* customers    - kund-id, användarnamn, e-mail, password, telofonnummer
* cart  - kund-id, produkter i varukorgen, total pris, cart-id.
* orders   - kund-id, produkter, total pris, order-datum, beräknad leveranstid, order-id
* company

### Del 2 ###
* Följande funktioner ska kunna göras endast av person med 'admin'rättighet:
    * Nya produkter ska kunna läggas till i menyn. Egenskapen 'createdAt' ska läggas till
    * Befintliga produkter i menyn ska kunna modifieras. Egenskapen 'modifeidAt' ska läggas till
    * Produkt från menyn ska kunna deletas.
    * Felmeddelande ska returneras vid behov.
    * Kampanjerbjudande ska kunna skapas och sparas i egen databas.
    * Varor i kampanjerbjudande måste valideras.

Utveckling av admin-gränssnitt för att hantera menyn

## Installation ##

Du behöver göra en clone eller fork av git-repot.
Installera node-modules:

`npm install`

För att köra APIt:

`npm run app.js`

eller om Nodemon finns installerat:

`npm run dev`

## Test del 1 ##

Testa api-anrop genom Insomnia eller Postman.

### 1.1 Som användare vill jag kunna skapa ett konto ###

#### POST - /customer/register
##### Request
```
{
    "username": "sol",
    "password": "password",
    "email": "sol@be.se",
    "phone": "0123456789"
}
```
##### Response
```
{
    "message": "User registered successfully",
    "user": {
        "username": "sol",
        "email": "sol@b.se",
        "password": "password",
        "phone": "0731234567",
        "_id": "FqNGfFzk1n2oLK2g"
    }
}
```

### 1.2. Som användare vill jag kunna logga in ###
#### POST - /customer/login
##### Request
```
{
    "username": "sol",
    "password": "password"
}
```
##### Response
```
{
    "message": "Login successful",
    "user": {
        "username": "sol",
        "password": "password",
        "email": "sol@be.se",
        "phone": "0123456789",
        "_id": "FqNGfFzk1n2oLK2g"
	}
}
```

### 1.2.1 Som användare vill jag kunna logga ut ###
#### POST - /customer/logout
###### Response
```
{
	"message": "Logout successful"
}
```
### 1.2.2 Som användare vill jag kunna ta bort/deleta ett användarkonto. ###
#### DELETE - /customer/delete/<id>
###### Response
```
{
	"message": "User removed from database"
}
```

### 3. Som användare vill jag se meny med alla kaffesorter som går att beställa ###
#### GET - /menu
###### Response
```
[
    {
        "title": "Cortado",
        "desc": "En cortado med lika delar espresso och varm mjölk.",
        "price": 33,
        "_id": "0Gu3mPAbONk1hy4P"
    },
    {
        "title": "Flat White",
        "desc": "En platt vit med silkeslen mikroskum och stark espresso.",
        "price": 46,
        "_id": "3IBqddqDtbAtIi2E"
    },
    [...]
```


### 4. Som användare vill jag kunna lägga kaffesort från meny i en kundkorg ###
#### POST - /cart
###### Request
```
{
  "products": [
    { "title": "Mocha", "quantity": 2 },
    { "title": "Bryggkaffe", "quantity": 3 }
   ]
}
```
###### Response
```
{
	"message": "Cart created",
	"cart": {
		"products": [
			{
				"title": "Espresso",
				"price": 25,
				"quantity": 2,
				"totalPrice": 50
			},
			{
				"title": "Bryggkaffe",
				"price": 25,
				"quantity": 3,
				"totalPrice": 75
			}
		],
		"totalSum": 125,
		"_id": "VaOxjZgcAqHGDg0G"
	}
```
### 5. Som administratör vill jag se samtliga kundkorgar ###
Admin role är inte kopplad till detta fn.
#### GET - /cart/   ####
###### Response ###### 
 ```
{
	"carts": [
		{
			"products": [
				{
					"title": "Mocha",
					"price": 55,
					"quantity": 2,
					"totalPrice": 110
				},
				{
					"title": "Bryggkaffe",
					"price": 25,
					"quantity": 1,
					"totalPrice": 25
				}
			],
			"totalSum": 135,
			"_id": "Pnx5OBONxfOKDsHC"
		},
        {
			"products": [
				{
					"title": "Mocha",
					"price": 55,
					"quantity": 1,
					"totalPrice": 55
				}
			],
			"totalSum": 55,
			"_id": "zn7lPVJJ7r0Fm0tO"
		}
 ```

### 5. Som administratör vill jag  kunna deleta kundkorg ###
Admin role är inte kopplad till detta fn.
#### DELETE - /cart/id   ####
###### Response ###### 
 ```{
	"message": "Cart removed."
}
 ```
### 5. Som användare vill jag se innehåll i kundkorg ###
Som id används cart-id. Återfås genom att först visa alla kundkorgar (US-1.6).
#### GET - /cart/:id ####
###### Response ###### 
```
{
	"cart": {
		"products": [
			{
				"title": "Mocha",
				"price": 55,
				"quantity": 2,
				"totalPrice": 110
			},
			{
				"title": "Bryggkaffe",
				"price": 25,
				"quantity": 1,
				"totalPrice": 25
			}
		],
		"totalSum": 135,
		"_id": "Pnx5OBONxfOKDsHC"
	}
}
```

### 6. Som användare vill jag kunna uppdatera kundkorg ###
Uppdatering gäller lägga till vara, ta bort vara, eller ändra antal. Skickas som body-request.
#### PUT - /cart/id
###### Request
```
		{
			"products": [
				{
					"title": "Mocha",
					"quantity": 2
				},
				{
					"title": "Bryggkaffe",
					"quantity": 3
				},
					{
					"title": "Espresso",
					"quantity": 1
				}
				]
		}
```
##### Response
```
{
	"message": "Cart updated",
	"cart": {
		"cart": 1,
		"products": [
			{
				"title": "Mocha",
				"price": 55,
				"quantity": 2,
				"totalPrice": 110
			},
			{
				"title": "Bryggkaffe",
				"price": 25,
				"quantity": 3,
				"totalPrice": 75
			},
			{
				"title": "Espresso",
				"price": 25,
				"quantity": 1,
				"totalPrice": 25
			}
		],
		"totalSum": 210
	}
}
```

### 7. Som användare vill jag kunna skapa en order med varorna i kundkorgen. Om användaren ej är inloggad krävs att användaren även bifogar mail-adress och telefonnummer. ###
#### POST - /orders
##### Request
###### Guest
```
{
   "cartID": "TeHTFotxCFzconZo",
  "guestInfo": {
    "email": "guest@example.com",
    "phone": "1234567890"
  }
}
```
###### User
```
{
  "customerID": "DzbWOAIZTDQUyoQB",
  "cartID": "Acwd7ENmZXDGozIg",
}
```
##### Response
```
{
	"message": "Order placed successfully",
	"order": {
		"customerID": "y4aahnkxzrOUTiJ1",
		"cartID": "TeHTFotxCFzconZo",
		"cartProducts": [
			{
				"title": "Mocha",
				"price": 55,
				"quantity": 1,
				"totalPrice": 55
			},
			{
				"title": "Bryggkaffe",
				"price": 25,
				"quantity": 3,
				"totalPrice": 75
			}
		],
		"totalSum": 130,
		"date": "2024-06-10T10:49:47.701Z",
		"estimatedDelivery": "13:09",
		"_id": "YgtFeq4OcWsHuXxl"
	}
}
```

### 8. Som användare vill få information om när ordern levereras. ###
#### GET - /orders/confirmation/:id    (order-id)
##### Response
```
{
    "customerID": "kFgt740aCqbHJLbC",
    "cartID": "x3gCLt7e1PLXBelE",
    "cartProducts": [
        {
            "title": "Americano",
            "desc": "En espresso utspädd med varmt vatten.",
            "price": 35,
            "_id": "SjwGh9EVaYWtIzs7",
            "quantity": 2
        }
    ],
    "date": "2024-06-03 14:28:01",
    "estimatedDelivery": "2024-06-03 14:48:01",
    "_id": "G3sS0UTlMmYN5arH",
    "deliveryTime": "14:48"
}
```

### 9. Som inloggad användare ska jag kunna se orderhistorik för alla tidigare köp jag gjort. ###
Logga in som i punkt 2.
#### GET - /orders/:id   
##### Response
```
{
    "order": [
        {
            "customerID": "COwTqeN5KqmJB5wB",
            "date": "2024-05-30 18:50",
            "products": "kaffe",
            "quantity": 4,
            "pricePerUnit": 35,
            "_id": 11
        },
        {
            "customerID": "COwTqeN5KqmJB5wB",
            "date": "2024-05-30 18:50",
            "products": "kaffe",
            "quantity": 4,
            "pricePerUnit": 35,
            "_id": 5555
        },
        {
            "customerID": "COwTqeN5KqmJB5wB",
            "date": "2024-05-30 18:50",
            "products": "kaffe",
            "quantity": 4,
            "pricePerUnit": 35,
            "_id": 11111
        }
    ]
}
```

### 10. Som användare vill jag kunna läsa mer om företaget. ###
#### GET - /info
##### Response
```
{
    "info": "AirBean levererar kaffe med hjälp av drönare direkt till din dörr via en smidig app. Vi kombinerar avancerad teknologi med en passion för kaffe för en unik och effektiv upplevelse. Våra eldrivna drönare är energieffektiva och minskar utsläppen jämfört med traditionella leveransfordon. Optimerade leveransrutter minskar dessutom onödiga flygningar. Vi erbjuder högkvalitativt kaffe från certifierade ekologiska och fair trade-odlare. Detta säkerställer en etisk produktion och en överlägsen smak i varje kopp. Välj AirBean för en hållbar och bekväm kaffeupplevelse med gott samvete."
}
```

## Test del 2 ##

### 2.1. Som användare vill jag kunna logga in med rollen "admin" och få access till speciella operationer på sidan. ###
#### POST - /customer/login  ####
##### Request  ##### 
```
{
  "username": "Ada Admin", 
	"password": "password"
}
```
##### Response  ##### 
```
{
	"message": "Login successful",
	"user": {
		"username": "admin",
		"password": "password",
		"email": "adm@ba.se",
		"phone": "012",
		"role": "admin",
		"_id": "1tGyd9vve7pNaHuf"
	}
}
```
### 2.2. Som admin vill jag kunna lägga in ny produkt på menyn ###
#### POST - /menu  ####
##### Request  ##### 
```
{
		"title": "Bryggarekaffe",
		"desc": "En kopp med husets bryggmalet.",
		"price": 25
	}
```
##### Response ##### 
```
{
	"message": "Menu item added successfully",
	"item": {
		"title": "Bryggarekaffe",
		"desc": "En kopp med husets bryggmalet.",
		"price": 25,
		"createdAt": "2024-06-08T17:59:45.402Z",
		"_id": "yfU4UjEmgEhMpuVH"
	}
}
```
### 2.3. Som admin vill jag kunna ändra innehållet för ny produkt på menyn ###

#### POST - /menu/Bryggarekaffe ####
##### Request #####
 ```
{
		"desc": "En kopp med husets bryggmalet.",
		"price": 32
	}
``` 
 ##### Response #####
``` 
{
	"message": "Menu item added successfully",
	"item": {
		"title": "Bryggarekaffe",
		"desc": "En stor kopp med husets bryggmalet.",
		"price": 32,
		"createdAt": "2024-06-09T11:35:26.166Z"
	}
}
``` 

### 2.4. Som admin vill jag kunna ta bort en produkt från menyn ###
#### DELETE - /menu/Bryggarekaffe ####
##### Response #####
```
{
	"message": "Menu item deleted successfully"
}
```
  
  
  






