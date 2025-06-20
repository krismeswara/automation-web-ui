const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Saucedemo - Sorting Z to A', function () {
  this.timeout(30000);
  let driver;

  const expectedProductOrder = [
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Onesie',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Bike Light',
    'Sauce Labs Backpack'
  ];

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  it('Login dan sort Z to A', async () => {
    await driver.get('https://www.saucedemo.com/');
    await driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();

    // Tunggu halaman produk muncul
    await driver.wait(until.elementLocated(By.className('product_sort_container')), 5000);

    // Klik dropdown lalu pilih "Name (Z to A)"
    const dropdown = await driver.findElement(By.className('product_sort_container'));
    await dropdown.sendKeys('Name (Z to A)');

    // Tunggu produk selesai reload
    await driver.sleep(1500);

    // Ambil semua produk setelah sorting
    const productElements = await driver.findElements(By.className('inventory_item_name'));
    const actualProductNames = [];

    for (let el of productElements) {
      const name = await el.getText();
      actualProductNames.push(name);
    }

    console.log('📦 Produk tampil:', actualProductNames);

    // Bandingkan dengan urutan yang diharapkan
    assert.deepStrictEqual(actualProductNames, expectedProductOrder);
  });
});
