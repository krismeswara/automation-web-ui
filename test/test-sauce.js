const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Saucedemo UI Automation', function () {
  this.timeout(30000); // Timeout per test case
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('Sukses Login', async () => {
    await driver.get('https://www.saucedemo.com/');
    await driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();

    const title = await driver.findElement(By.className('title')).getText();
    assert.strictEqual(title, 'Products');
  });

  it('Urutkan Produk dari A-Z', async () => {
    await driver.get('https://www.saucedemo.com/');
    await driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();

    const dropdown = await driver.findElement(By.className('product_sort_container'));
    await driver.executeScript(
      "arguments[0].value = 'az'; arguments[0].dispatchEvent(new Event('change'))",
      dropdown
    );

    // Tunggu sampai produk pertama betul-betul "Sauce Labs Backpack"
    await driver.wait(async () => {
      const productElements = await driver.findElements(By.className('inventory_item_name'));
      if (productElements.length === 0) return false;
      const firstText = await productElements[0].getText();
      console.log("⏳ Checking first product:", firstText);
      return firstText === 'Sauce Labs Backpack';
    }, 10000, 'Produk pertama tidak pernah jadi "Sauce Labs Backpack"');

    // Ambil lagi dan lakukan assertion
    const productElements = await driver.findElements(By.className('inventory_item_name'));
    const firstProductName = await productElements[0].getText();
    console.log("✅ Produk pertama setelah sortir:", firstProductName);
    assert.strictEqual(firstProductName, 'Sauce Labs Backpack');
  });
});
