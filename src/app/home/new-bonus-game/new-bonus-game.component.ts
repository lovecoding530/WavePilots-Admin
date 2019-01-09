import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-new-bonus-game',
  templateUrl: './new-bonus-game.component.html',
  styleUrls: ['./new-bonus-game.component.css']
})
export class NewBonusGameComponent implements OnInit {

  selectedKey : string;
  bonus    : any;
  form      : FormGroup;
  mode      : string;
  isLoading : boolean;
  selectedImageData : any;
  selectedImageURL  : any;
  private imageDownloadURL: string;

  fieldNames = [
    { title: '-',                     width: 50 },
    { title: 'No',                    width: 15 },
    { title: 'Name',                  width: 350 },
    { title: 'Visited Count',         width: 50 },
    { title: 'Avatar',                width: 350 },
    { title: 'App Link',              width: 400 },
    { title: 'Software',              width: 300 },
    { title: 'Website',               width: 400 },
    { title: 'Withdrawal Methods',    width: 350 },
    { title: 'Deposit Methods',       width: 350 },
    { title: 'Currencies',            width: 350 },
    { title: 'Languages',             width: 350 },
    { title: 'Licenses',              width: 300 },
    { title: 'Withdrawal Limits',     width: 350 },
    { title: 'Restricted Countries',  width: 350 },
    { title: 'Casino Type',           width: 300 },
    { title: 'Return To Player',      width: 300 },
    { title: 'Allow Manual Flushing', width: 250 },
    { title: 'Live Chat',             width: 250 },
    { title: 'Established',           width: 250 },
    { title: 'Affiliate Program',     width: 250 },
    { title: 'Contacts',              width: 300 },
    { title: 'Owner',                 width: 200 },
    { title: 'Rate',                  width: 50 },
    { title: 'Launch Date',           width: 100 },
    // { title: 'Edit',                  width: 200 },
  ]
  casinoList : any
  selectedCasino: string

  constructor(
    private router        : Router,
    private route         : ActivatedRoute,
    private location      : Location,
    private sharedService : SharedService,
  ) {
    this.form = new FormGroup({
      Name                : new FormControl('', Validators.required),
      AppLink             : new FormControl('', Validators.required),
      Type                : new FormControl('', Validators.required),
      BonusValue          : new FormControl('', Validators.required),
      BonusCode           : new FormControl('', Validators.required),
      ImageFileName       : new FormControl(''),
      ImageFullPath       : new FormControl(''),
      Featured            : new FormControl(false),
      FreeSpin            : new FormControl(false),
      MatchBonus          : new FormControl(false),
      PromotionCode       : new FormControl(''),
    });
    
   }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.mode   = params['mode'];
      this.selectedKey = params['bonus'];
      if (this.selectedKey != null && this.selectedKey.length > 0) {
        this.sharedService.getBonusGameInfo(this.selectedKey).first().subscribe((res) => {
          console.log("########    Got object  ##################");
          console.log(res);
          this.bonus = res;
          this.checkSelectedCasinos()
          this.form = new FormGroup({
                Name                 : new FormControl(res.raw.Name, Validators.required),
                AppLink              : new FormControl(res.raw.AppLink, Validators.required),
                Type                 : new FormControl(res.raw.Type, Validators.required),
                BonusValue           : new FormControl(res.raw.BonusValue, Validators.required),
                BonusCode            : new FormControl(res.raw.BonusCode, Validators.required),
                ImageFileName        : new FormControl(res.raw.ImageFileName),
                ImageFullPath        : new FormControl(res.raw.ImageFullPath),
                Featured             : new FormControl(res.raw.Featured),
                FreeSpin             : new FormControl(res.raw.FreeSpin),
                MatchBonus           : new FormControl(res.raw.MatchBonus),
                PromotionCode        : new FormControl(res.raw.PromotionCode),
              });
        })
        /*
        */
      }
      // this.selectedImage = "https://firebasestorage.googleapis.com/v0/b/appadmin-3e908.appspot.com/o/listingimages%2Fimage4.jpg?alt=media&token=7fe3466c-8d33-471d-b5f1-559190bc1d94";
    });

    this.sharedService.allCasinos.first().map(list => list.map(casino => {
      // console.log(casino);
      let fullAppLink = casino.raw.AppLink;
      Object.keys(casino.raw).forEach((key) => {
        
        let value: string = casino.raw[key];
        if (value.length > 30 && key != 'ImageFullPath') {
          // console.log(value);
          casino.raw[key] = value.substring(0, 27) + "...";
        }
        // console.log(casino[key]);
      });
      casino.ShortAppLink = casino.raw.AppLink;
      casino.raw.AppLink = fullAppLink;

      return casino;
    })).subscribe((casinos) => {
      this.casinoList = casinos.reverse();
      
      this.checkSelectedCasinos()
    });

  }

  private checkSelectedCasinos() {
    console.log('checking selected casinos................')
    if (this.casinoList != null && this.bonus != null) {
      // console.log(this.bonus.relateCasinos);
      if (this.bonus.relateCasinos != null) {
        Object.keys(this.bonus.relateCasinos).forEach((key) => {
          for (var index = 0; index < this.casinoList.length; index++) {
            var casino = this.casinoList[index];

            if (casino.$key == key) {
              this.selectedCasino = key
              return
            }
          }
        })
      }
    }
  }

  onSubmit(form: FormGroup) {
    if (this.form.valid) {
      this.isLoading = true;
      if (this.mode == 'new') {
        if (this.selectedImageData) {
          this.sharedService.uploadPhoto(this.selectedImageData).then((snapshot) => {
                  console.log('Uploaded a blob or file! Now storing the reference at', 'path');
                  this.imageDownloadURL = snapshot.downloadURL;
                  this.form.value.ImageFullPath = this.imageDownloadURL;
                  this.form.value.ImageFileName = snapshot.metadata.name;
                  this.saveFormDataToDatabase()
              });
        } else {
          this.saveFormDataToDatabase()
        }
      } else {
        if (this.selectedImageData) {
          this.sharedService.uploadPhoto(this.selectedImageData).then((snapshot) => {
                  console.log('Uploaded a blob or file! Now storing the reference at', 'path');
                  this.sharedService.deletePhoto(this.form.value.ImageFileName);
                  this.imageDownloadURL = snapshot.downloadURL;
                  this.form.value.ImageFullPath = this.imageDownloadURL;
                  this.form.value.ImageFileName = snapshot.metadata.name;
                  this.updateFormDataToDatabase()
              });
        } else {
          this.updateFormDataToDatabase()
        }
      }
    }
  }

  private saveFormDataToDatabase() {
    let selectedCasinos = this.getSelectedCasinos();
    this.sharedService.addNewBonusGame(
      this.form.value,
      selectedCasinos
    ).then((res) => {
        // console.log(res)
        this.saveBonusToCasinos(res.key, selectedCasinos)
        this.onCancel()
        this.isLoading = false;
      }, (error) => {
        console.log(error.message);
        this.isLoading = false;
      });
  }

  private updateFormDataToDatabase() {
    this.removeBonusFromCasino()
    let selectedCasinos = this.getSelectedCasinos()
    console.log('selected casinos, ', selectedCasinos)
    this.sharedService.updateBonusGame(
      this.selectedKey, 
      this.form.value,
      selectedCasinos
    ).then((res) => {
        this.saveBonusToCasinos(this.selectedKey, selectedCasinos)
        this.onCancel()
        this.isLoading = false;
      }, (error) => {
        console.log(error.message);
        this.isLoading = false;
      });
  }

  private removeBonusFromCasino() {
    Object.keys(this.bonus.relateCasinos).forEach((key) => {
        this.sharedService.removeBonusFromCasino(this.selectedKey, key)
      });
  }

  private getSelectedCasinos() {
    let result = {}
    result[this.selectedCasino] = true
    return result
  }

  private saveBonusToCasinos(bonusKey: string, casinos: any) {
    for (var key in casinos) {
      this.sharedService
          .addBonusToCasino(bonusKey, key)
          .then(_ => {
            console.log('added bonus to casino', key)
          })
          .catch(error => {
            console.log('**** error on Adding bonus to casino', key)
          })
    }
  }

  onImageSelected(event: any) {
    this.selectedImageData = event.target.files && event.target.files[0];
    if (this.selectedImageData) {
      let reader = new FileReader();
      reader.onload = (e: any)=> this.selectedImageURL = e.target.result;
      reader.readAsDataURL(this.selectedImageData);
    }
  }

  onCancel() {
    this.location.back();
  }

  onDelete() {
    if(confirm("Are you sure to delete ?")) {
      this.isLoading = true;
      console.log("Implement delete functionality here");
      this.removeBonusFromCasino()
      this.sharedService.deleteBonus(this.bonus).then((res) => {
        this.onCancel();
        this.isLoading = false;
      }).catch((error) => {
        console.log('######   Error deleting casino    ######');
        console.log(error);
        this.isLoading = false;
      })
      if (this.bonus) {
        this.sharedService.deletePhoto(this.bonus.ImageFileName);
      }

    }
  }
}
