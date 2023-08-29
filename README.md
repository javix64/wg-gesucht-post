# WG-GESUCHT-POST

## Achtung!

Right now this is a MVP, it is still in developing process, so please, be careful using it.

## How it works?

- First run: `npm run start:app`

- Send a POST request with the next body data: `email`, `password`, `msg`, `url`
    - Email: your personal email used by Wg-Gesucht
    - Password: Your password from Wg-gesucht
    - Msg: Message that you want to send to the offers. Right now, `msg` only accept `[name]` as variable, this will replace by the original name that is on the offer. For example: `Hey [name]!!, I liked so much your place and I would like to visit...`
    - Url: the url with the corresponding filters of the city you want to get all the results. For example: `https://www.wg-gesucht.de/en/wg-zimmer-in-Leipzig.77.0.1.0.html?offer_filter=1&city_id=77&sort_column=0&sort_order=0&noDeact=1&categories%5B%5D=0&rent_types%5B%5D=2&sMin=13&rMax=600&img_only=1`

- Drink a coffee meanwhile you are doing nothing :)

## ToDo:
