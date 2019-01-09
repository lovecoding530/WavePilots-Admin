import { Component, OnInit, ElementRef, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { SharedService } from '../shared.service';

const noop = () => {
};


@Component({
  selector: 'ng2-autocompleter',
  templateUrl: './ng2-autocompleter.component.html',
  styleUrls: ['./ng2-autocompleter.component.css'],
  host: {
    '(document:click)': 'handleClick($event)',
  },
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Ng2AutocompleterComponent),
    multi: true
  }]
})
export class Ng2AutocompleterComponent implements OnInit, ControlValueAccessor {
    @Output() onItemSelected: EventEmitter<any> = new EventEmitter();

    elementRef: ElementRef;

    private innerValue: any = '';

    private onChangeCallback: (_: any) => void = noop;
    private onTouchedCallback: ()      => void = noop;

    userList     : any;
    filteredList : any; 

    constructor(
        elementRef: ElementRef,
        private sharedService : SharedService
    ) {
        this.elementRef = elementRef;
        this.filteredList = null;
    }

    ngOnInit() {
        this.sharedService.allUsers.subscribe(users => {
          console.log(users);
            this.userList = users;
        }, (error) => {
            console.log(error);
        });
    }

    get value(): any {
        return this.innerValue;
    }

    set value(v: any) {
        
        if (v !== this.innerValue) {
        this.innerValue = v;
        this.onChangeCallback(v);
        }
    }

    writeValue(value: any) {
        this.innerValue = (value !== this.innerValue) ? value : this.innerValue;
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }


    filter() {        
        if (!this.userList) {
            this.sharedService.allUsers.subscribe(users => {
                this.userList = users;
                this.filteredList = this.userList.filter(item => item.nickname.toLowerCase().indexOf(this.value && this.value.toLowerCase() || '') > -1 );
            }, (error) => {
                console.log(error);
            });
        } else {
            this.filteredList = this.userList
                .filter(item => item.nickname.toLowerCase().indexOf(this.value && this.value.toLowerCase() || '') > -1 );
        }
        
    }

    select(item){
        this.onItemSelected.emit(item);
        this.value = item.title;
        this.filteredList = null;
    }
    
    handleClick(event){
        var clickedComponent = event.target;
        var inside = false;
        
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
            if(!inside){
                this.filteredList = null;
        }
    }
}