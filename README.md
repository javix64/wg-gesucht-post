# WG-GESUCHT-POST

## Achtung!

Right now this is a MVP, it is still in developing process, so please, be careful using it.

## How it works?

- Rename the file `.env_example` to `.env`


- Add your username to the variable `WG_GESUCHT_USERNAME`, also add your password to the variable `WG_GESUCHT_PASSWORD`


- You need to provide the url with the corresponding filters of the city you want to get all the results in the variable `WG_GESUCHT_URL`. IMPORTANT: The view of the URL should be in `Detail view`. For example: `https://www.wg-gesucht.de/en/wg-zimmer-in-Leipzig.77.0.1.0.html?offer_filter=1&city_id=77&sort_column=0&sort_order=0&noDeact=1&categories%5B%5D=0&rent_types%5B%5D=2&sMin=13&rMax=600&img_only=1`


- Add your message into `src/scraping/wg-gesucht/helper` in the function `transformMessage`. The variable `Name` is used for contact the person that posted the Ad.


- Use `npm run start`


- Drink a coffee meanwhile you are doing nothing :)