import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-new-slot',
  templateUrl: './new-slot.component.html',
  styleUrls: ['./new-slot.component.css']
})
export class NewSlotComponent implements OnInit {

  selectedKey : string;
  slot      : any;
  form      : FormGroup;
  mode      : string;
  isLoading : boolean;
  selectedImageData : any;
  selectedImageURL  : any;

  subImages: any[] = []

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
  selectedCasino: Boolean[] = []


  constructor(
    private router        : Router,
    private route         : ActivatedRoute,
    private location      : Location,
    private sharedService : SharedService,
  ) {
    this.form = new FormGroup({
      Name              : new FormControl('', Validators.required),
      AppLink           : new FormControl('', Validators.required),
      MainOffer         : new FormControl('', Validators.required),
      ImageFileName     : new FormControl(''),
      ImageFullPath     : new FormControl(''),
    });
    
   }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.mode   = params['mode'];
      this.selectedKey = params['slot'];
      if (this.selectedKey != null && this.selectedKey.length > 0) {
        this.sharedService.getSlotInfo(this.selectedKey).first().subscribe((res) => {
          // console.log("########    Got object  ##################");
          // console.log(res);
          this.slot = res;
          if (res.raw.subImages != null) {
            this.subImages = res.raw.subImages
          } else {
            this.subImages = []
          }
          this.checkSelectedCasinos()
          this.form = new FormGroup({
                Name               : new FormControl(res.raw.Name, Validators.required),
                AppLink            : new FormControl(res.raw.AppLink, Validators.required),
                MainOffer          : new FormControl(res.raw.MainOffer, Validators.required),
                ImageFileName      : new FormControl(res.raw.ImageFileName),
                ImageFullPath      : new FormControl(res.raw.ImageFullPath),
              });
        })
        /*
        */
      }
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
    if (this.casinoList != null && this.slot != null) {
        // console.log(this.bonus.relateCasinos);
        if (this.slot.relateCasinos != null) {
          Object.keys(this.slot.relateCasinos).forEach((key) => {
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


  onPressAddImage(event: any) {
    console.log('add image')
    let selectedImageData = event.target.files && event.target.files[0];
    if (selectedImageData) {
      
      let reader = new FileReader();
      reader.onload = (res: any)=> {
        // this.selectedImageURL = res.target.result;
        this.isLoading = true
        this.sharedService
            .uploadPhoto(selectedImageData)
            .then((snapshot) => {
                // console.log('Uploaded a blob or file! Now storing the reference at', 'path');
                let newImage = {
                  filename: snapshot.metadata.name,
                  fullpath: snapshot.downloadURL,
                }
                this.subImages.push(newImage)
                this.isLoading = false
            })
            .catch(error => {
              this.isLoading = false
            });
      }
      reader.readAsDataURL(selectedImageData);
    }
  }

  onPressRemoveImage(image) {
    let index = this.subImages.indexOf(image)
    if (index !== -1) {
      if(confirm("Are you sure to delete ?")) {
        this.isLoading = true;
        this.subImages.splice(index, 1)
        this.sharedService.deletePhoto(image.filename)
            .then(_ => {
              this.isLoading = false
              
            })
            .catch(error => {
              this.isLoading = false

            });
      }
      this.subImages.splice(index, 1)
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
    this.form.value.subImages = this.subImages
    this.sharedService.addNewSlot(
      this.form.value,
      selectedCasinos
    ).then((res) => {
      this.saveSlotsToCasinos(res.key, selectedCasinos)
      this.onCancel()
      this.isLoading = false;
    }, (error) => {
      console.log(error.message);
      this.isLoading = false;
    });
  }

  private updateFormDataToDatabase() {
    let selectedCasinos = this.getSelectedCasinos();
    this.form.value.subImages = this.subImages
    this.sharedService.updateSlot(
      this.selectedKey, 
      this.form.value,
      selectedCasinos
    ).then((res) => {
      this.saveSlotsToCasinos(this.selectedKey, selectedCasinos)
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

  private saveSlotsToCasinos(slotKey: string, casinos: any) {
    for (var key in casinos) {
      this.sharedService
          .addSlotToCasino(slotKey, key)
          .then(_ => {
            console.log('added slot to casino', key)
          })
          .catch(error => {
            console.log('**** error on Adding slot to casino', key)
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
      this.sharedService.deleteSlot(this.slot).then((res) => {
        this.onCancel();
        this.isLoading = false;
      }).catch((error) => {
        console.log('######   Error deleting casino    ######');
        console.log(error);
        this.isLoading = false;
      })
      if (this.slot) {
        this.sharedService.deletePhoto(this.slot.ImageFileName);
      }
    }
  }
}
