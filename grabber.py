
# https://postcodes.io/

import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
from selenium.webdriver.firefox.options import Options


def any_in(a, b):
    return any(i in b for i in a)


options = Options()
options.set_preference("browser.download.folderList", 2)
options.set_preference("browser.download.manager.showWhenStarting", False)
options.set_preference("browser.download.dir", '/Users/ivan/Hackathons/anthropic/Anthropic-Brothers/docs')
options.set_preference("browser.download.lastDir", '/Users/ivan/Hackathons/anthropic/Anthropic-Brothers/docs')
options.set_preference("browser.helperApps.neverAsk.openFile","application/pdf,text/csv,application/vnd.ms-excel")
options.set_preference("browser.helperApps.neverAsk.saveToDisk", "application/pdf application/msword, application/csv, application/ris, text/csv, image/png, application/pdf, text/html, text/plain, application/zip, application/x-zip, application/x-zip-compressed, application/download, application/octet-stream");
options.set_preference("browser.download.useDownloadDir", True)
options.set_preference("browser.helperApps.alwaysAsk.force", False)
options.set_preference("services.sync.prefs.sync.browser.download.manager.showWhenStarting", False)
options.set_preference("browser.download.manager.showAlertOnComplete", False)
options.set_preference("pdfjs.disabled", True)

driver = webdriver.Firefox(options=options)

driver.get('https://publicaccess.wycombe.gov.uk/idoxpa-web/search.do?action=simple&searchType=Application')
sleep(5)
driver.find_element(By.XPATH, '//input[@id="simpleSearchString"]').send_keys('patio')
driver.find_element(By.XPATH, '//input[@class="button primary recaptcha-submit"]').click()
sleep(5)
links = []

# for _ in range(15):
#     try:
#         driver.find_element(By.XPATH, '//a[text()="Next"]').click()
#         sleep(3)
#     except:
#         break

for _ in range(25):
    try:
        driver.find_element(By.XPATH, '//a[text()="Next"]').click()
        sleep(5)
        links += [e.get_attribute('href') for e in driver.find_elements(By.XPATH, '//li[@class="searchresult"]/a')]
    except:
        break

for link in links:
    driver.get(link)
    sleep(5)
    case_ref = driver.title.split('|')[0].strip().replace('/', '-')
    case_status = driver.find_element(By.XPATH, '//span[@class="caseDetailsStatus"]').text.replace(' ', '-')

    case_dir = f'./docs/{case_ref}'
    os.mkdir(case_dir)
    meta = {'status': case_status, 'link': link}
    
    for item in driver.find_element(By.XPATH, '//table[@id="simpleDetailsTable"]').find_elements(By.XPATH, ".//tr"):
        value = item.find_element(By.XPATH, './td').text.strip()
        key = item.find_element(By.XPATH, './th').text.strip().replace(' ', '_').lower()
        meta[key] = value

    with open(f'{case_dir}/meta.txt', 'w') as f:
        for key, value in meta.items():
            f.write(f'{key}: {value}\n')

    try:
        driver.find_element(By.XPATH, '//a[@id="tab_documents"]').click()
    except:
        continue  # no documents tab

    for table_row in driver.find_elements(By.XPATH, '//table[@id="Documents"]/tbody/tr'):
        if any_in(['Consultee Comment', 'Application Form', 'Supporting Documents', 'Background Papers', 'Consultations'], table_row.text):
            prefix = table_row.find_element(By.XPATH, './td[2]').text.replace(' ', '-')
            link_e = table_row.find_element(By.XPATH, './td[5]/a')
            if link_e.get_attribute('href').endswith('.pdf') or link_e.get_attribute('href').endswith('.docx'):
                link_e.click()
                sleep(5)
                try:
                    download_name = [i for i in os.listdir('./docs') if os.path.isfile('./docs/'+i)][0]
                    os.rename('./docs/'+download_name, f'{case_dir}/{prefix}--{case_status}--{download_name}')
                except:
                    pass


# for e in driver.find_elements(By.XPATH, '//table[@id="Documents"]/tbody/tr/td[5]/a'):
#     if e.get_attribute('href').endswith('.pdf') or e.get_attribute('href').endswith('.docx'):
#         e.click()
#         sleep(3)

# for handle in driver.window_handles[-1:0:-1]:
#     driver.switch_to.window(handle)
#     driver.find_element(By.XPATH, '//button[@id="download"]').click()
#     driver.close()
