import { UtilService } from './../utils/util.service';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseurl = environment.base_url;
  userData = new BehaviorSubject<any>({});

  constructor(private http: HttpClient, private util: UtilService) {}

  getMyDetails() {
    return JSON.parse(this.util.retrieveLocalStorage('user_data'));
  }

  getUserProfile(_input) {
    return this.http.get<any>(this.baseurl + `/user/${_input}`).toPromise();
  }
  updateUserProfile(_input) {
    return this.http.patch<any>(this.baseurl + `/user`, _input).toPromise();
  }

  getUserSuggestions() {
    return this.http.get<any>(this.baseurl + `/user/suggestions`).toPromise();
  }

  processData(data, lng) {
    const dataMap = {};
    const dataKeys = Object.keys(data);

    for (let i = 0; i < dataKeys.length; i++) {
      if (data[dataKeys[i]] instanceof Array) {
        const record = [...data[dataKeys[i]]].find((el) => {
          if (el && el.language && el.language === lng.lng) {
            return el;
          }
        });
        if (record) {
          dataMap[dataKeys[i]] = record;
        }
      } else {
        dataMap[dataKeys[i]] = data[dataKeys[i]];
      }
    }
    return dataMap;
  }

  profilePatchingObject(userObject) {
    const objectKeys = Object.keys(userObject);
    const refactoredObject = {};
    for (let i = 0; i < objectKeys.length; i++) {
      refactoredObject[objectKeys[i]] =
        userObject[objectKeys[i]]?.['description'] || userObject[objectKeys[i]];
    }
    return refactoredObject;
  }
}
