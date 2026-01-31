from selenium import webdriver
from selenium.webdriver.common.by import By  # pyright: ignore[reportMissingImports]
from selenium.webdriver.common.keys import Keys
import time
import os
import re

# -------------------------------------------------------
# 🔹 Function to extract phone numbers and messages from VCF
# -------------------------------------------------------
def parse_vcf(vcf_file):
    contacts = []
    with open(vcf_file, "r", encoding="utf-8") as f:
        contact = {}
        for line in f:
            line = line.strip()

            if line.startswith("BEGIN:VCARD"):
                contact = {}

            elif line.startswith("TEL"):
                # Extract digits only from phone numbers
                phone = re.sub(r"[^\d+]", "", line.split(":")[-1])
                contact["Phone"] = phone

            elif line.startswith("NOTE:"):  # optional field for messages
                contact["Message"] = line.split("NOTE:")[-1].strip()

            elif line.startswith("END:VCARD"):
                if "Phone" in contact:
                    if "Message" not in contact:
                        contact["Message"] = "Hello! 👋"
                    contact["Attachment"] = ""  # default no attachment
                    contacts.append(contact)

    return contacts

# -------------------------------------------------------
# 🔹 Load contacts from VCF file
# -------------------------------------------------------
vcf_path = r"D:\Construction\contacts.vcf"
contacts = parse_vcf(vcf_path)

print(f"📇 Loaded {len(contacts)} contacts from {vcf_path}")

# -------------------------------------------------------
# 🔹 Start Chrome and open WhatsApp Web
# -------------------------------------------------------
driver = webdriver.Chrome()
driver.get("https://web.whatsapp.com/")
input("🔒 Scan the QR code on WhatsApp Web, then press Enter here to continue...")

# -------------------------------------------------------
# 🔹 Loop through each contact
# -------------------------------------------------------
for contact in contacts:
    phone = str(contact["Phone"]).strip()
    message = str(contact["Message"]).strip()
    attachment = str(contact.get("Attachment", "")).strip()

    print(f"📨 Sending message to {phone}...")

    # Open chat for that phone number
    driver.get(f"https://web.whatsapp.com/send?phone={phone}&text={message}")
    time.sleep(10)  # allow chat to load

    # Press Enter to send the text
    webdriver.ActionChains(driver).send_keys(Keys.ENTER).perform()
    time.sleep(2)

    # If an attachment is provided, upload and send
    if attachment and os.path.exists(attachment):
        try:
            attach_btn = driver.find_element(By.XPATH, '//div[@title="Attach"]')
            attach_btn.click()
            time.sleep(2)

            file_input = driver.find_element(By.CSS_SELECTOR, 'input[type="file"]')
            file_input.send_keys(attachment)
            time.sleep(3)

            send_btn = driver.find_element(By.XPATH, '//span[@data-icon="send"]')
            send_btn.click()

            print(f"📎 Sent attachment to {phone}")
        except Exception as e:
            print(f"⚠️ Failed to send attachment to {phone}: {e}")
    else:
        if attachment:
            print(f"⚠️ Attachment not found: {attachment}")

    time.sleep(5)

driver.quit()
print("✅ All messages and attachments sent successfully!")
