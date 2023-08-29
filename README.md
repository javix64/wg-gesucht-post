# WG-GESUCHT-POST

## Achtung!

Right now this is a MVP, it is still in developing process, so please, be careful using it.

## Motivation

I did this tool in Python, two years ago when I moved to Kiel. Now that I have moved to Leipzig I thought it was a good idea to re-do it enterily in JS to test my skills.

## How it works?

### First way (recommended)

- First run: `npm run start`

This command run a PM2 process that execute two processes: `npm run client:dev` & `node ./src/app`. The first one will execute the client side, second one will execute the backend part.

Client side can be visited by: `localhost:5137`

When client is loaded:

- Email: Your WG-Gesucht email.

- Password: Your WG-Gesucht password.

- Message: The message that you want to send to the offered flats. Right now, `msg` only accept `[name]` as variable, this will replace by the original name that is on the offer. For example: `Hey [name]!!, I liked so much your place and I would like to visit...`

- Url: the url with the corresponding filters of the city you want to get all the results. For example: `https://www.wg-gesucht.de/en/wg-zimmer-in-Leipzig.77.0.1.0.html?offer_filter=1&city_id=77&sort_column=0&sort_order=0&noDeact=1&categories%5B%5D=0&rent_types%5B%5D=2&sMin=13&rMax=600&img_only=1`
    - `IMPORTANT: The URL must be in detail view if it is not, it will not work`

- Drink a coffee meanwhile you are doing nothing :)

## ToDo

### Client
- Create router for react
- Create navbar
- Create about page
- Create app page
    - Create loading until you get the response from backend.

### Backend

- Handle captcha for wg-gesucht
- Handle errors
- Be able to handle different views of pages