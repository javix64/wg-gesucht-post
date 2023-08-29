import * as fs from 'fs';
import path,{dirname, resolve} from 'path';
import {URL} from 'url';

export const acceptCookies = async (page) => {
    const modalCookies = 'cmpbox';
    const buttonAcceptCookies = '#cmpwelcomebtnyes';
    const isVisible = await page.getByRole('div',{name:modalCookies});
    if(!isVisible) return 'Not found';
    await page.locator(buttonAcceptCookies).click();
}

export const login = async (username, password, page) => {
    const loginModal = await page.evaluate(()=> fireLoginOrRegisterModalRequest('sign_in'));
    const usernameInput = '#login_email_username'; 
    const passwordInput = 'div.col-md-12:nth-child(2) > div:nth-child(2) > input:nth-child(1)'; 
    const loginButton = '#login_submit';
    await page.locator(usernameInput).fill(username)
    await page.locator(passwordInput).fill(password);
    await page.locator(loginButton).click();
}

export const totalPages = async (page) => {
    const h1 = await page.locator('h1').textContent();
    const numberOfOffers = extractNumberOfOffers(h1);
    const totalPages = Math.ceil(numberOfOffers/20);
    return totalPages;
}

export const saveUrlsInFile = (urls = []) => {
    try{
        //ToDo: it is repeated
        const folder = `.tmp/urls.json`;
        const file = new URL('.tmp/urls.json', import.meta.url).pathname;
        const existFile = fs.existsSync(file);
        if(!existFile) fs.writeFileSync(file,JSON.stringify(urls));
        const fileParsed = JSON.parse(fs.readFileSync(file));
        urls.map(url=>fileParsed.push(url));
        // avoid duplicates before writing into file.
        const urlsFiltered = fileParsed.filter((item, index) => fileParsed.indexOf(item) === index);
        fs.writeFileSync(file,JSON.stringify(urlsFiltered));
    }catch(e){
        console.info('Issue in saveUrlsFIle')
    }
}

export const deleteUrlsBeforeStart = () => {
    const folder = `.tmp/urls.json`;
    const file = new URL('.tmp/urls.json', import.meta.url).pathname;
    fs.writeFileSync(file,JSON.stringify([]));
}

export const getAdsListView = async (page) => {
    const arrayUrls = [];
    const tr = await page.locator('tr').all();
    const allTr = await Promise.all(
        tr.map(async (ad)=>{
            const lastUrl = await ad.getAttribute('adid');
            if(lastUrl!=null) {
                const sendMessageUrl = 'https://www.wg-gesucht.de/en/nachricht-senden/'
                arrayUrls.push(`${sendMessageUrl}${lastUrl}`);
            }
        })
    )
    return arrayUrls;
}

export const getAdsDetailView = async (page) => {
    const arrayUrls = [];
    const tr = await page.locator('div[data-id]').all();
    const allTr = await Promise.all(
        tr.map(async (ad)=>{
            const textAd = await ad.locator('xpath=/div/div[1]').innerText();
            const textAd2 = await ad.locator('xpath=/div/div[2]/div[3]/div[2]/div[2]/div/span[1]').innerText();
            const adHref = await ad.locator('xpath=/div/div[1]/a').getAttribute('href');
            const sendMessageUrl = 'https://www.wg-gesucht.de/en/nachricht-senden'
            const combinedUrl = `${sendMessageUrl}${adHref.replace('en/','')}`;
            if(!textAd.includes('contacted'))arrayUrls.push(combinedUrl);
        })
    )
    return arrayUrls;
}

export function extractNumberOfOffers(inputString) {
    const matches = inputString.match(/\d+/);   
    if (matches && matches.length > 0) {
      const number = parseInt(matches[0], 10);
      return number;
    } else {
      return null;
    }
}  

export const iteratePages = async (page) => {
    // const listAds = await getAdsListView(page);
    const listAds = await getAdsDetailView(page);
    const nextPageButton = await page.locator('#assets_list_pagination > ul:nth-child(1) > li:last-child').click();
    await page.waitForLoadState('domcontentloaded');
    saveUrlsInFile(listAds);
}

export const getNameFromAd = async (page) => {
    const textNotFormatted = await page.locator('.control-label').textContent();
    const textFormatted = textNotFormatted
        .replace('Send message to ','')
        .replace(':','')
        .replace(/[\n\r]+|[\s]{2,}/g, ' ')
        .replaceAll('  ', '');
    return textFormatted;
}

export const closeModalOnMessage = async(page) => {
    const acceptButtonId = '#sicherheit_bestaetigung';
    if(await page.locator(acceptButtonId).isVisible()){
        await page.locator(acceptButtonId).click();
    }
}

export const transformMessage = async (msg, name) => {
    const msgReplacedByVariables = msg.replace('[name]',name);    
    return msgReplacedByVariables;
}

export const onSendMessage = async (page, msg)=> {
    await closeModalOnMessage(page);
    const countLabels = await page.locator('.control-label').count();
    if(countLabels>1){
        console.info('AlreadySend it')
        return;
    };
    const isMessaged = await page.locator('.control-label').isVisible();
    const name = await getNameFromAd(page);
    // Check if user was contacted, if it was, pass to the next one.
    if(checkIfContactIsOnFile(name)!=true) return;
    const message = await transformMessage(msg,name);
    const textArea = await page.locator('#message_input').fill(message);
    const onClickSendButton = await page.locator('button.create_new_conversation:nth-child(1)').click();
    console.info('Message send it!');
}

export const popAndSaveFile = () => {
    //ToDo: it is repeated
    const folder = `.tmp/urls.json`;
    const fileUrl = new URL('.tmp/urls.json', import.meta.url).pathname;
    const file = fs.readFileSync(fileUrl);
    const fileParsed = JSON.parse(file);
    const lastAd = fileParsed.shift();
    fs.writeFileSync(fileUrl,JSON.stringify(fileParsed))
    return lastAd;
}

export const isFileEmpty = () => {
    const folder = `.tmp/urls.json`;
    const fileUrl = new URL('.tmp/urls.json', import.meta.url).pathname;
    const file = fs.readFileSync(fileUrl);
    const fileParsed = JSON.parse(file);
    return fileParsed.length;
}

export const checkIfUserContactedHasCreatedAnotherOffer = async (page) =>{
    await page.goto('https://www.wg-gesucht.de/en/nachrichten.html?filter_type=7');
    const allNames = [];
    let currentPage = 0;
    const lastPage = parseInt(await page.locator('#pagination_container > ul:nth-child(1) > li:nth-last-child(2)').innerText());
    // loop
    do {
        const usersContacted = await page.locator('.list_item_public_name').all();
        const allUsersContacted = await Promise.all(
            usersContacted.map(async (user)=>{
                const userName = await user.innerText();
                allNames.push(userName);
            })
        )
        await page.locator('#pagination_container > ul:nth-child(1) > li:last-child').click();
        await page.waitForLoadState('domcontentloaded');
        currentPage +=1;
    } while (currentPage < lastPage);
    saveInFile(allNames);
    // antes de enviar el mensaje, debo de recorrer el archivo y ver si encaja con el que ha hab'ia antes.
}

export const saveInFile = (content, file='usersContacted.json') => {
    //ToDo: it is repeated
    const fileUrl = new URL(`.tmp/${file}`, import.meta.url).pathname;
    fs.writeFileSync(fileUrl,JSON.stringify(content))
}

export const checkIfContactIsOnFile = (contact='',file ='usersContacted.json') => {
    const fileUrl = new URL(`.tmp/${file}`, import.meta.url).pathname;
    const data = fs.readFileSync(fileUrl);
    const contactIsIncluded = JSON.parse(data);
    const isContacted = contactIsIncluded.find((user)=>{
        if(user.includes(contact)) return true;
    })
    if(isContacted!='undefined') return true;
}

export const calcularDiferenciaEnMeses = (cadenaDeFechas)=> {
    const regex = /(\d{2}\.\d{2}\.\d{4})/g;
    const fechas = cadenaDeFechas.match(regex);
    if (fechas.length !== 2) {
        return null; // No hay suficientes fechas en la cadena
    }
    function convertirStringAFecha(fechaString) {
        const partes = fechaString.split('.');
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1;
        const anio = parseInt(partes[2], 10);

        return new Date(anio, mes, dia);
    }
    const fechaInicio = convertirStringAFecha(fechas[0]);
    const fechaFin = convertirStringAFecha(fechas[1]);
    const diferenciaEnMeses = (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 +
        fechaFin.getMonth() - fechaInicio.getMonth();
    return diferenciaEnMeses;
}