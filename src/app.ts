import fs from 'fs';

import env from './env';
import FetchItems from './utils/rest/api/v1/items';
import GetItemDto from './utils/rest/api/v1/items/dto/get-item.dto';

async function main() {
  let items: GetItemDto[] = [];
  for (let i = 0; i < env.backend__brandUrls.length; i++) {
    const jItems = (
      await FetchItems.get({ brand: env.backend__brandUrls[i] })
    ).sort((a, b) => a.dp_model.localeCompare(b.dp_model));
    items = [...items, ...jItems];
  }

  const result = [];
  for (let i = 0; i < items.length; ++i) {
    let usd = '';
    let ch = items[i].dp_itemCharacteristics;
    for (let j = 0; j < ch.length; ++j) {
      if (ch[j].dp_characteristicId === 24) {
        usd = ch[j].dp_value;
        break;
      }
    }

    if (usd.length !== 0) {
      const usdNumber = Number(usd);

      ch = ch.filter(e => e.dp_characteristicId !== 29);

      ch.push({
        dp_id: 0,
        dp_characteristicId: 29,
        dp_value: Number(usdNumber * 98 * 2).toFixed(2),
      });

      ch = ch.sort((a, b) => a.dp_characteristicId - b.dp_characteristicId);

      result.push({
        ...items[i],
        dp_itemCharacteristics: ch,
      });
    }
  }

  console.log(`Установлены цены ${result.length}/${items.length}`);

  let i = 0;
  let tempArr = result;
  const number = 400;
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
