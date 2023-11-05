import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
from selenium.webdriver.firefox.options import Options


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


for case_folder in [i for i in os.listdir('./docs-processed') if os.path.isdir('./docs-processed/' + i) and os.path.exists('./docs-processed/' + i + '/meta.txt')]:
    case_path = f'./docs-processed/{case_folder}'
    meta = {}
    with open(f'{case_path}/meta.txt', 'r') as f:
        for line in f.readlines():
            key, value = line.split(': ')
            meta[key.strip()] = value.strip()

    driver.get(meta['link'])

    for item in driver.find_element(By.XPATH, '//table[@id="simpleDetailsTable"]').find_elements(By.XPATH, ".//tr"):
        value = item.find_element(By.XPATH, './td').text.strip()
        key = item.find_element(By.XPATH, './th').text.strip().replace(' ', '_').lower()
        meta[key] = value

    with open(f'{case_path}/meta.txt', 'w') as f:
        for key, value in meta.items():
            f.write(f'{key}: {value}\n')
