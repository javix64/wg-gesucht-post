import * as fs from "fs";
import path, { dirname, resolve } from "path";
import { URL } from "url";

export const transformMessage = async (msg, name) => {
  const msgReplacedByVariables = msg.replace("[name]", name);
  return msgReplacedByVariables;
};

export const saveUrlsInFile = (urls = []) => {
  try {
    //ToDo: it is repeated
    const folder = `.tmp/urls.json`;
    const file = new URL(".tmp/urls.json", import.meta.url).pathname;
    const existFile = fs.existsSync(file);
    if (!existFile) fs.writeFileSync(file, JSON.stringify(urls));
    const fileParsed = JSON.parse(fs.readFileSync(file));
    urls.map((url) => fileParsed.push(url));
    // avoid duplicates before writing into file.
    const urlsFiltered = fileParsed.filter(
      (item, index) => fileParsed.indexOf(item) === index
    );
    fs.writeFileSync(file, JSON.stringify(urlsFiltered));
  } catch (e) {
    console.info("Issue in saveUrlsFIle");
  }
};

export const deleteUrlsBeforeStart = () => {
  const folder = `.tmp/urls.json`;
  const file = new URL(".tmp/urls.json", import.meta.url).pathname;
  fs.writeFileSync(file, JSON.stringify([]));
};

export function extractNumberOfOffers(inputString) {
  const matches = inputString.match(/\d+/);
  if (matches && matches.length > 0) {
    const number = parseInt(matches[0], 10);
    return number;
  } else {
    return null;
  }
}

export const popAndSaveFile = () => {
  //ToDo: it is repeated
  const folder = `.tmp/urls.json`;
  const fileUrl = new URL(".tmp/urls.json", import.meta.url).pathname;
  const file = fs.readFileSync(fileUrl);
  const fileParsed = JSON.parse(file);
  const lastAd = fileParsed.shift();
  fs.writeFileSync(fileUrl, JSON.stringify(fileParsed));
  return lastAd;
};

export const isFileEmpty = () => {
  const folder = `.tmp/urls.json`;
  const fileUrl = new URL(".tmp/urls.json", import.meta.url).pathname;
  const file = fs.readFileSync(fileUrl);
  const fileParsed = JSON.parse(file);
  return fileParsed.length;
};
export const saveInFile = (content, file = "usersContacted.json") => {
  //ToDo: it is repeated
  const fileUrl = new URL(`.tmp/${file}`, import.meta.url).pathname;
  fs.writeFileSync(fileUrl, JSON.stringify(content));
};

export const checkIfContactIsOnFile = (
  contact = "",
  file = "usersContacted.json"
) => {
  const fileUrl = new URL(`.tmp/${file}`, import.meta.url).pathname;
  const data = fs.readFileSync(fileUrl);
  const contactIsIncluded = JSON.parse(data);
  const isContacted = contactIsIncluded.find((user) => {
    if (user.includes(contact)) return true;
  });
  if (isContacted != "undefined") return true;
};

export const calcularDiferenciaEnMeses = (cadenaDeFechas) => {
  const regex = /(\d{2}\.\d{2}\.\d{4})/g;
  const fechas = cadenaDeFechas.match(regex);
  if (fechas.length !== 2) {
    return null; // No hay suficientes fechas en la cadena
  }
  function convertirStringAFecha(fechaString) {
    const partes = fechaString.split(".");
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const anio = parseInt(partes[2], 10);

    return new Date(anio, mes, dia);
  }
  const fechaInicio = convertirStringAFecha(fechas[0]);
  const fechaFin = convertirStringAFecha(fechas[1]);
  const diferenciaEnMeses =
    (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 +
    fechaFin.getMonth() -
    fechaInicio.getMonth();
  return diferenciaEnMeses;
};

export const replaceOfferUrlForSendMessageUrl = (notFormatedUrl) => {
  const sendMessageUrl = "https://www.wg-gesucht.de/en/nachricht-senden";
  const combinedUrl = `${sendMessageUrl}${notFormatedUrl.replace("en/", "")}`;
  return combinedUrl;
};
