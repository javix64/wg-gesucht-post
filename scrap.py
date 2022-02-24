import csv, sys, time
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
#inputs para username y password
username=str(sys.argv[1])
password=str(sys.argv[2])

web = webdriver.Firefox()
web.get('https://www.wg-gesucht.de/en/wg-zimmer-in-Kiel.71.0.1.0.html?category=0&city_id=71&rent_type=0&sort_column=0&noDeact=1&dTo=1628287200&sMin=15&rMax=450&img=1&rent_types[0]=0')
time.sleep(1)

#clicar en aceptar todas las cookies
#web.find_element_by_id('cmpbntyestxt').click()
time.sleep(1)

#lanza modal, escribe user, pass y se logea
web.execute_script("fireLoginOrRegisterModalRequest('sign_in');ga('send', 'event', 'service_navigation', 'login', '1st_level')")
time.sleep(1)
button_user=web.find_element_by_xpath('//*[@id="login_email_username"]')
button_user.send_keys(username)
button_pass=web.find_element_by_xpath('//*[@id="login_password"]')
button_pass.send_keys(password)
web.find_element_by_id('login_submit').click()
time.sleep(2)

#ir a la web que queremos para enviar los scripts

file = open('links_visited.txt','a')


# primera parte

pagina=5
for i in range(1,pagina):
    print('web n{pagina}')
    pagina_url=str(i)
    url=f"""https://www.wg-gesucht.de/en/wg-zimmer-in-Kiel.71.0.1.{pagina_url}.html?category=0&city_id=71&rent_type=0&sort_column=0&noDeact=1&dTo=1628287200&sMin=15&rMax=450&img=1&rent_types[0]=0"""
    web.get(url)
    list_url=[]
    cards=web.find_elements_by_xpath("//h3[@class='truncate_title noprint']/a")
    page_links = web.find_elements_by_xpath("//ul[@class='pagination pagination-sm']/li/a")
    last_link = page_links[-1]
    #coge los href, remplaza la url para guardar directamente la url del mensaje
    for i in cards:
        href=str(i.get_attribute('href'))
        list_url.append(href.replace('https://www.wg-gesucht.de/en','https://www.wg-gesucht.de/en/nachricht-senden'))
    for i in list_url:
        file.writelines(i+"\n")
    time.sleep(3)
#segunda parte, entramos en cada pagina que hemos guardado y enviamos los mensajes. 
#sicherheit_bestaetigung
    print('Start to write messages')
with open('links_visited.txt','r') as links_file:
    for i in links_file:
        try:
            print('message n{i}')
            web.get(i)
            label_name=str(web.find_element_by_xpath("//label[@class='control-label']/b").text)
            name=str(label_name.replace("Send message to ","").replace(":",""))
            write_message = web.find_element_by_id('message_input')
            time.sleep(2)
            mensaje=f"""
Hallo {name}!

YOUR MESSAGE HERE

"""
            write_message.send_keys(mensaje)
            web.find_element_by_xpath("//div[@class='hidden-xs']/button[1]").click()
            time.sleep(10)
        except:
            print('error elemento no encontrado')
            time.sleep(2)