const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.casinoChangeListener = functions.database.ref('casinos/{casinoId}')
    .onWrite(event => {
        var timeStamp = Math.floor(Date.now() / 1000);
    
        if (!event.data.exists()) {
            // console.log('deleted casino');
            return;
        }

        if (event.data.previous.exists()) {
            var rawSnapshoot = event.data.child('raw');
            if (rawSnapshoot.changed()) {
                // console.log('update modified');
                return event.data.ref.child('ref').update({
                    modified: timeStamp
                });
            } else {
                return;
            }
        } else {
            // console.log('created casino');
            return event.data.ref.child('ref').update({
                created: timeStamp,
                modified: timeStamp,
            });
        }
    });

exports.bonusChangeListener = functions.database.ref('bonuses/{casinoId}')
    .onWrite(event => {
        var timeStamp = Math.floor(Date.now() / 1000);
    
        if (!event.data.exists()) {
            // console.log('deleted casino');
            return;
        }

        if (event.data.previous.exists()) {
            var rawSnapshoot = event.data.child('raw');
            if (rawSnapshoot.changed()) {
                // console.log('update modified');
                return event.data.ref.child('ref').update({
                    modified: timeStamp
                });
            } else {
                return;
            }
        } else {
            // console.log('created casino');
            return event.data.ref.child('ref').update({
                created: timeStamp,
                modified: timeStamp,
            });
        }
    });

exports.slotChangeListener = functions.database.ref('slots/{slotId}')
    .onWrite(event => {
        var timeStamp = Math.floor(Date.now() / 1000);
    
        if (!event.data.exists()) {
            // console.log('deleted casino');
            return;
        }

        if (event.data.previous.exists()) {
            var rawSnapshoot = event.data.child('raw');
            if (rawSnapshoot.changed()) {
                // console.log('update modified');
                return event.data.ref.child('ref').update({
                    modified: timeStamp
                });
            } else {
                return;
            }
        } else {
            // console.log('created casino');
            return event.data.ref.child('ref').update({
                created: timeStamp,
                modified: timeStamp,
            });
        }
    });

exports.newsChangeListener = functions.database.ref('news/{newsId}')
    .onWrite(event => {
        var timeStamp = Math.floor(Date.now() / 1000);
    
        if (!event.data.exists()) {
            // console.log('deleted casino');
            return;
        }

        if (event.data.previous.exists()) {
            var rawSnapshoot = event.data.child('raw');
            if (rawSnapshoot.changed()) {
                // console.log('update modified');
                return event.data.ref.child('ref').update({
                    modified: timeStamp
                });
            } else {
                return;
            }
        } else {
            // console.log('created casino');
            return event.data.ref.child('ref').update({
                created: timeStamp,
                modified: timeStamp,
            });
        }
    });

exports.reviewChangeListener = functions.database.ref('reviews/{itemKey}/{userKey}')
    .onWrite(event => {
        
        if (!event.data.exists()) {
            console.log('Delete');
            if (event.data.previous.exists()) {
                var value = event.data.previous.val();
                var parentName = value.Parent;
                checkTopRate(parentName, event.params.itemKey);
            }
            return;
        }

        var databaseRef = event.data.ref;
        if (event.data.previous.exists()) {
            var value = event.data.previous.val();
            var parentName = value.Parent;
            var origineRate = value.Rate;
            if (origineRate == null) {
                origineRate = 0;
            }
            var newRate = event.data.val().Rate;
            return new Promise((resolve, reject) => {
                admin.database().ref(parentName + '/' + value.ItemKey)
                    .once('value')
                    .then(resItem => {
                        var itemData = resItem.val();
                        var refData = itemData.ref;
                        var averageRate = 0;
                        var rateUserCount = 1;
                        if (refData != null) {
                            averageRate = itemData.ref.averageRate;
                            rateUserCount = itemData.ref.rateUserCount;
                        }
                        if (averageRate == null) {
                            averageRate = 0;
                        }
                        if (rateUserCount == null) {
                            rateUserCount = 1;
                        }
                        averageRate = averageRate + (newRate - origineRate) / rateUserCount;
                        admin.database().ref(parentName + '/' + value.ItemKey)
                            .child('ref')
                            .update({
                                averageRate: averageRate,
                                rateUserCount: rateUserCount
                            })
                        // console.log('Review Item', resItem.val());
                        checkTopRate(parentName, event.params.itemKey);
                        resolve();
                    })
                    .catch(errorItem => {
                        console.log('Review Item Error', errorItem);
                        reject(errorItem);
                    })
            });
        } else {
            var value = event.data.val();
            var parentName = value.Parent;
            var newRate = value.Rate;
            return new Promise((resolve, reject) => {
                admin.database().ref(parentName + '/' + value.ItemKey)
                    .once('value')
                    .then(resItem => {
                        var itemData = resItem.val();
                        var refData = itemData.ref;
                        var averageRate = 0;
                        var rateUserCount = 1;
                        if (refData != null) {
                            averageRate = itemData.ref.averageRate;
                            rateUserCount = itemData.ref.rateUserCount;
                        }
                        if (averageRate == null) {
                            averageRate = 0;
                        }
                        if (rateUserCount == null) {
                            rateUserCount = 1;
                        } else {
                            rateUserCount += 1;
                        }
                        averageRate = averageRate * (rateUserCount - 1) / rateUserCount + newRate / rateUserCount;
                        admin.database().ref(parentName + '/' + value.ItemKey)
                            .child('ref')
                            .update({
                                averageRate: averageRate,
                                rateUserCount: rateUserCount
                            })
                        // console.log('Review Item', resItem.val());
                        checkTopRate(parentName, event.params.itemKey);
                        resolve();
                    })
                    .catch(errorItem => {
                        console.log('Review Item Error', errorItem);
                        reject(errorItem);
                    })
            });
        }

        function checkTopRate(parent, itemKey) {
            console.log('checking top review....');
            admin.database().ref('reviews/' + itemKey)
                .orderByChild('Rate')
                .limitToLast(1)
                .once('child_added')
                .then(reviewItem => {
                    // console.log('Top Review : ', reviewItem.val());
                    admin.database().ref(parent + '/' + itemKey + '/ref/topReview')
                        .set(reviewItem.val())
                        .then(topReviewRes => {})
                        .catch(topReviewError => {
                            console.log('Error write top review : ', topReviewError);
                        })
                })
                .catch(reviewError => {
                    console.log('Error Top Review : ', reviewError);
                })
        }
    });