import fs from 'fs';

import env from './env';
import price from './price';
import FetchItems from './utils/rest/api/v1/items';
import GetItemDto from './utils/rest/api/v1/items/dto/get-item.dto';
import ItemDto from './utils/rest/api/v1/items/dto/item.dto';

async function main() {
  let items: GetItemDto[] = [];
  for (let i = 0; i < env.backend__brandUrls.length; i++) {
    const jItems = (
      await FetchItems.get({ brand: env.backend__brandUrls[i] })
    ).sort((a, b) => a.dp_model.localeCompare(b.dp_model));
    items = [...items, ...jItems];
  }

  const result: ItemDto[] = [];
  for (let i = 0; i < price.length; ++i) {
    const currentPriceItem = price[i];
    for (let j = 0; j < items.length; ++j) {
      const currentItem = items[j];
      if (`${currentPriceItem.Model}` === currentItem.dp_model) {
        if (!Number(currentPriceItem.Price)) {
          console.log(
            `Цена не установлена для модели ${currentItem.dp_model}, так как cost = "${currentPriceItem.Price}"`,
          );
          break;
        }

        const ch = currentItem.dp_itemCharacteristics
          .filter(object => object.dp_characteristicId !== 24)
          .filter(object => object.dp_characteristicId !== 25)
          .filter(object => object.dp_characteristicId !== 29)
          .filter(object => object.dp_characteristicId !== 37)
          .filter(object => object.dp_characteristicId !== 35)
          .filter(object => object.dp_characteristicId !== 36);

        const usd = Number(currentPriceItem.Price).toFixed(2);
        const usdOpt = Number(Number(usd) * 1.5).toFixed(2);

        const byn = Number(Number(usd) * 1.2 * 2 * 3.4).toFixed(2);
        const bynOpt = Number(Number(usdOpt) * 1.2 * 2 * 3.4).toFixed(2);

        const rub = Number(Number(usd) * 2 * 98).toFixed(2);
        const rubOpt = Number(Number(usd) * 2 * 98).toFixed(2);

        const globalCost = Number(Number(Number(usd) * 2 * 3.4).toFixed(2));

        if (Number(usd)) {
          ch.push({ dp_id: 0, dp_characteristicId: 24, dp_value: usd });
          ch.push({ dp_id: 0, dp_characteristicId: 25, dp_value: byn });
          ch.push({ dp_id: 0, dp_characteristicId: 29, dp_value: rub });
          ch.push({ dp_id: 0, dp_characteristicId: 37, dp_value: usdOpt });
          ch.push({ dp_id: 0, dp_characteristicId: 35, dp_value: bynOpt });
          ch.push({ dp_id: 0, dp_characteristicId: 36, dp_value: rubOpt });
        }

        if (currentItem.dp_cost !== globalCost) {
          console.log(
            ` = = = = = = = Цена поменялась для модели ${currentItem.dp_model} с ${currentItem.dp_cost} на ${globalCost}`,
          );
        }

        result.push({
          ...currentItem,
          dp_cost: globalCost,
          dp_itemCharacteristics: ch.sort(
            (a, b) => a.dp_characteristicId - b.dp_characteristicId,
          ),
        });
        continue;
      }
    }
  }

  for (let i = 0; i < price.length; ++i) {
    const currentPriceItem = price[i];

    for (let j = 0; j < items.length; ++j) {
      const currentItem = items[j];
      if (`${currentPriceItem.Model}-white` === currentItem.dp_model) {
        let isFound = false;
        for (let k = 0; k < result.length; ++k) {
          const currentResult = result[k];
          if (currentResult.dp_model === currentItem.dp_model) {
            isFound = true;
            break;
          }
        }
        if (isFound) break;
        console.log(
          `!!! Не было в result: ${currentItem.dp_model} "${currentPriceItem.Model}"`,
        );

        if (!Number(currentPriceItem.Price)) {
          console.log(
            `Цена не установлена для модели ${currentItem.dp_model}, так как cost = "${currentPriceItem.Price}"`,
          );
          break;
        }

        const ch = currentItem.dp_itemCharacteristics
          .filter(object => object.dp_characteristicId !== 24)
          .filter(object => object.dp_characteristicId !== 25)
          .filter(object => object.dp_characteristicId !== 29)
          .filter(object => object.dp_characteristicId !== 37)
          .filter(object => object.dp_characteristicId !== 35)
          .filter(object => object.dp_characteristicId !== 36);

        const usd = Number(currentPriceItem.Price).toFixed(2);
        const usdOpt = Number(Number(usd) * 1.5).toFixed(2);

        const byn = Number(Number(usd) * 1.2 * 2 * 3.4).toFixed(2);
        const bynOpt = Number(Number(usdOpt) * 1.2 * 2 * 3.4).toFixed(2);

        const rub = Number(Number(usd) * 2 * 98).toFixed(2);
        const rubOpt = Number(Number(usd) * 2 * 98).toFixed(2);

        if (Number(usd)) {
          ch.push({ dp_id: 0, dp_characteristicId: 24, dp_value: usd });
          ch.push({ dp_id: 0, dp_characteristicId: 25, dp_value: byn });
          ch.push({ dp_id: 0, dp_characteristicId: 29, dp_value: rub });
          ch.push({ dp_id: 0, dp_characteristicId: 37, dp_value: usdOpt });
          ch.push({ dp_id: 0, dp_characteristicId: 35, dp_value: bynOpt });
          ch.push({ dp_id: 0, dp_characteristicId: 36, dp_value: rubOpt });
        }

        result.push({
          ...currentItem,
          dp_itemCharacteristics: ch.sort(
            (a, b) => a.dp_characteristicId - b.dp_characteristicId,
          ),
        });
        continue;
      }
    }
  }

  for (let i = 0; i < price.length; ++i) {
    const currentPriceItem = price[i];

    for (let j = 0; j < items.length; ++j) {
      const currentItem = items[j];
      if (`${currentPriceItem.Model}-black` === currentItem.dp_model) {
        let isFound = false;
        for (let k = 0; k < result.length; ++k) {
          const currentResult = result[k];
          if (currentResult.dp_model === currentItem.dp_model) {
            isFound = true;
            break;
          }
        }
        if (isFound) break;
        console.log(
          `!!! Не было в result: ${currentItem.dp_model} "${currentPriceItem.Model}"`,
        );

        if (!Number(currentPriceItem.Price)) {
          console.log(
            `Цена не установлена для модели ${currentItem.dp_model}, так как cost = "${currentPriceItem.Price}"`,
          );
          break;
        }

        const ch = currentItem.dp_itemCharacteristics
          .filter(object => object.dp_characteristicId !== 24)
          .filter(object => object.dp_characteristicId !== 25)
          .filter(object => object.dp_characteristicId !== 29)
          .filter(object => object.dp_characteristicId !== 37)
          .filter(object => object.dp_characteristicId !== 35)
          .filter(object => object.dp_characteristicId !== 36);

        const usd = Number(currentPriceItem.Price).toFixed(2);
        const usdOpt = Number(Number(usd) * 1.5).toFixed(2);

        const byn = Number(Number(usd) * 1.2 * 2 * 3.4).toFixed(2);
        const bynOpt = Number(Number(usdOpt) * 1.2 * 2 * 3.4).toFixed(2);

        const rub = Number(Number(usd) * 2 * 98).toFixed(2);
        const rubOpt = Number(Number(usd) * 2 * 98).toFixed(2);

        if (Number(usd)) {
          ch.push({ dp_id: 0, dp_characteristicId: 24, dp_value: usd });
          ch.push({ dp_id: 0, dp_characteristicId: 25, dp_value: byn });
          ch.push({ dp_id: 0, dp_characteristicId: 29, dp_value: rub });
          ch.push({ dp_id: 0, dp_characteristicId: 37, dp_value: usdOpt });
          ch.push({ dp_id: 0, dp_characteristicId: 35, dp_value: bynOpt });
          ch.push({ dp_id: 0, dp_characteristicId: 36, dp_value: rubOpt });
        }

        result.push({
          ...currentItem,
          dp_itemCharacteristics: ch.sort(
            (a, b) => a.dp_characteristicId - b.dp_characteristicId,
          ),
        });
        continue;
      }
    }
  }

  console.log('Цены не установлены для:');
  for (let i = 0; i < items.length; ++i) {
    const currentItem = items[i];
    let isFound = false;
    for (let j = 0; j < result.length; ++j) {
      const currentResult = result[j];
      if (currentItem.dp_model === currentResult.dp_model) {
        isFound = true;
        break;
      }
    }
    if (!isFound) {
      console.log(`${currentItem.dp_model}`);
    }
  }

  console.log(`Установлены цены ${result.length}/${items.length}`);

  let i = 0;
  let tempArr = result;
  const number = 300;
  while (1) {
    if (tempArr.length === 0) {
      break;
    }

    await fs.promises.writeFile(
      `result-${i}.json`,
      JSON.stringify(tempArr.slice(0, number), null, 2),
    );
    console.log(tempArr.length);
    tempArr = tempArr.slice(number);
    i += 1;
  }
}

main();
