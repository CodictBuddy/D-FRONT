import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  processData(data, lng) {
    const dataMap = {};
    const dataKeys = Object.keys(data);

    for (let i = 0; i < dataKeys.length; i++) {
      if (data[dataKeys[i]] instanceof Array) {
        const record = data[dataKeys[i]].find((el) => el.language === lng);
        if (record) {
          dataMap[dataKeys[i]] = record;
        }
      } else {
        dataMap[dataKeys[i]] = data[dataKeys[i]];
      }
    }
    return dataMap;
  }
}
