import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-new-casino',
  templateUrl: './new-casino.component.html',
  styleUrls: ['./new-casino.component.css'],
})
export class NewCasinoComponent implements OnInit {

  selectedKey : string;
  casino    : any;
  form      : FormGroup;
  submitted : boolean;
  mode      : string;
  isLoading : boolean;
  selectedImageData : any;
  selectedImageURL  : any;
  private imageDownloadURL: string;
  alternativeOffers: any[] = [];

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
  casinoList : any;
  selectedCasino: Boolean[] = [];

  constructor(
    private router        : Router,
    private route         : ActivatedRoute,
    private location      : Location,
    private sharedService : SharedService,
  ) {
    this.form = new FormGroup({
      Name                : new FormControl('', Validators.required),
      AppLink             : new FormControl('', Validators.required),
      Established         : new FormControl('', Validators.required),
      Software            : new FormControl('', Validators.required),
      WithdrawalMethods   : new FormControl('', Validators.required),
      DepositMethods      : new FormControl('', Validators.required),
      Currencies          : new FormControl('', Validators.required),
      Languages           : new FormControl('', Validators.required),
      Licenses            : new FormControl('', Validators.required),
      WithdrawalLimits    : new FormControl('', Validators.required),
      RestrictedCountries : new FormControl('', Validators.required),
      CasinoType          : new FormControl('', Validators.required),
      ReturnToPlayer      : new FormControl('', Validators.required),
      AllowManualFlushing : new FormControl('', Validators.required),
      LiveChat            : new FormControl('', Validators.required),
      AffiliateProgram    : new FormControl('', Validators.required),
      Contacts            : new FormControl('', Validators.required),
      Website             : new FormControl('', Validators.required),
      Owner               : new FormControl('', Validators.required),
      Rate                : new FormControl('', Validators.required),
      ImageFullPath       : new FormControl(''),
      ImageFileName       : new FormControl(''),
      LaunchDate          : new FormControl('', Validators.required),
      MainOffer           : new FormControl('', Validators.required),
      MainOfferDescription: new FormControl('', Validators.required),
    });
    
   }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.mode   = params['mode'];
      this.selectedKey = params['casino'];

      if (this.selectedKey != null && this.selectedKey.length > 0) {
        this.sharedService.getCaisnoInfo(this.selectedKey).first().subscribe((res) => {
          console.log("########    Got object  ##################");
          // console.log(res);
          this.casino = res;
          this.checkSelectedCasinos()
          this.form = new FormGroup({
                Name                : new FormControl(res.raw.Name, Validators.required),
                AppLink             : new FormControl(res.raw.AppLink, Validators.required),
                Established         : new FormControl(res.raw.Established, Validators.required),
                Software            : new FormControl(res.raw.Software, Validators.required),
                WithdrawalMethods   : new FormControl(res.raw.WithdrawalMethods, Validators.required),
                DepositMethods      : new FormControl(res.raw.DepositMethods, Validators.required),
                Currencies          : new FormControl(res.raw.Currencies, Validators.required),
                Languages           : new FormControl(res.raw.Languages, Validators.required),
                Licenses            : new FormControl(res.raw.Licenses, Validators.required),
                WithdrawalLimits    : new FormControl(res.raw.WithdrawalLimits, Validators.required),
                RestrictedCountries : new FormControl(res.raw.RestrictedCountries, Validators.required),
                CasinoType          : new FormControl(res.raw.CasinoType, Validators.required),
                ReturnToPlayer      : new FormControl(res.raw.ReturnToPlayer, Validators.required),
                AllowManualFlushing : new FormControl(res.raw.AllowManualFlushing, Validators.required),
                LiveChat            : new FormControl(res.raw.LiveChat, Validators.required),
                AffiliateProgram    : new FormControl(res.raw.AffiliateProgram, Validators.required),
                Contacts            : new FormControl(res.raw.Contacts, Validators.required),
                Website             : new FormControl(res.raw.Website, Validators.required),
                Owner               : new FormControl(res.raw.Owner, Validators.required),
                Rate                : new FormControl(res.raw.Rate, Validators.required),
                ImageFullPath       : new FormControl(res.raw.ImageFullPath),
                ImageFileName       : new FormControl(res.raw.ImageFileName),
                LaunchDate          : new FormControl(res.raw.LaunchDate, Validators.required),
                MainOffer           : new FormControl(res.raw.MainOffer, Validators.required),
                MainOfferDescription: new FormControl(res.raw.MainOfferDescription, Validators.required),
              });
          if (res.raw.AlternativeOffers != null) {
            this.alternativeOffers = res.raw.AlternativeOffers
          }
        })
        /*
        */
      }
      // this.selectedImage = "https://firebasestorage.googleapis.com/v0/b/appadmin-3e908.appspot.com/o/listingimages%2Fimage4.jpg?alt=media&token=7fe3466c-8d33-471d-b5f1-559190bc1d94";
    });

    this.sharedService.allCasinos.map(list => list.map(casino => {
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
      if (this.selectedKey != null) {
        this.casinoList = this.casinoList.filter(
          casino => casino.$key != this.selectedKey
        )
      }
      this.casinoList.forEach(element => {
        this.selectedCasino.push(false);
      });
      this.checkSelectedCasinos()
    });
  }

  private checkSelectedCasinos() {
    if (this.casinoList != null && this.casino != null) {
        console.log(this.casino.recommendCasinos);
        if (this.casino.recommendCasinos != null) {
          Object.keys(this.casino.recommendCasinos).forEach((key) => {
            for (var index = 0; index < this.casinoList.length; index++) {
              var casino = this.casinoList[index];

              if (casino.$key == key) {
                this.selectedCasino[index] = true
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
    this.form.value.AlternativeOffers = this.alternativeOffers
    this.sharedService.addNewCasino(
      this.form.value, 
      this.getSelectedCasinos()
    ).then((res) => {
        this.onCancel()
        this.isLoading = false;
      }, (error) => {
        console.log(error.message);
        this.isLoading = false;
      });
  }

  private updateFormDataToDatabase() {
    this.form.value.AlternativeOffers = this.alternativeOffers
    this.sharedService.updateCasino(
      this.selectedKey, 
      this.form.value, 
      this.getSelectedCasinos()
    ).then((res) => {
        this.onCancel()
        this.isLoading = false;
      }, (error) => {
        console.log(error.message);
        this.isLoading = false;
      });
  }

  private getSelectedCasinos() {
    let selectedCasino = {}
    for (var index = 0; index < this.selectedCasino.length; index++) {
      var selected = this.selectedCasino[index];
      if (selected) {
        selectedCasino[this.casinoList[index].$key] = true
      }
    }
    return selectedCasino
  }
  
  onImageSelected(event: any) {
    this.selectedImageData = event.target.files && event.target.files[0];
    if (this.selectedImageData) {
      let reader = new FileReader();
      reader.onload = (e: any)=> this.selectedImageURL = e.target.result;
      reader.readAsDataURL(this.selectedImageData);
    }
  }

  onAddAlernativeOffer() {
    this.alternativeOffers.push({
      title: '',
      description: '',
      link: ''
    })
  }

  removeAlernativeOffer(subOffer) {
    let index = this.alternativeOffers.indexOf(subOffer)
    if (index >= 0) {
      this.alternativeOffers.splice(index, 1)
    }
  }

  onCancel() {
    this.location.back();
  }

  onDelete() {
    if(confirm("Are you sure to delete ?")) {
      this.isLoading = true;
      console.log("Implement delete functionality here");
      this.sharedService.deleteCasino(this.casino).then((res) => {
        this.onCancel();
        this.isLoading = false;
      }).catch((error) => {
        console.log('######   Error deleting casino    ######');
        console.log(error);
        this.isLoading = false;
      })
      if (this.casino) {
        this.sharedService.deletePhoto(this.casino.ImageFileName);
      }
    }
    /*
    let result = this.dialogService.confirm('Would you delete this casino?', 'Cancel', 'Yes');
      result.subscribe( () => {
          console.log('confirmed');
        },
        (err: any) => {
          console.log('declined');
        }
      ); */
  }

}
