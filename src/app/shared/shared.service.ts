import { Injectable } from '@angular/core';
import { 
  AngularFire, 
  FirebaseListObservable, 
  FirebaseObjectObservable,
} from 'angularfire2';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

@Injectable()
export class SharedService {

  private parentNewestCasino = 'casinos';
  private parentBonusGames   = 'bonuses';
  private parentNewestSlots   = 'slots';
  private parentCasinoNews   = 'news';
  private parentCarousel     = 'carousels';
  private parentUsers        = 'users';
  private parentReviews      = 'reviews';
  private parentReviewLiterals = 'reviewLiteral';


  constructor(
    private af : AngularFire
    
  ) {}

  /**
   * get all users
   */
  get allUsers(): FirebaseListObservable<any> {
    return this.af.database.list('/users');
  }

  /**
   * get pending users
   */
  get pendingUsers(): FirebaseListObservable<any> {
    return this.af.database.list('users-pending');
  }

  /**
   * get user by id
   */
  getUser(uid: string): FirebaseObjectObservable<any> {
    return this.af.database.object('users/' + uid);
  }

  changeUserState(user: any, isDiabled: boolean) {
    return this.af.database.object(`users/${user.$key}`).update(
      { isDisabled: isDiabled}
    )
  }

  /**
   * get all teams
   */
  get allTeams(): FirebaseListObservable<any> {
    return this.af.database.list('teams/');
  }

  /**
   * get team by id
   */
  getTeam(tid: string): FirebaseObjectObservable<any> {
    return this.af.database.object('teams/' + tid);
  }

  /**
   * get all families
   */
  get allFamilies(): FirebaseListObservable<any> {
    return this.af.database.list('families/');
  }

  /**
   * get family by id
   */
  getFamily(fid: string): FirebaseObjectObservable<any> {
    return this.af.database.object('families/' + fid);
  }

  /**
   * get all messages
   */
  get allMessages() {
    return this.af.database.list('messages/').map(messages => {
      return messages.map(message => {
        message.userFrom = this.af.database.object('users/' + message.from);
        message.userTo   = this.af.database.object('users/' + message.to);
        
        return message;
      });
    });
  }

  /**
   * get all images
   */
  get allImages(): FirebaseListObservable<any> {
    return this.af.database.list('team_pictures/');
  }

  /**
   * show message
   */
  showMessage(message: string): void {
    console.log(message);
  }

  /**
   * Get all items
   */
  private allItems(parent: string): FirebaseListObservable<any> {
    return this.af.database.list(`${parent}/`, {
      query: {
        orderByChild: 'ref/Order',
        limitToLast: 100,
      }
    });
  }

  /**
   * get all casinos
   */
  get allCasinos(): FirebaseListObservable<any> {
    return this.allItems(this.parentNewestCasino);
    // return this.af.database.list(this.parentNewestCasino);
  }

  /**
   * get all Bonus games
   */
  get allBonusGames(): FirebaseListObservable<any> {
    return this.allItems(this.parentBonusGames);
    // return this.af.database.list(this.parentBonusGames);
  }

  /**
   * get all Slots
   */
  get allSlots(): FirebaseListObservable<any> {
    return this.allItems(this.parentNewestSlots);
    // return this.af.database.list(this.parentNewestSlots);
  }

  /**
   * get all Casino news
   */
  get allCasinoNews(): FirebaseListObservable<any> {
    return this.allItems(this.parentCasinoNews);
    // return this.af.database.list(this.parentCasinoNews);
  }

  /**
   * get all Reviews
   */
  get allReviews(): FirebaseListObservable<any> {
    return this.af.database.list(this.parentReviewLiterals);
  }

  /*******************************************************
   *******************************************************
   *******************************************************
   * Upload photo
   */
  uploadPhoto(file) {
    let storageRef = firebase.storage().ref('/images');
    let now = new Date();
    let filename = now.getTime().toString() + '.jpg';
    var iRef = storageRef.child(filename);
    return iRef.put(file);
  }

  /**
   * Delete Photo
   */
  deletePhoto(filename: string) {
    if (filename) {
      let storageRef = firebase.storage().ref('/images');
      var iRef = storageRef.child(filename);
      return iRef.delete();
    }
  }

  /*******************************************************
   *******************************************************
   *******************************************************
   * Add new item
   */
  private addNewItem(parent: string, value: any, other?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.af.database.list(`${parent}/`, {
        query: {
          orderByChild: 'Order',
          limitToLast : 1,
        }
      }).first().subscribe((resOrder) => {
        // let orderNumber = resOrder ? resOrder.Order + 1 : 0;
        let orderNumber = 0;
        if (resOrder.length > 0) {
          let obj = resOrder[0];
          orderNumber = obj.ref.Order + 1;
        }
        console.log('$$$$$$  GOT order number  $$$$$$');
        console.log(orderNumber);

        let model = {
          raw: value,
          ref: {
            Order: orderNumber,
            Parent: parent,
          }
        }
        if (other != null) {
          model[other.key] = other.value
        }
        // value.Order = orderNumber;
        // value.Parent = parent;

        // Add to carousel node
        this.af.database.list(parent + '/').push(model).then((res) => {
          resolve(res);
        }).catch((error) => {
          reject(error);
        });

      });

    })
    // return this.af.database.list(parent + '/').push(value);
  }

  /**
   * Add new casino
   */
  addNewCasino(value: any, selectedCasinos: any): Promise<any> {
    return this.addNewItem(this.parentNewestCasino, value, {
      key: 'recommendCasinos',
      value: selectedCasinos
    });
  }

  /**
   * Add new bonus game
   */
  addNewBonusGame(value: any, relateCasinoKey: any): Promise<any> {
    let otherValue: any = null
    if (relateCasinoKey != null) {
      otherValue = {
        key: 'relateCasinos',
        value: relateCasinoKey
      }
    }
    return this.addNewItem(this.parentBonusGames, value, otherValue);
  }

  /**
   * Add new slot
   */
  addNewSlot(value: any, relateCasinoKey: any): Promise<any> {
    let otherValue: any = null
    if (relateCasinoKey != null) {
      otherValue = {
        key: 'relateCasinos',
        value: relateCasinoKey
      }
    }
    return this.addNewItem(this.parentNewestSlots, value, otherValue);
  }

  /**
   * Add new casinonews
   */
  addNewCasinoNews(value: any): Promise<any> {
    return this.addNewItem(this.parentCasinoNews, value);
  }

  /*******************************************************
   *******************************************************
   *******************************************************
   * Update item
   */
  private updateItem(parent: string, key: string, value: any) {
    return this.af.database.object(parent + '/' + key).update(value);
  }

  /**
   * Update casino
   */
  updateCasino(key: string, value: any, selectedCasinos: any) {
    let model = {
      raw: value,
      recommendCasinos: selectedCasinos,
    }
    return this.updateItem(this.parentNewestCasino, key, model);
  }

  /**
   * Update bonus game
   */
  updateBonusGame(key: string, value: any, selectedCasinos: any) {
    let model = {
      raw: value,
      relateCasinos: selectedCasinos,
    }
    return this.updateItem(this.parentBonusGames, key, model);
  }

  /**
   * Update slot
   */
  updateSlot(key: string, value: any, selectedCasinos: any) {
    let model = {
      raw: value,
      relateCasinos: selectedCasinos,
    }
    return this.updateItem(this.parentNewestSlots, key, model);
  }

  /**
   * Update casinonews
   */
  updateCasinoNews(key: string, value: any) {
    let model = {
      raw: value
    }
    return this.updateItem(this.parentCasinoNews, key, model);
  }

  addBonusToCasino(bonusKey: string, casinoKey: string) {
    let realteBonus = {}
    realteBonus[bonusKey] = true
    
    return this.updateItem(this.parentNewestCasino, casinoKey + '/relateBonuses', realteBonus)
  }

  addSlotToCasino(slotKey: string, casinoKey: string) {
    let realteSlot = {}
    realteSlot[slotKey] = true
    
    return this.updateItem(this.parentNewestCasino, casinoKey + '/relateSlots', realteSlot)
  }

  removeBonusFromCasino(bonusKey: string, casinoKey: string) {
    return this.af.database.object(
      `${this.parentNewestCasino}/${casinoKey}/relateBonuses/${bonusKey}`
    ).remove();
  }

  /*******************************************************
   *******************************************************
   *******************************************************
   * Get full information of item
   */
  getItemInfo(parent: string, key: string) {
    return this.af.database.object(parent + '/' + key);
  }

  /**
   * Get full Casino information
   */
  getCaisnoInfo(key: string) {
    return this.getItemInfo(this.parentNewestCasino, key);
  }

  /**
   * Get full Bonus game
   */
  getBonusGameInfo(key: string) {
    return this.getItemInfo(this.parentBonusGames, key);
  }

  /**
   * Get full Slot
   */
  getSlotInfo(key: string) {
    return this.getItemInfo(this.parentNewestSlots, key);
  }

  /**
   * Get full Casino News
   * @param key Casino News node key
   */
  getCaisnoNewsInfo(key: string) {
    return this.getItemInfo(this.parentCasinoNews, key);
  }

  /**
   * Get Review information
   * @param key reviewLiteral node key
   */
  getReviewInfo(key: string) {
    return this.getItemInfo(this.parentReviewLiterals, key);
  }

  /*******************************************************
   *******************************************************
   *******************************************************
   * Delete a item
   */
  private deleteItem(parent: string, key: string) {
    this.af.database.object(`${this.parentCarousel}/${key}`).remove();
    return this.af.database.object(parent + '/' + key).remove();
  }

  /**
   * Delete a casino
   */
  deleteCasino(casino: any) {
    if (casino.raw.ImageFileName != null) {
      this.deletePhoto(casino.raw.ImageFileName)
    }
    let key = casino.$key
    return this.deleteItem(this.parentNewestCasino, key);
  }

  /**
   * Delete a bonus
   */
  deleteBonus(bonus: any) {
    if (bonus.raw.ImageFileName != null) {
      this.deletePhoto(bonus.raw.ImageFileName)
    }
    let key = bonus.$key
    return this.deleteItem(this.parentBonusGames, key);
  }

  /**
   * Delete a casino
   */
  deleteSlot(slot: any) {
    if (slot.raw.subImages != null) {
      let subImages = slot.raw.subImages
      for (var index in subImages) {
        if (subImages.hasOwnProperty(index)) {
          var element = subImages[index]
          this.deletePhoto(element.filename)
        }
      }
    }
    if (slot.raw.ImageFileName != null) {
      this.deletePhoto(slot.raw.ImageFileName)
    }
    let key = slot.$key
    return this.deleteItem(this.parentNewestSlots, key);
  }

  /**
   * Delete a casino
   */
  deleteCasinoNews(news: any) {
    if (news.raw.ImageFileName != null) {
      this.deletePhoto(news.raw.ImageFileName)
    }
    let key = news.$key
    return this.deleteItem(this.parentCasinoNews, key);
  }

  /*******************************************************
   *******************************************************
   *******************************************************
   * Get carousel caount
   */
  private getCarouselCount() {
    return this.af.database.object(this.parentCarousel)
  }

  getCarousels() {
    return this.af.database.list(`${this.parentCarousel}/`, {
      query: {
        orderByChild: 'ref/Order',
      }
    });
    // var ref = firebase.database().ref(this.parentCarousel + '/').orderByChild('Order');
    // return ref;
  }
  
  /*******************************************************
   *******************************************************
   *******************************************************
   * Add to carousel
   */
  private addToCarousel(parent: string, object: any) {
    return new Promise((resolve, reject) => {
      this.af.database.list(`${this.parentCarousel}/`, {
        query: {
          orderByChild: 'ref/Order',
          limitToLast : 1,
        }
      }).first().subscribe((resOrder) => {
        // let orderNumber = resOrder ? resOrder.Order + 1 : 0;
        let orderNumber = 0;
        if (resOrder.length > 0) {
          let obj = resOrder[0];
          orderNumber = obj.ref.Order + 1;
        }
        console.log('$$$$$$  GOT order number  $$$$$$');
        console.log(orderNumber);

        var title = '';
        if (parent == this.parentNewestCasino) {
          title = 'Newest Casino';
        } else if (parent == this.parentBonusGames) {
          title = 'Bonus Game';
        } else if (parent == this.parentNewestSlots) {
          title = 'Newest Slot';
        } else if (parent == this.parentCasinoNews) {
          title = 'Casino News';
        }
        let value = {
          raw : object.raw,
          ref : {
            Order         : orderNumber,
            Parent        : parent,
            Title         : title,
          }
        }

        // Add to carousel node
        this.af.database.object(this.parentCarousel + '/' + object.$key).set(value).then((resCarousel) => {
          let itemPath = parent + '/' + object.$key + '/ref';

          // Update item for added to carousel
          this.updateItemForCarousel(itemPath, true).then((resItem) => {
            resolve(true);
          }).catch((errorItem) => {
            reject(errorItem);
          })
        }).catch((errorCarousel) => {
          reject(errorCarousel);
        });

      });

    })
  }

  /**
   * Remove from carousel
   */
  private removeFromCarousel(parent: string, object: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.af.database.object(this.parentCarousel + '/' + object.$key).remove()
      .then( resCarousel => {
        let itemPath = parent + '/' + object.$key + '/ref';
        // Update item for added to carousel
        this.updateItemForCarousel(itemPath, false).then((resItem) => {
          resolve(true);
        }).catch((errorItem) => {
          reject(errorItem);
        })
      })
      .catch( errorCarousel => {
        reject(errorCarousel);
      });
    })
  }

  /**
   * Update item carousel statue
   */
  private updateItemForCarousel(path: string, enabled: boolean) {
    let value = {
      isCarousel : enabled
    };
    return this.af.database.object(path).update(value);
  }

  /**
   * Add casino to carousel
   */
  addCasinoToCarousel(object: any) {
    return this.addToCarousel(this.parentNewestCasino, object);
  }

  /**
   * Remove casino from carousel
   */
  removeCasinoFromCarousel(object: any) {
    return this.removeFromCarousel(this.parentNewestCasino, object);
  }

  /**
   * Add bonus to carousel
   */
  addBonusToCarousel(object: any) {
    return this.addToCarousel(this.parentBonusGames, object);
  }

  /**
   * Remove bonus from carousel
   */
  removeBonusFromCarousel(object: any) {
    return this.removeFromCarousel(this.parentBonusGames, object);
  }

  /**
   * Add Slot to carousel
   */
  addSlotToCarousel(object: any) {
    return this.addToCarousel(this.parentNewestSlots, object);
  }

  /**
   * Remove slot from carousel
   */
  removeSlotFromCarousel(object: any) {
    return this.removeFromCarousel(this.parentNewestSlots, object);
  }

  /**
   * Add casino news to carousel
   */
  addCasinoNewsToCarousel(object: any) {
    return this.addToCarousel(this.parentCasinoNews, object);
  }

  /**
   * Remove casino news from carousel
   */
  removeCasinoNewsFromCarousel(object: any) {
    return this.removeFromCarousel(this.parentCasinoNews, object);
  }

  /*******************************************************
   *******************************************************
   *******************************************************
   * Add / Remove Banner Ad
   */
  addBannerAd(bonus: any) {
    let key = bonus.$key
    return Promise.all([
      this.af.database
          .object('banner/' + key)
          .set(true),
      this.af.database
          .object('bonuses/' + key + '/ref')
          .update({
            isBanner: true
          })
    ])
  }

  removeBannerAd(bonus: any) {
    let key = bonus.$key
    return Promise.all([
      this.af.database
          .object('banner/' + key)
          .remove(),
      this.af.database
          .object('bonuses/' + key + '/ref')
          .update({
            isBanner: false
          })
    ])
  }


  /*******************************************************
   *******************************************************
   *******************************************************
   * Update item order
   */
  private updateItemOrder(parent: string, key: string, value: number) {
    return this.af.database.object(`${parent}/${key}/ref`).update({
      Order: value,
    });
  }

  /**
   * Update carousel order
   */
  updateCarouselOrder(key: string, value: number) {
    return this.updateItemOrder(this.parentCarousel, key, value);
  }

  /**
   * Update caisno order
   */
  updateCasinoOrder(key: string, value: number) {
    return this.updateItemOrder(this.parentNewestCasino, key, value);
  }

  /**
   * Update Bonus game order
   */
  updateBonusGameOrder(key: string, value: number) {
    return this.updateItemOrder(this.parentBonusGames, key, value);
  }

  /**
   * Update Slot order
   */
  updateSlotOrder(key: string, value: number) {
    return this.updateItemOrder(this.parentNewestSlots, key, value);
  }
  
  /**
   * Update Casino News order
   */
  updateCasinoNewsOrder(key: string, value: number) {
    return this.updateItemOrder(this.parentCasinoNews, key, value);
  }

  /*****************************************************
   *****************************************************
   *****************************************************
   * Enable / Disable review
   */
  updateReviewState(review: any, state: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.af.database.object(`${this.parentReviewLiterals}/${review.$key}`).update({
        'Enable': state
      }).then(_ => {
        this.af.database.object(`${this.parentReviews}/${review.ItemKey}/${review.UserId}`).update({
          'Enable': state
        }).then(_ => {
          resolve(true);
        }).catch((error) => {
          reject(error);
        })
      }).catch((error) => {
        reject(error);
      })
    })
  }


  /**
   * Amzing
   */
  testQuery() {
    var ref = firebase.database().ref(this.parentCarousel + '/').orderByChild('Order').limitToFirst(10);
    ref.on('child_added', function(snapshot) {
      console.log('^^^^^^ carousel  ordering   ^^^^^^');
      console.log(snapshot.key);
    })
    ref.on('child_changed', function(snapshot) {
      console.log('^^^^^^ carousel  ordering   ^^^^^^');
      console.log(snapshot.key);
    })

  }

  /**
   * download url
   */
  async downloadUrl(refUrl) {
    let storageRef = firebase.storage().ref(refUrl);
    return await storageRef.getDownloadURL();
  }

  /**
   * all waves
   */
  get allWaves(): FirebaseListObservable<any> {
    return this.af.database.list('/waves');
  }

}
