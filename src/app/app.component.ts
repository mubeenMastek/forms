import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { forbiddenNameValidator } from './shared/user-name.validator';
import { passwordValidator } from './shared/password.validator';
import { RegistrationService } from './registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Registration form';
  registrationForm: FormGroup;

  get UserName(){
    return this.registrationForm.get('userName');
  }

  get email(){
    return this.registrationForm.get('email');
  }

  get alternateEmails(){
    return this.registrationForm.get('alternateEmails') as FormArray;
  }

  addAlternateEmail(){
    return this.alternateEmails.push(this.fb.control(''));
  }

  constructor(private fb:FormBuilder, private _registrationService:RegistrationService){}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), forbiddenNameValidator(/admin/)]],
      email: [''],
      subscribe: [false],
      password: [''],
      confirmPassword: [''],
      address : this.fb.group({
        city : [''],
        state : [''],
        postalCode : ['']
      }),
      alternateEmails: this.fb.array([])
    }, {validator: passwordValidator});

    //conditional validation on checkbox
    this.registrationForm.get('subscribe').valueChanges.subscribe(checkedValue => {
      const email = this.registrationForm.get('email');
      if(checkedValue){
        email.setValidators(Validators.required)
      }else{
        email.clearValidators();
      }
      email.updateValueAndValidity();
    })
  }

  

  /*registrationForm = new FormGroup({
    userName : new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    address : new FormGroup({
      city : new FormControl(''),
      state : new FormControl(''),
      postalCode : new FormControl(''),
    })
  });*/

  loadApiData(){
    this.registrationForm.patchValue({
      userName:'Mubeen',
      password:'test',
      confirmPassword:'test',
      address:{
        city:'Ratnagiri',
        state:'Maharashtra',
        postalCode:'415612'
      }
    })
  }

  onSubmit(){
    console.log(this.registrationForm.value);
    this._registrationService.register(this.registrationForm.value)
    .subscribe(
      response => console.log('Success', response),
      error => console.log('Error', error)
    )
  }
}
