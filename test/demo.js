const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('Saucedemo - Sorting Z to A', function () {
  this.timeout(30000); // Set timeout agar test tidak gagal karena lambat
  let driver;

  const expectedProductOrder = [
    'Test.allTheThings() T-Shirt (Red)',
    'Sauce Labs Onesie',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Bike Light',
    'Sauce Labs Backpack'
  ];

  //Hook before
  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    console.log('Browser sudah dibuka');
  });

  it('Login dan sort produk dari Z ke A', async () => {
    //Login
    await driver.get('https://www.saucedemo.com/');
    await driver.findElement(By.id('user-name')).sendKeys('standard_user');
    await driver.findElement(By.id('password')).sendKeys('secret_sauce');
    await driver.findElement(By.id('login-button')).click();

    // Tunggu sampai dropdown sort muncul
    await driver.wait(until.elementLocated(By.className('product_sort_container')), 5000);

    // Klik dropdown & pilih opsi "Name (Z to A)"
    const dropdown = await driver.findElement(By.className('product_sort_container'));
    await dropdown.click();
    const zToAOption = await driver.findElement(By.xpath("//option[text()='Name (Z to A)']"));
    await zToAOption.click();

    //Tunggu hasil sorting muncul
    await driver.sleep(1500);

    //Ambil nama produk yang muncul
    const productElements = await driver.findElements(By.className('inventory_item_name'));
    const actualProductNames = [];

    for (let el of productElements) {
      actualProductNames.push(await el.getText());
    }

    console.log('Produk tampil:', actualProductNames);
    assert.deepStrictEqual(actualProductNames, expectedProductOrder);

    //Tutup browser secara manual karena tidak pakai hook after()
    await driver.quit();
    console.log('Browser closed secara manual di dalam it()');
  });
});
