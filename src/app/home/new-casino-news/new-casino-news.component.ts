import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-new-casino-news',
  templateUrl: './new-casino-news.component.html',
  styleUrls: ['./new-casino-news.component.css']
})
export class NewCasinoNewsComponent implements OnInit {

  selectedKey : string;
  news      : any;
  form      : FormGroup;
  mode      : string;
  isLoading : boolean;
  selectedImageData : any;
  selectedImageURL  : any;
  private imageDownloadURL: string;

  constructor(
    private router        : Router,
    private route         : ActivatedRoute,
    private location      : Location,
    private sharedService : SharedService,
  ) {
    this.form = new FormGroup({
      Name              : new FormControl('', Validators.required),
      Content           : new FormControl('', Validators.required),
      ImageFileName     : new FormControl(''),
    });
    
   }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.mode   = params['mode'];
      this.selectedKey = params['casinonews'];
      if (this.selectedKey != null && this.selectedKey.length > 0) {
        this.sharedService.getCaisnoNewsInfo(this.selectedKey).first().subscribe((res) => {
          console.log("########    Got object  ##################");
          console.log(res);
          this.news = res;
          
          this.form = new FormGroup({
                Name               : new FormControl(res.raw.Name, Validators.required),
                Content            : new FormControl(res.raw.AppLink, Validators.required),
                ImageFileName      : new FormControl(res.raw.ImageFileName),
                ImageFullPath      : new FormControl(res.raw.ImageFullPath),
              });
        })
        /*
        */
      }
    });

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
    this.sharedService.addNewCasinoNews(this.form.value).then((res) => {
                  this.onCancel()
                  this.isLoading = false;
                }, (error) => {
                  console.log(error.message);
                  this.isLoading = false;
                });
  }

  private updateFormDataToDatabase() {
    this.sharedService.updateCasinoNews(this.selectedKey, this.form.value).then((res) => {
              this.onCancel()
              this.isLoading = false;
            }, (error) => {
              console.log(error.message);
              this.isLoading = false;
            });
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
      this.sharedService.deleteSlot(this.news).then((res) => {
        this.onCancel();
        this.isLoading = false;
      }).catch((error) => {
        console.log('######   Error deleting casino    ######');
        console.log(error);
        this.isLoading = false;
      })
    }
    if (this.news) {
      this.sharedService.deletePhoto(this.news.ImageFileName);
    }
  }
}
