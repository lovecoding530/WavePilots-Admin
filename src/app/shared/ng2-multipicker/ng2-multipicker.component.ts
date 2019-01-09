import {
  Component,
  Pipe,
  OnInit,
  DoCheck,
  HostListener,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  forwardRef,
  IterableDiffers
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms'

export interface MultiSelectOption {
  id   : any;
  name : string;
  type : string;
}

export interface MultiSelectSettings {
  pullRight             ?: boolean;
  enableSearch          ?: boolean;
  checkedStyle          ?: 'checkboxes' | 'glyphicon' | 'fontawsome';
  buttonClasses         ?: string;
  selectionLimit        ?: number;
  closeOnSelect         ?: boolean;
  autoUnselect          ?: boolean;
  showCheckAll          ?: boolean;
  showUncheckAll        ?: boolean;
  dynamicTitleMaxItems  ?: number;
  maxHeight             ?: string;
}

export interface MultiSelectTexts {
  checkAll          ?: string;
  uncheckAll        ?: string;
  checked           ?: string;
  checkedPlural     ?: string;
  searchPlaceholder ?: string;
  defaultTitle      ?: string;
}

@Pipe({
  name: 'searchFilter'
})
export class MultiSelectSearchFilter {
  transform(options: Array<MultiSelectOption>, args: string): Array<MultiSelectOption> {
    return options.filter((option: MultiSelectOption) =>
      option.name && option.name
                          .toLowerCase()
                          .indexOf((args || '').toLowerCase()) > -1);
  }
}

@Component({
  selector: 'ng2-multipicker',
  templateUrl: './ng2-multipicker.component.html',
  styleUrls: ['./ng2-multipicker.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Ng2MultipickerComponent),
    multi: true
  }]
})
export class Ng2MultipickerComponent implements OnInit, DoCheck, ControlValueAccessor {

  @Input()  options               : Array<MultiSelectOption>;
  @Input()  settings              : MultiSelectSettings;
  @Input()  texts                 : MultiSelectTexts;
  @Output() selectionLimitReached : EventEmitter<any> = new EventEmitter();
  @Output() dropdownClosed        : EventEmitter<any> = new EventEmitter();

  @HostListener('document: click', ['$event.target'])
  onClick(target: HTMLElement) {
    let parentFound = false;
    while (target != null && !parentFound) {
      if (target === this.element.nativeElement) {
        parentFound = true;
      }
      target = target.parentElement;
    }
    if (!parentFound) {
      this.isVisible = false;
    }
  }

  model            : Array<string>;
  title            : string;
  differ           : any;
  numSelected      : number = 0;
  isVisible        : boolean = false;
  searchFilterText : string = '';
  defaultSettings  : MultiSelectSettings = {
    pullRight             : false,
    enableSearch          : false,
    checkedStyle          : 'checkboxes',
    buttonClasses         : 'btn btn-default btn-secondary',
    selectionLimit        : 0,
    closeOnSelect         : false,
    autoUnselect          : false,
    showCheckAll          : false,
    showUncheckAll        : false,
    dynamicTitleMaxItems  : 3,
    maxHeight             : '300px',
  };
  defaultTexts    : MultiSelectTexts = {
    checkAll          : 'Check all',
    uncheckAll        : 'Uncheck all',
    checked           : 'checked',
    checkedPlural     : 'checked',
    searchPlaceholder : 'Search...',
    defaultTitle      : 'Select',
  };

  constructor(private element: ElementRef,
    private differs: IterableDiffers) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.settings = Object.assign(this.defaultSettings, this.settings);
    this.texts = Object.assign(this.defaultTexts, this.texts);
    this.title = this.texts.defaultTitle;
  }

  onModelChange: Function = (_: any) => { };
  onModelTouched: Function = () => { };


  writeValue(value: any): void {
    if (value !== undefined) {
      this.model = value;
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  ngDoCheck() {
    let changes = this.differ.diff(this.model);
    if (changes) {
      this.updateNumSelected();
      this.updateTitle();
    }
  }

  clearSearch() {
    this.searchFilterText = '';
  }

  toggleDropdown() {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) {
      this.dropdownClosed.emit();
    }
  }

  isSelected(option: MultiSelectOption): boolean {
    let optionId: string = option.type + '#' + option.id;
    return this.model && this.model.indexOf(optionId) > -1;
  }

  setSelected(event: Event, option: MultiSelectOption) {
    if (!this.model) {
      this.model = [];
    }
    
    let optionId: string = option.type + '#' + option.id;
    console.log(optionId);
    let index = this.model.indexOf(optionId);
    if (index > -1) {
      this.model.splice(index, 1);
    } else {
      if (this.settings.selectionLimit === 0 || this.model.length < this.settings.selectionLimit) {
        this.model.push(optionId);
      } else {
        if (this.settings.autoUnselect) {
          this.model.push(optionId);
          this.model.shift();
        } else {
          this.selectionLimitReached.emit(this.model.length);
          return;
        }
      }
    }
    if (this.settings.closeOnSelect) {
      this.toggleDropdown();
    }
    this.onModelChange(this.model);
  }

  updateNumSelected() {
    this.numSelected = this.model && this.model.length || 0;
  }

  updateTitle() {
    if (this.numSelected === 0) {
      this.title = this.texts.defaultTitle;
    } else if (this.settings.dynamicTitleMaxItems >= this.numSelected) {
      this.title = this.options
        .filter((option: MultiSelectOption) =>
          this.model && this.model.indexOf(option.type + '#' + option.id) > -1
        )
        .map((option: MultiSelectOption) => option.name)
        .join(', ');
    } else {
      this.title = this.numSelected
        + ' '
        + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
    }
  }

  checkAll() {
    this.model = this.options.map(option => option.type + '#' + option.id);
    this.onModelChange(this.model);
  }

  uncheckAll() {
    this.model = [];
    this.onModelChange(this.model);
  }
}

