import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Hero } from '../../models/Hero';
import { HeroesService } from '../../services/heroes.service';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-create-hero',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule, 
    MatIconModule,
    CommonModule
  ],
  templateUrl: './create-hero.component.html',
  styleUrl: './create-hero.component.scss'
})
export class CreateHeroComponent{

  heroForm: FormGroup;

  id?: string;
  name?: string; 
  description?: string; 

  @Output() heroCreated: EventEmitter<Hero> = new EventEmitter<Hero>();

  edit: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private service: HeroesService, private route: ActivatedRoute,
    private message: MessageService) { 
    this.heroForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.name = params['name'];
      this.description = params['description'];
    });
    if (this.id) {
      this.edit = true;
      this.heroForm.patchValue({
        id: this.id,
        name: this.name,
        description: this.description
      });
    }
  }
  onSubmit() {
    const {
      id,
      name,
      description
    } = this.heroForm.value;

    const newHero: Hero = {
      id : this.edit ? id : this.generateRandomId(4),
      description: description,
      name: name,
    };

    if (this.heroForm.valid) {
      if(this.edit){
        this.service.editHero(Number(newHero.id), newHero).subscribe({
          next: (val: any) => {
            this.message.openSnackBar('El héroe fue editado con éxito!');
          },
          error: (err: any) => {
            //Se envía el nuevo héroe de manera local
            this.heroCreated.emit(newHero);
            this.router.navigate(['/']);
            // Este mensaje es solo mientras la api no acepte los post
            this.message.openSnackBar('El héroe fue editado con éxito!');
            //Este mensaje es el que debería imprimir si hay un error
            //this.message.openSnackBar('Se ha producido un error');          
          },
        });
      } else {
        this.service.createHero(newHero).subscribe({
          next: (val: any) => {
            this.message.openSnackBar('El héroe fue creado con éxito!');
          },
          error: (err: any) => {
            //Se envía el nuevo héroe de manera local
            this.heroCreated.emit(newHero);
            this.router.navigate(['/landing-page']);    
            // Este mensaje es solo mientras la api no acepte los post
            this.message.openSnackBar('El héroe fue creado con éxito!');
            //Este mensaje es el que debería imprimir si hay un error
            //this.message.openSnackBar('Se ha producido un error');       
          },
        });
      }
      }
  }

  back(){
    this.router.navigate(['/landing-page']);
  }

  // Se crea un id random ya que no se puede conectar correctamente el post ocn la api 
  generateRandomId(length: number): string {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

}
